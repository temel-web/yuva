import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { display: grid; gap: var(--space-9); }
  :host([data-state]) { display: contents; }
  :host([hidden]) { display: none; }
  .label { flex: 0 1 auto; font: var(--type-ui-strong); }
  .label::slotted(button) {
    appearance: none; background: transparent; border: var(--border-width) solid var(--border-default);
    border-radius: var(--radius-pill); color: var(--text-secondary); cursor: pointer;
    font: inherit; min-block-size: var(--space-11); max-inline-size: 100%;
    padding: var(--space-5) var(--space-9); overflow-wrap: anywhere; transition: var(--transition-control);
  }
  .label::slotted(button:hover) { background: var(--surface-hover); color: var(--text-primary); border-color: var(--border-strong); }
  .label::slotted(button[aria-selected="true"]) {
    background: var(--accent); border-color: var(--accent); color: var(--text-on-accent);
  }
  .content { min-inline-size: 0; flex: 1 0 100%; order: 1; container-type: inline-size; }
  .default { display: grid; gap: var(--space-11); }
  @keyframes panel-enter { from { opacity: 0; translate: 0 var(--space-4); } }
  @media (prefers-reduced-motion: no-preference) {
    :host([data-state="active"]) .content { animation: panel-enter var(--dur-slowest) var(--ease-out); }
  }
  :host([data-state="inactive"]) .content { display: none; }
`);

const layout = createLayoutTemplate(
  '<slot name="label" class="text-slot"></slot><div class="content"><slot></slot><slot name="provenance"></slot></div>',
);

/** One tab of a Tabbed Showcase: its button label and the blocks it shows. */
export class TemelShowcasePanel extends PageEssentialElement {
  static temelSlots = ["label", "", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  /** @type {number | null} */
  #contentTabIndex = null;

  onTemel() {
    super.onTemel();
    this.#applyContentTabIndex();
  }

  disconnectedCallback() {
    this.contentTabIndex = null;
    super.disconnectedCallback();
  }

  /** The current authored label button, including its resolved variation. */
  get tabButton() {
    return (
      this.assignedTo("label").find(
        (element) => element instanceof HTMLButtonElement && !element.hidden,
      ) ?? null
    );
  }

  /** The rendered content region, which the owning showcase exposes as the tab panel's focus target. */
  get contentElement() {
    return this.shadowRoot.querySelector(".content");
  }

  /** @param {number | null} tabIndex */
  set contentTabIndex(tabIndex) {
    this.#contentTabIndex = tabIndex;
    this.#applyContentTabIndex();
  }

  handleSlotChange() {
    super.handleSlotChange();
    this.dispatchEvent(new CustomEvent("temel-changed", { bubbles: true, composed: true }));
  }

  #applyContentTabIndex() {
    const content = this.contentElement;
    if (!content) return;
    if (this.#contentTabIndex === null) content.removeAttribute("tabindex");
    else content.tabIndex = this.#contentTabIndex;
  }
}

customElements.define(
  "temel-showcase-panel",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelShowcasePanel)),
);
