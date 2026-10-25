import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .item { display: grid; align-content: start; gap: var(--space-4); }
 :host {
   border-block-start: var(--border-width) var(--border-style) var(--border-default);
   padding-block-start: var(--space-8);
 }
 :host([emphasis="accent"]) { border-block-start: var(--border-width-thick) var(--border-style) var(--accent); }
 :host([alignment="center"]) .item { justify-items: center; text-align: center; }
 .value {
   font: var(--weight-semibold) clamp(var(--text-5xl), 10cqi, calc(var(--text-6xl) * 1.3))/var(--leading-tight) var(--font-display);
   letter-spacing: var(--tracking-tight); font-variant-numeric: tabular-nums;
 }
 :host([emphasis="accent"]) .value { color: var(--accent-text); }
 .label { font: var(--weight-semibold) var(--text-md)/var(--leading-snug) var(--font-ui); }
 .summary { font: var(--weight-regular) var(--text-sm)/var(--leading-body) var(--font-ui); max-inline-size: 36ch; }
`);

const layout = createLayoutTemplate(
  '<div class="item"><slot name="value" class="text-slot"></slot><slot name="label" class="text-slot"></slot><slot name="summary" class="text-slot"></slot></div><slot name="provenance"></slot>',
);

/** One figure in a Stats block: an authored value, what it measures, and its context. */
export class TemelStat extends PageEssentialElement {
  static temelSlots = ["value", "label", "summary", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static collectionTag = "temel-stats";
}

customElements.define(
  "temel-stat",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelStat)),
);
