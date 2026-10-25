import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const QUOTATION_MARK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 40'%3E%3Cpath d='M0 40V24C0 10 7 2 20 0l2 6c-7 2-11 7-11 14h9v20zm26 0V24c0-14 7-22 20-24l2 6c-7 2-11 7-11 14h9v20z'/%3E%3C/svg%3E\")";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 figure { display: grid; gap: var(--space-8); margin: 0; }
 :host(:not([layout="mark"], [layout="centered"])) figure {
   border-inline-start: var(--border-width-thick) var(--border-style) var(--accent);
   padding-inline-start: var(--space-10);
 }
 .mark {
   display: none; inline-size: var(--space-12); block-size: var(--space-11); background: var(--accent);
   mask: ${QUOTATION_MARK} 0 50% / contain no-repeat;
 }
 :host(:is([layout="mark"], [layout="centered"])) .mark { display: block; }
 :host([layout="centered"]) figure { justify-items: center; text-align: center; }
 :host([layout="centered"]) .mark { mask-position: center; }
 blockquote { margin: 0; }
 .text {
   font: var(--weight-regular) clamp(var(--text-2xl), 4cqi, var(--text-5xl))/var(--leading-snug) var(--font-display);
   letter-spacing: var(--tracking-tight); max-inline-size: 34ch; text-wrap: pretty;
 }
 :host([layout="centered"]) .text { margin-inline: auto; }
 .credit { display: flex; align-items: center; gap: var(--space-5); color: var(--text-primary); font-weight: var(--weight-semibold); }
 .credit::before {
   content: ""; flex: none; inline-size: var(--space-8);
   border-block-start: var(--border-width-thick) var(--border-style) var(--accent);
 }
`);

const layout = createLayoutTemplate(
  '<figure><div class="mark" aria-hidden="true"></div><blockquote><slot name="text" class="text-slot"></slot></blockquote><figcaption><slot name="credit" class="text-slot"></slot></figcaption></figure><slot name="provenance"></slot>',
);

/** A band for one attributed quotation or editorial pull quote. */
export class TemelQuote extends PageEssentialElement {
  static temelSlots = ["text", "credit", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
}

customElements.define(
  "temel-quote",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelQuote)),
);
