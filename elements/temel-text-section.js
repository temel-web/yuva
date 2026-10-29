import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host { display: grid; justify-items: start; }
 .introduction, .body, .actions { inline-size: 100%; }
 :host(:state(introduced)) .introduction { margin-block-end: var(--space-9); }
 .heading { max-inline-size: 26ch; }
 .body { font-size: var(--text-lg); line-height: var(--leading-loose); max-inline-size: 66ch; }
 :host([measure="full"]) :is(.body, .summary, .heading) { max-inline-size: none; }
 .actions.is-filled { margin-block-start: var(--space-9); }
 :host([alignment="center"]) { justify-items: center; text-align: center; }
 :host([alignment="center"]) :is(.introduction, .heading, .summary, .body) { justify-self: center; margin-inline: auto; }
 :host([alignment="center"]) .actions { inline-size: auto; }
`);

const layout = createLayoutTemplate(
  '<div class="introduction" part="introduction"><slot name="eyebrow" class="text-slot"></slot><slot name="heading" class="text-slot"></slot><slot name="summary" class="text-slot"></slot></div><slot name="body" class="text-slot"></slot><slot name="actions"></slot><slot name="provenance"></slot>',
);

/** A band of readable text with its own introduction and actions. */
export class TemelTextSection extends PageEssentialElement {
  static temelSlots = ["eyebrow", "heading", "summary", "body", "actions", "provenance"];
  static introductionSlots = Object.freeze(["eyebrow", "heading", "summary"]);
  static layout = layout;
  static pageEssentialsStyles = styles;
}

customElements.define(
  "temel-text-section",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelTextSection)),
);
