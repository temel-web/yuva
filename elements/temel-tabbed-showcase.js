import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";
import { TabRelationships } from "./page-essentials/tab-relationships.js";

import "./temel-showcase-panel.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { display: grid; }
  .tabs-label {
    color: var(--text-secondary); font: var(--weight-semibold) var(--text-sm)/var(--leading-ui) var(--font-ui);
    letter-spacing: var(--tracking-caps);
  }
  .tabs-label.is-filled { margin-block-end: var(--space-6); }
  .default { display: flex; flex-wrap: wrap; gap: var(--space-10) var(--space-5); }
  .actions.is-filled { margin-block-start: var(--space-10); }
`);

const layout = createLayoutTemplate(
  '<div class="introduction" part="introduction"><slot name="eyebrow" class="text-slot"></slot><slot name="heading" class="text-slot"></slot><slot name="summary" class="text-slot"></slot></div><slot name="tabs-label" class="text-slot"></slot><slot></slot><slot name="actions"></slot><slot name="provenance"></slot>',
);

const TAB_KEYS = Object.freeze(["ArrowLeft", "ArrowRight", "Home", "End"]);

/**
 * A band of keyboard-operated tabs, each showing its own blocks. The authored Tabs label is the
 * tab list: it owns the panels' label buttons through `aria-owns`, so every tab stays authored DOM.
 */
export class TemelTabbedShowcase extends PageEssentialElement {
  static temelSlots = ["eyebrow", "heading", "summary", "tabs-label", "", "actions", "provenance"];
  static introductionSlots = Object.freeze(["eyebrow", "heading", "summary"]);
  static layout = layout;
  static pageEssentialsStyles = styles;
  /** @type {AbortController | null} */
  #eventController = null;
  /** @type {MutationObserver | null} */
  #contentObserver = null;
  #relationships = new TabRelationships();
  /** @type {WeakMap<Element, string>} */
  #relationshipIdByElement = new WeakMap();
  /** @type {number | null} */
  #relationshipScope = null;
  #selectedIndex = 0;
  /** @type {HTMLButtonElement | null} */
  #selectedTab = null;
  /** @type {HTMLButtonElement | null} */
  #focusedTab = null;

  connectedCallback() {
    this.#eventController = new AbortController();
    const { signal } = this.#eventController;
    this.addEventListener("click", this.handleTabClick.bind(this), { signal });
    this.addEventListener("keydown", this.handleTabKeydown.bind(this), {
      signal,
    });
    this.addEventListener("focusin", this.handleTabFocusIn.bind(this), {
      signal,
    });
    this.addEventListener("focusout", this.handleTabFocusOut.bind(this), {
      signal,
    });
    this.addEventListener("temel-changed", this.handleTemelChange.bind(this), {
      signal,
    });
    this.#contentObserver = new MutationObserver(this.handleContentMutation.bind(this));
    this.#contentObserver.observe(this, {
      attributeFilter: ["slot", "hidden"],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.#eventController?.abort();
    this.#eventController = null;
    this.#contentObserver?.disconnect();
    this.#contentObserver = null;
    this.#relationships.restoreExcept([]);
    super.disconnectedCallback();
  }

  onTemel() {
    super.onTemel();
    this.#sync();
  }

  handleSlotChange() {
    super.handleSlotChange();
    this.#sync();
  }

  handleContentMutation() {
    this.#sync();
  }

  handleTemelChange() {
    this.#sync();
  }

  /** The panel whose tab is selected, or null before any tab exists. */
  get selectedPanel() {
    return this.#pairs[this.#selectedIndex]?.panel ?? null;
  }

  /**
   * Select a panel's tab without moving focus; null returns to the first tab.
   * @param {Element | null} panel
   */
  set selectedPanel(panel) {
    const index = panel === null ? 0 : this.#pairs.findIndex((pair) => pair.panel === panel);
    if (index < 0) {
      throw new Error("temel-tabbed-showcase can only select one of its visible panels.");
    }
    this.#select(index, { shouldFocus: false });
  }

  handleTabClick(event) {
    const index = this.#tabs.indexOf(this.#eventTab(event));
    if (index >= 0) this.#select(index, { shouldFocus: false });
  }

  handleTabKeydown(event) {
    if (!TAB_KEYS.includes(event.key)) return;
    if (event.composedPath().some((node) => node.isContentEditable)) return;
    const tabs = this.#tabs;
    const currentIndex = tabs.indexOf(this.#eventTab(event));
    if (currentIndex < 0) return;
    event.preventDefault();
    const lastIndex = tabs.length - 1;
    const nextIndex = {
      ArrowRight: currentIndex === lastIndex ? 0 : currentIndex + 1,
      ArrowLeft: currentIndex === 0 ? lastIndex : currentIndex - 1,
      Home: 0,
      End: lastIndex,
    }[event.key];
    this.#select(nextIndex, { shouldFocus: true });
  }

  handleTabFocusIn(event) {
    this.#focusedTab = this.#eventTab(event);
  }

  handleTabFocusOut() {
    const tab = this.#focusedTab;
    queueMicrotask(() => {
      if (tab?.isConnected && this.#focusedTab === tab) this.#focusedTab = null;
    });
  }

  /** Visible panels paired with their label buttons, in resolved Slot order. */
  get #pairs() {
    return this.assignedTo("")
      .filter((child) => child.localName === "temel-showcase-panel" && !child.hidden)
      .map((panel) => ({
        panel: /** @type {import("./temel-showcase-panel.js").TemelShowcasePanel} */ (panel),
        tab:
          /** @type {import("./temel-showcase-panel.js").TemelShowcasePanel} */ (panel).tabButton ??
          null,
      }))
      .filter((pair) => pair.tab !== null);
  }

  get #tabs() {
    return this.#pairs.map((pair) => pair.tab);
  }

  #sync() {
    // Authored relationships stay authoritative until the connected element resolves its Slots:
    // an upgrade-time pass has no assigned children and would blank them.
    if (!this.isConnected || !this.layoutSlot("")) return;
    const pairs = this.#pairs;
    const tabs = pairs.map((pair) => pair.tab);
    const lists = this.assignedTo("tabs-label");
    this.#relationships.restoreExcept([
      ...pairs.flatMap((pair) => [pair.tab, pair.panel]),
      ...lists,
    ]);
    const retainedIndex = tabs.indexOf(this.#selectedTab);
    this.#selectedIndex =
      retainedIndex >= 0 ? retainedIndex : Math.min(this.#selectedIndex, pairs.length - 1);
    if (this.#selectedIndex >= 0) {
      const shouldFocus =
        this.#focusedTab !== null &&
        !tabs.includes(this.#focusedTab) &&
        this.ownerDocument.activeElement === this.ownerDocument.body;
      this.#select(this.#selectedIndex, { shouldFocus });
    } else {
      this.#selectedIndex = 0;
      this.#selectedTab = null;
    }
    const name =
      lists.map((list) => list.textContent.trim()).join(" ") ||
      this.assignedTo("heading")
        .map((heading) => heading.textContent.trim())
        .join(" ");
    for (const list of lists) {
      this.#relationships.remember(list);
      list.setAttribute("role", "tablist");
      list.setAttribute("aria-orientation", "horizontal");
      if (name) list.setAttribute("aria-label", name);
      if (tabs.length > 0) list.setAttribute("aria-owns", tabs.map((tab) => tab.id).join(" "));
    }
  }

  #select(index, { shouldFocus }) {
    const pairs = this.#pairs;
    if (index < 0 || index >= pairs.length) return;
    for (const [pairIndex, pair] of pairs.entries()) {
      this.#syncPair(pair, pairIndex === index);
    }
    this.#selectedIndex = index;
    this.#selectedTab = pairs[index].tab;
    if (shouldFocus) this.#selectedTab.focus();
  }

  #syncPair({ tab, panel }, isSelected) {
    this.#relationships.remember(tab);
    this.#relationships.remember(panel);
    tab.id = this.#relationshipId(tab, "tab");
    panel.id = this.#relationshipId(panel, "panel", tab.getAttribute("aria-controls"));
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panel.id);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    this.#relationships.restoreAttribute(panel, "role");
    this.#relationships.restoreAttribute(panel, "aria-labelledby");
    if (isSelected) {
      panel.setAttribute("role", "tabpanel");
      if (!panel.hasAttribute("aria-labelledby")) panel.setAttribute("aria-labelledby", tab.id);
    } else {
      panel.removeAttribute("role");
    }
    panel.dataset.state = isSelected ? "active" : "inactive";
    panel.contentTabIndex = isSelected ? 0 : -1;
  }

  #eventTab(event) {
    const tabs = this.#tabs;
    return (
      event
        .composedPath()
        .find((node) => node instanceof HTMLButtonElement && tabs.includes(node)) ?? null
    );
  }

  /**
   * Keep an authored ID, or adopt the one its counterpart already references; otherwise derive a
   * stable ID that is unique in this tree.
   * @param {Element} element
   * @param {string} relationshipKind
   * @param {string | null} [referencedId]
   */
  #relationshipId(element, relationshipKind, referencedId = null) {
    const root = /** @type {Document | ShadowRoot} */ (this.getRootNode());
    const existingId = element.id || this.#relationshipIdByElement.get(element) || referencedId;
    if (existingId && [null, element].includes(root.getElementById(existingId))) {
      this.#relationshipIdByElement.set(element, existingId);
      return existingId;
    }
    let relationshipIndex = 1;
    let relationshipId;
    do {
      relationshipId = `tabbed-showcase-${this.#scope}-${relationshipKind}-${relationshipIndex}`;
      relationshipIndex += 1;
    } while (root.getElementById(relationshipId));
    this.#relationshipIdByElement.set(element, relationshipId);
    return relationshipId;
  }

  get #scope() {
    if (this.#relationshipScope === null) {
      const root = /** @type {Document | ShadowRoot} */ (this.getRootNode());
      this.#relationshipScope =
        [...root.querySelectorAll("temel-tabbed-showcase")].indexOf(this) + 1;
    }
    return this.#relationshipScope;
  }
}

customElements.define(
  "temel-tabbed-showcase",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelTabbedShowcase)),
);
