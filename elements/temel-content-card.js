import { node, layoutTemplate } from "./page-essentials/layout-template.js";
import { PageEssentialElement } from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .item { block-size: 100%; }
 article { display: flex; flex-direction: column; block-size: 100%; gap: var(--space-7); }
 .introduction { margin-block-end: 0; }
 .media { display: block; min-inline-size: 0; }
 .text-column { display: grid; align-content: center; gap: var(--space-7); min-inline-size: 0; }
 .heading { font: var(--weight-semibold) var(--text-3xl)/1.05 var(--font-ui); letter-spacing: -0.03em; max-inline-size: none; }
 .body { color: var(--text-secondary); max-inline-size: 33ch; }
 .actions.is-filled { margin-block-start: 0; }
 :host(:state(row)) .heading { font-size: clamp(var(--text-3xl), 4.5cqi, var(--text-6xl)); }
 @container (min-width: 36rem) {
   :host(:state(row)) article { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 0.9fr); column-gap: var(--space-10); align-items: center; }
   :host(:state(row)) .introduction { align-self: start; padding-block-start: var(--space-6); }
 }
 @media (prefers-reduced-motion: no-preference) {
   :host(:state(row)) .media { transition: translate var(--dur-slow) var(--ease-out); }
   :host(:state(row):hover) .media { translate: 0 calc(-1 * var(--space-3)); }
 }
`);

const layout = layoutTemplate(
  node("div", { class: "item" }, [
    node("article", {}, [
      node("header", { class: "introduction" }, [
        node("slot", { name: "eyebrow", class: "text-slot" }),
        node("slot", { name: "heading", class: "text-slot" }),
      ]),
      node("slot", { name: "media" }),
      node("div", { class: "text-column" }, [
        node("slot", { name: "body", class: "text-slot" }),
        node("slot", { name: "actions" }),
      ]),
    ]),
  ]),
  node("slot", { name: "provenance" }),
);

/** One item in a Cards block: media, an eyebrow, a heading, a description, and actions. */
export class TemelContentCard extends PageEssentialElement {
  static temelSlots = ["eyebrow", "heading", "media", "body", "actions", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static collectionTag = "temel-cards";

  handleSlotChange() {
    super.handleSlotChange();
    const article = this.shadowRoot.querySelector("article");
    if (article) article.ariaLabelledByElements = this.assignedTo("heading");
  }

  /** Set by the owning Cards block: a tile in a grid, or a row with media beside the text. */
  set arrangement(arrangement) {
    this.toggleCustomState("row", arrangement === "row");
  }
}

customElements.define(
  "temel-content-card",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelContentCard)),
);
