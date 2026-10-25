import { TemelElement } from "/@/runtime/temel-element.js";
import "/@/runtime/temel-provenance.js";

import {
  adoptPageEssentialsDocumentStyles,
  pageEssentialsFoundationStyles,
} from "./page-essentials-styles.js";

/**
 * Parse one constant, structure-only shadow layout at module load. Each `<slot>` placeholder is
 * replaced by `temelSlot(name)` in `onTemel()`; its classes, `part`, and `role` carry over.
 * @param {string} markup
 */
export function createLayoutTemplate(markup) {
  const template = document.createElement("template");
  template.innerHTML = markup;
  return template;
}

const DEFAULT_LAYOUT = createLayoutTemplate(
  '<slot class="default"></slot><slot name="provenance"></slot>',
);
const CARRIED_ATTRIBUTES = Object.freeze(["part", "role"]);

/** @param {HTMLSlotElement} slot */
function hasSlotContent(slot) {
  const nodes = slot.assignedNodes({ flatten: true });
  if (!slot.classList.contains("text-slot")) {
    return nodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        /** @type {Element} */ (node).localName !== "template",
    );
  }
  return nodes.some((node) => Boolean(node.textContent?.trim()));
}

/**
 * Native Slot composition shared by Page Essentials. Subclasses own their layout template,
 * presentation, and semantic responsibility.
 */
export class PageEssentialElement extends TemelElement(HTMLElement) {
  static temelSlots = ["", "provenance"];
  static layout = DEFAULT_LAYOUT;
  static pageEssentialsStyles = new CSSStyleSheet();
  /** @type {readonly CSSStyleSheet[]} Sheets shared by a family of elements, before their own. */
  static sharedStyles = Object.freeze([]);
  /**
   * @type {string | null} Collection block whose list this element joins: inside it, the
   * layout's `.item` wrapper becomes a list item. Authored attributes stay untouched.
   */
  static collectionTag = null;
  /** Text Slots that form the element's introduction; any content sets `:state(introduced)`. */
  static introductionSlots = Object.freeze([]);
  /** @type {string | null} */
  static semanticRole = null;
  /** @type {string | null} Slot whose assigned elements name the host. */
  static nameSlot = null;

  #semantics;
  /** @type {Map<string, HTMLSlotElement>} */
  #slotByName = new Map();
  #textObserver = new MutationObserver(this.handleTextMutation.bind(this));

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [
      pageEssentialsFoundationStyles,
      ...this.#definition.sharedStyles,
      this.#definition.pageEssentialsStyles,
    ];
    this.#semantics = this.attachInternals();
    shadow.addEventListener("slotchange", this.handleSlotChange.bind(this));
  }

  connectedCallback() {
    adoptPageEssentialsDocumentStyles(/** @type {Document | ShadowRoot} */ (this.getRootNode()));
    this.syncSemanticRole();
    this.#textObserver.observe(this, {
      characterData: true,
      childList: true,
      subtree: true,
    });
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.#textObserver.disconnect();
    super.disconnectedCallback();
  }

  onTemel() {
    const layout = /** @type {DocumentFragment} */ (
      this.#definition.layout.content.cloneNode(true)
    );
    this.#slotByName.clear();
    for (const placeholder of layout.querySelectorAll("slot")) {
      const name = placeholder.getAttribute("name") ?? "";
      const slot = this.temelSlot(name);
      const className = `${placeholder.className} ${name || "default"}`.trim();
      for (const cascadeSlot of [slot, ...slot.querySelectorAll("slot")]) {
        cascadeSlot.className = className;
      }
      for (const attribute of CARRIED_ATTRIBUTES) {
        const value = placeholder.getAttribute(attribute);
        if (value !== null) slot.setAttribute(attribute, value);
      }
      placeholder.replaceWith(slot);
      this.#slotByName.set(name, slot);
    }
    this.shadowRoot.replaceChildren(layout);
    this.syncSemanticRole();
    this.handleSlotChange();
  }

  /** The element's ARIA role; a subclass may derive it from its current context. */
  get semanticRole() {
    return this.#definition.semanticRole;
  }

  /** Reapply the current role and list membership after the context they derive from changes. */
  syncSemanticRole() {
    this.#semantics.role = this.semanticRole;
    const item = this.shadowRoot.querySelector(".item");
    if (!item) return;
    const collectionTag = this.#definition.collectionTag;
    if (collectionTag !== null && this.parentElement?.localName === collectionTag) {
      item.setAttribute("role", "listitem");
    } else {
      item.removeAttribute("role");
    }
  }

  /**
   * The rendered Slot for a declared name, or null before the first render.
   * @param {string} name
   * @returns {HTMLSlotElement | null}
   */
  layoutSlot(name) {
    return this.#slotByName.get(name) ?? null;
  }

  /**
   * Elements currently assigned to a declared Slot, including the active variation.
   * @param {string} name
   * @returns {Element[]}
   */
  assignedTo(name) {
    const elements = this.layoutSlot(name)?.assignedElements({ flatten: true }) ?? [];
    return elements.filter((element) => element.localName !== "template");
  }

  /**
   * Toggle a runtime-owned custom state for `:state()` presentation.
   * @param {string} state
   * @param {boolean} isActive
   */
  toggleCustomState(state, isActive) {
    if (isActive) this.#semantics.states.add(state);
    else this.#semantics.states.delete(state);
  }

  handleSlotChange() {
    this.#syncSlotContent();
    const nameSlot = this.#definition.nameSlot;
    if (nameSlot !== null) {
      this.#semantics.ariaLabelledByElements = this.assignedTo(nameSlot);
    }
  }

  handleTextMutation() {
    this.#syncSlotContent();
  }

  /** Mark filled Slots so empty ones stay selectable without adding spacing. */
  #syncSlotContent() {
    const introductionSlots = this.#definition.introductionSlots;
    let isIntroduced = false;
    for (const [name, slot] of this.#slotByName) {
      if (name === "provenance") continue;
      const isFilled = hasSlotContent(slot);
      slot.classList.toggle("is-filled", isFilled);
      if (isFilled && introductionSlots.includes(name)) isIntroduced = true;
    }
    this.toggleCustomState("introduced", isIntroduced);
  }

  get #definition() {
    return /** @type {typeof PageEssentialElement} */ (this.constructor);
  }
}
