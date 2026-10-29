import { PageCollectionElement } from "./page-essentials/page-collection-element.js";

import "./temel-content-card.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .heading { font: var(--weight-semibold) clamp(var(--text-3xl), 4cqi, var(--text-5xl))/1.05 var(--font-ui); letter-spacing: -0.03em; max-inline-size: 15ch; }
 .items { row-gap: var(--space-11); }
 :host([layout="rows"]) .items { grid-template-columns: minmax(0, 1fr); gap: 0; }
 :host([layout="rows"]) .items::slotted(temel-content-card) {
   border-block-end: var(--border-width) var(--border-style) var(--border-default);
   padding-block: var(--space-9);
 }
`);

/** A band of Content Cards with its own introduction and actions, as a grid or as rows. */
export class TemelCards extends PageCollectionElement {
  static pageEssentialsStyles = styles;
  static observedAttributes = ["layout"];

  attributeChangedCallback() {
    this.#arrangeCards();
  }

  handleSlotChange() {
    super.handleSlotChange();
    this.#arrangeCards();
  }

  #arrangeCards() {
    const arrangement = this.getAttribute("layout") === "rows" ? "row" : "tile";
    for (const card of this.assignedTo("")) {
      if (card.localName !== "temel-content-card") continue;
      customElements.upgrade(card);
      /** @type {import("./temel-content-card.js").TemelContentCard} */ (card).arrangement =
        arrangement;
    }
  }
}

customElements.define(
  "temel-cards",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelCards)),
);
