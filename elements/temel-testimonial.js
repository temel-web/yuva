import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const QUOTATION_MARK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 40'%3E%3Cpath d='M0 40V24C0 10 7 2 20 0l2 6c-7 2-11 7-11 14h9v20zm26 0V24c0-14 7-22 20-24l2 6c-7 2-11 7-11 14h9v20z'/%3E%3C/svg%3E\")";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .item { block-size: 100%; }
 figure { display: grid; gap: var(--space-8); margin: 0; block-size: 100%; align-content: start; }
 .mark {
   inline-size: var(--space-10); block-size: var(--space-9); background: var(--accent);
   mask: ${QUOTATION_MARK} 0 50% / contain no-repeat;
 }
 blockquote { margin: 0; }
 .statement {
   font: var(--weight-regular) clamp(var(--text-xl), 3cqi, var(--text-3xl))/var(--leading-snug) var(--font-display);
   letter-spacing: var(--tracking-tight); max-inline-size: 40ch; text-wrap: pretty;
 }
 figcaption { display: flex; align-items: center; gap: var(--space-6); }
 .portrait { flex: none; inline-size: var(--space-2); block-size: var(--space-12); border-radius: var(--radius-pill); overflow: clip; }
 .portrait.is-filled { inline-size: var(--space-12); }
 .portrait::slotted(*) { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; }
 .identity { display: grid; gap: var(--space-1); min-inline-size: 0; }
 .name { font: var(--weight-semibold) var(--text-md)/var(--leading-snug) var(--font-ui); }
 .role { color: var(--text-secondary); font: var(--weight-regular) var(--text-sm)/var(--leading-body) var(--font-ui); }
 :host([layout="centered"]) figure { justify-items: center; text-align: center; }
 :host([layout="centered"]) .mark { mask-position: center; }
 :host([layout="centered"]) figcaption { flex-direction: column; }
`);

const layout = createLayoutTemplate(
  '<div class="item"><figure><div class="mark" aria-hidden="true"></div><blockquote><slot name="statement" class="text-slot"></slot></blockquote><figcaption><slot name="portrait"></slot><div class="identity"><slot name="name" class="text-slot"></slot><slot name="role" class="text-slot"></slot></div></figcaption></figure></div><slot name="provenance"></slot>',
);

/** One person's statement in a Testimonials block, with their name, role, and portrait. */
export class TemelTestimonial extends PageEssentialElement {
  static temelSlots = ["statement", "portrait", "name", "role", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static collectionTag = "temel-testimonials";
}

customElements.define(
  "temel-testimonial",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelTestimonial)),
);
