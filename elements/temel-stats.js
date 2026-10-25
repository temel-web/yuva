import { PageCollectionElement } from "./page-essentials/page-collection-element.js";

import "./temel-stat.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .items { gap: var(--space-10) var(--space-9); }
`);

/** A band of Statistics with its own introduction and actions. */
export class TemelStats extends PageCollectionElement {
  static pageEssentialsStyles = styles;
}

customElements.define(
  "temel-stats",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelStats)),
);
