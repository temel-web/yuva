import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

import "./temel-comparison-cell.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host {
   container-type: normal; display: grid; grid-column: 1 / -1; grid-template-columns: subgrid;
   border-block-start: var(--border-width) var(--border-style) var(--border-subtle);
   transition: background-color var(--dur-base) var(--ease-out);
 }
 .row { display: grid; grid-column: 1 / -1; grid-template-columns: subgrid; }
 :host(:hover) { background: var(--surface-hover); }
 .header {
   grid-column: 1; display: flex; align-items: center; padding: var(--space-6) var(--space-7);
   font: var(--weight-semibold) var(--text-md)/var(--leading-snug) var(--font-ui);
   position: sticky; inset-inline-start: 0; z-index: 1; background: var(--surface-card);
 }
 :host(:hover) .header { background: linear-gradient(var(--surface-hover), var(--surface-hover)), var(--surface-card); }
 .default {
   display: grid; grid-column: 2 / -1; grid-template-columns: subgrid;
   font: var(--weight-regular) var(--text-md)/var(--leading-snug) var(--font-ui);
 }
 :host(:state(head)) { border-block-start: 0; background: var(--surface-panel); }
 :host(:state(head)) .header { background: var(--surface-panel); }
 :host(:state(head)) :is(.header, .default) {
   font: var(--weight-semibold) var(--text-lg)/var(--leading-snug) var(--font-display);
 }
`);

const layout = createLayoutTemplate(
  '<div class="row" role="row"><div class="header"><slot name="label" class="text-slot"></slot></div><slot></slot></div><slot name="provenance"></slot>',
);

/** One labelled row of values in a Comparison Table; in the table's head it names the columns. */
export class TemelComparisonRow extends PageEssentialElement {
  static temelSlots = ["label", "", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static observedAttributes = ["slot"];

  onTemel() {
    super.onTemel();
    this.#syncHeaderState();
  }

  attributeChangedCallback() {
    if (this.shadowRoot.firstElementChild) this.#syncHeaderState();
  }

  handleSlotChange() {
    super.handleSlotChange();
    if (this.shadowRoot.firstElementChild) this.#syncHeaderState();
  }

  /** Whether this row is assigned to the table head, including its variations. */
  get isHeaderRow() {
    return /^head(@|$)/u.test(this.slot);
  }

  #syncHeaderState() {
    this.toggleCustomState("head", this.isHeaderRow);
    this.shadowRoot
      .querySelector(".header")
      .setAttribute("role", this.isHeaderRow ? "columnheader" : "rowheader");
    for (const cell of this.children) {
      if (cell.localName !== "temel-comparison-cell") continue;
      // Rows upgrade before their cells when definitions load after parsing.
      customElements.upgrade(cell);
      /** @type {PageEssentialElement} */ (cell).syncSemanticRole();
    }
  }
}

customElements.define(
  "temel-comparison-row",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelComparisonRow)),
);
