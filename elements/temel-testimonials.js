import { PageCollectionElement } from "./page-essentials/page-collection-element.js";

import "./temel-testimonial.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .items { gap: var(--space-11) var(--space-10); }
`);

/** A band of Testimonials with its own introduction and actions. */
export class TemelTestimonials extends PageCollectionElement {
  static pageEssentialsStyles = styles;
}

customElements.define(
  "temel-testimonials",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelTestimonials)),
);
