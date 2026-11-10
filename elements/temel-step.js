import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .step {
   display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: var(--space-8);
   row-gap: var(--space-4); align-content: start;
 }
 .step:has(.marker:empty) { grid-template-columns: minmax(0, 1fr); }
 .marker {
   grid-row: 1 / span 2; display: grid; place-items: center;
   inline-size: var(--space-12); block-size: var(--space-12); border-radius: var(--radius-pill);
   background: var(--accent-subtle); color: var(--accent-text);
   box-shadow: inset 0 0 0 var(--border-width) color-mix(in srgb, var(--accent) 30%, transparent);
   font: var(--weight-semibold) var(--text-lg)/1 var(--font-display); font-variant-numeric: tabular-nums;
 }
 .marker:empty { display: none; }
 .heading {
   font: var(--weight-semibold) var(--text-2xl)/var(--leading-snug) var(--font-display);
   letter-spacing: var(--tracking-tight); padding-block-start: var(--space-3); max-inline-size: none;
 }
 .body { color: var(--text-secondary); max-inline-size: 60ch; }
`);

const layout = createLayoutTemplate(
  '<div class="item step"><span class="marker" aria-hidden="true"></span><slot name="heading" class="text-slot"></slot><slot name="body" class="text-slot"></slot></div><slot name="provenance"></slot>',
);

/** One numbered stage of a Steps block: a heading and its description. */
export class TemelStep extends PageEssentialElement {
  static temelSlots = ["heading", "body", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static collectionTag = "temel-steps";
  /** @type {number | null} */
  #position = null;

  onTemel() {
    super.onTemel();
    this.#renderPosition();
  }

  disconnectedCallback() {
    this.position = null;
    super.disconnectedCallback();
  }

  /** The ordinal assigned by the owning Steps block from the current order, or null. */
  set position(position) {
    this.#position = position;
    this.#renderPosition();
  }

  #renderPosition() {
    const marker = this.shadowRoot.querySelector(".marker");
    if (marker) marker.textContent = this.#position === null ? "" : String(this.#position);
  }
}

customElements.define(
  "temel-step",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelStep)),
);
