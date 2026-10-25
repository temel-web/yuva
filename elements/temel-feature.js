import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-10); align-items: center; }
 .layout:has(> .media:not(.is-filled)) { gap: 0; }
 :host([alignment="start"]) .layout { align-items: start; }
 .copy { display: grid; align-content: start; min-inline-size: 0; }
 :host(:state(introduced)) .introduction { margin-block-end: var(--space-8); }
 .body { color: var(--text-secondary); max-inline-size: 62ch; }
 .actions.is-filled { margin-block-start: var(--space-9); }
 @container (min-width: 44rem) {
   .layout { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: clamp(var(--space-10), 6cqi, var(--space-13)); }
   :host([ratio="media-wide"]:not([media-position="end"])) .layout,
   :host([ratio="content-wide"][media-position="end"]) .layout { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
   :host([ratio="content-wide"]:not([media-position="end"])) .layout,
   :host([ratio="media-wide"][media-position="end"]) .layout { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
 }
`);

const layout = createLayoutTemplate(
  '<div class="layout"><slot name="media"></slot><div class="copy"><div class="introduction" part="introduction"><slot name="eyebrow" class="text-slot"></slot><slot name="heading" class="text-slot"></slot><slot name="summary" class="text-slot"></slot></div><slot name="body" class="text-slot"></slot><slot name="actions"></slot></div></div><slot name="provenance"></slot>',
);

/** A band that pairs media with its own introduction, body text, and actions. */
export class TemelFeature extends PageEssentialElement {
  static temelSlots = ["eyebrow", "heading", "summary", "body", "actions", "media", "provenance"];
  static introductionSlots = Object.freeze(["eyebrow", "heading", "summary"]);
  static layout = layout;
  static pageEssentialsStyles = styles;
  static observedAttributes = ["media-position"];

  onTemel() {
    super.onTemel();
    this.#placeMedia();
  }

  attributeChangedCallback() {
    this.#placeMedia();
  }

  /** Keep the reading order identical to the visual column order. */
  #placeMedia() {
    const media = this.layoutSlot("media");
    const copy = this.shadowRoot.querySelector(".copy");
    if (!media || !copy) return;
    if (this.getAttribute("media-position") === "end") copy.after(media);
    else copy.before(media);
  }
}

customElements.define(
  "temel-feature",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelFeature)),
);
