import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

import "./temel-price.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .item { block-size: 100%; }
 article {
   display: flex; flex-direction: column; block-size: 100%;
   padding: clamp(var(--space-8), 5cqi, var(--space-10));
   border: var(--border-width) var(--border-style) var(--border-default); border-radius: var(--radius-lg);
   background: var(--surface-card);
   transition: box-shadow var(--dur-slow) var(--ease-out), border-color var(--dur-slow) var(--ease-out);
 }
 article:hover { border-color: var(--border-strong); box-shadow: var(--shadow-widget); }
 :host([emphasis="featured"]) article {
   border: var(--border-width-thick) var(--border-style) var(--accent); box-shadow: var(--shadow-dialog);
   background-image: linear-gradient(to bottom, color-mix(in srgb, var(--accent) 8%, transparent), transparent 40%);
 }
 article > slot + slot { margin-block-start: var(--space-6); }
 article > slot.badge:not(.is-filled) + slot { margin-block-start: 0; }
 .badge {
   align-self: start; font: var(--weight-semibold) var(--text-sm)/var(--leading-ui) var(--font-ui);
   letter-spacing: var(--tracking-caps);
 }
 .badge.is-filled {
   background: var(--accent-subtle); color: var(--accent-text); border-radius: var(--radius-pill);
   padding: var(--space-2) var(--space-5);
 }
 :host([emphasis="featured"]) .badge.is-filled { background: var(--accent); color: var(--text-on-accent); }
 .heading { font-size: var(--text-2xl); line-height: var(--leading-snug); max-inline-size: none; }
 .summary { font-size: var(--text-md); }
 .price { padding-block: var(--space-4); }
 .body {
   flex-grow: 1; border-block-start: var(--border-width) var(--border-style) var(--border-default);
   padding-block-start: var(--space-8); font-size: var(--text-md);
 }
 .footnote { color: var(--text-secondary); font: var(--weight-regular) var(--text-sm)/var(--leading-body) var(--font-ui); }
`);

const layout = createLayoutTemplate(
  '<div class="item"><article><slot name="badge" class="text-slot"></slot><slot name="heading" class="text-slot"></slot><slot name="summary" class="text-slot"></slot><slot name="price"></slot><slot name="body" class="text-slot"></slot><slot name="actions"></slot><slot name="footnote" class="text-slot"></slot></article></div><slot name="provenance"></slot>',
);

/** One offer in a Pricing block: its name, price, inclusions, terms, and actions. */
export class TemelPricingPlan extends PageEssentialElement {
  static temelSlots = [
    "badge",
    "heading",
    "summary",
    "price",
    "body",
    "actions",
    "footnote",
    "provenance",
  ];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static collectionTag = "temel-pricing";

  handleSlotChange() {
    super.handleSlotChange();
    const article = this.shadowRoot.querySelector("article");
    if (article) article.ariaLabelledByElements = this.assignedTo("heading");
  }
}

customElements.define(
  "temel-pricing-plan",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelPricingPlan)),
);
