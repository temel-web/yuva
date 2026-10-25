import { PageCollectionElement } from "./page-essentials/page-collection-element.js";

import "./temel-pricing-plan.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .items { align-items: stretch; }
`);

/** A band of Pricing Plans with its own introduction and actions. */
export class TemelPricing extends PageCollectionElement {
  static pageEssentialsStyles = styles;
}

customElements.define(
  "temel-pricing",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelPricing)),
);
