import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 /* Prices contribute their intrinsic width to surrounding grid and flex layouts. */
 :host { container-type: normal; display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-3) var(--space-5); }
 .prefix {
   flex-basis: 100%; color: var(--text-secondary); letter-spacing: var(--tracking-caps);
   font: var(--weight-semibold) var(--text-sm)/var(--leading-ui) var(--font-ui);
 }
 .default {
   font: var(--weight-semibold) var(--text-5xl)/var(--leading-tight) var(--font-display);
   letter-spacing: var(--tracking-tight); font-variant-numeric: tabular-nums;
 }
 :host([size="compact"]) .default { font-size: var(--text-3xl); }
 .period { color: var(--text-secondary); font-size: var(--text-md); }
 .note {
   flex-basis: 100%; color: var(--text-secondary);
   font: var(--weight-regular) var(--text-sm)/var(--leading-body) var(--font-ui);
 }
`);

const layout = createLayoutTemplate(
  '<slot name="prefix" class="text-slot"></slot><slot class="text-slot"></slot><slot name="period" class="text-slot"></slot><slot name="note" class="text-slot"></slot><slot name="provenance"></slot>',
);

/** An authored static amount with its currency context, billing period, and notes. */
export class TemelPrice extends PageEssentialElement {
  static temelSlots = ["prefix", "", "period", "note", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
}

customElements.define(
  "temel-price",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelPrice)),
);
