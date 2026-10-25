import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host { display: grid; gap: var(--space-5); align-content: start; }
 .default { overflow: clip; border-radius: var(--radius-sm); }
 .default::slotted(*) { display: block; inline-size: 100%; block-size: auto; }
 :host(:is([frame="rounded"], [frame="elevated"])) .default { border-radius: var(--radius-lg); }
 :host([frame="elevated"]) .default { box-shadow: var(--shadow-dialog); }
 :host([frame="square"]) .default { border-radius: var(--radius-none); }
 :host([ratio="landscape"]) .default { aspect-ratio: 3 / 2; }
 :host([ratio="portrait"]) .default { aspect-ratio: 4 / 5; }
 :host([ratio="square"]) .default { aspect-ratio: 1; }
 :host([ratio="wide"]) .default { aspect-ratio: 16 / 9; }
 :host([ratio]:not([ratio="auto"])) .default::slotted(*) { block-size: 100%; object-fit: cover; }
 :host([fit="contain"]) .default::slotted(*) { object-fit: contain; }
 .caption { max-inline-size: 66ch; }
`);

const layout = createLayoutTemplate(
  '<slot></slot><slot name="caption" class="text-slot"></slot><slot name="provenance"></slot>',
);

/** A responsive image or video with fitting, aspect ratio, and an editable caption. */
export class TemelFigure extends PageEssentialElement {
  static temelSlots = ["", "caption", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static semanticRole = "figure";
  static nameSlot = "caption";
}

customElements.define(
  "temel-figure",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelFigure)),
);
