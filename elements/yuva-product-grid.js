import { StoreElement, node } from "./shared/store-element.js";
import "./yuva-product-card.js";

const contentStyles = new CSSStyleSheet();
contentStyles.replaceSync(`
  yuva-product-grid > :is([slot="summary"], [slot^="summary@"]) :where(p, ul, ol) { margin-block: 0 var(--space-7); }
  yuva-product-grid > :is([slot="summary"], [slot^="summary@"]) > :last-child { margin-block-end: 0; }
`);

/**
 * A responsive collection of product cards. Rows fit their content, so a query's show-more or
 * paginator control takes only its own height below the cards.
 */
export class YuvaProductGrid extends StoreElement {
  static temelSlots = ["", "heading", "summary", "provenance"];
  constructor() {
    super();
    this.shadowRoot.append(
      node("div", { class: "collection" }, [
        node("header", { class: "introduction" }, [
          this.temelSlot("heading"),
          this.temelSlot("summary"),
        ]),
        node("div", { class: "grid" }, [this.temelSlot("")]),
      ]),
      this.temelSlot("provenance"),
    );
    this.addStyles(`
      :host { padding: var(--space-12) max(clamp(var(--space-7), 4%, var(--space-9)), calc((100% - 80rem) / 2)) var(--space-13); }
      :host(:state(introduced)) { padding-block: var(--space-9) var(--space-12); }
      .introduction { display: grid; gap: var(--space-7); align-content: start; margin-block-end: var(--space-8); }
      .introduction:not(.is-filled) { position: absolute; inline-size: var(--space-1); block-size: var(--space-1); margin: 0; overflow: clip; }
      .introduction > slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
      ::slotted([slot="heading"]) { margin: 0; font: var(--weight-semibold) clamp(var(--text-3xl), 4cqi, var(--text-5xl))/1.05 var(--font-ui); letter-spacing: -0.03em; text-wrap: balance; max-inline-size: 22ch; }
      ::slotted([slot="summary"]) { color: var(--text-secondary); margin: 0; max-inline-size: 60ch; }
      .grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-10) var(--space-7); align-items: stretch; }
      .grid > slot { display: contents; }
      @container (min-width: 20rem) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      @container (min-width: 36rem) {
        .introduction:has(> slot[name="heading"].is-filled):has(> slot[name="summary"].is-filled) {
          grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); column-gap: var(--space-9);
        }
      }
      @container (min-width: 62rem) {
        :host(:state(introduced)) .collection { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 3fr); column-gap: var(--space-10); }
        .introduction.is-filled { align-self: start; position: sticky; inset-block-start: var(--space-9); margin-block-end: 0; }
        .introduction:has(> slot[name="heading"].is-filled):has(> slot[name="summary"].is-filled) { grid-template-columns: minmax(0, 1fr); }
        .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-12) var(--space-8); }
        :host(:state(introduced)) .grid { align-items: start; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); }
        :host(:state(introduced)) .grid > slot::slotted(yuva-product-card:nth-of-type(even)) { margin-block-start: var(--space-13); }
      }
      @container (min-width: 76rem) {
        :host(:not(:state(introduced), [columns="3"])) .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }
    `);
  }
  connectedCallback() {
    const root = /** @type {Document | ShadowRoot} */ (this.getRootNode());
    if (!root.adoptedStyleSheets.includes(contentStyles)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, contentStyles];
    }
    super.connectedCallback();
  }
  update() {
    const hasHeading = Boolean(this.text("heading"));
    const hasSummary = Boolean(this.text("summary"));
    this.setState("introduced", hasHeading || hasSummary);
    const introduction = this.shadowRoot.querySelector(".introduction");
    introduction.classList.toggle("is-filled", hasHeading || hasSummary);
    introduction.querySelector('slot[name="heading"]').classList.toggle("is-filled", hasHeading);
    introduction.querySelector('slot[name="summary"]').classList.toggle("is-filled", hasSummary);
  }
}
customElements.define("yuva-product-grid", YuvaProductGrid);
