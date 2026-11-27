import { css, html } from "/@/runtime/temel-element.js";
import { StoreElement } from "./shared/store-element.js";
import "./yuva-product-card.js";

const contentStyles = css`
  yuva-product-grid > :is([slot="summary"], [slot^="summary@"]) :where(p, ul, ol) { margin-block: 0 var(--space-7); }
  yuva-product-grid > :is([slot="summary"], [slot^="summary@"]) > :last-child { margin-block-end: 0; }
  yuva-product-grid temel-query-paginator { display: block; grid-column: 1 / -1; margin-block-start: var(--space-9); font: var(--type-ui-strong); }
  yuva-product-grid temel-query-paginator::part(list) { justify-content: center; gap: var(--space-3); }
  yuva-product-grid temel-query-paginator:is(::part(page), ::part(previous), ::part(next)) {
    display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box;
    min-inline-size: var(--h-control); min-block-size: var(--h-control); padding-inline: var(--space-6);
    border: var(--border-width) solid var(--border-default); color: var(--text-primary); text-decoration: none;
  }
  yuva-product-grid temel-query-paginator::part(current) {
    background: var(--text-primary); border-color: var(--text-primary); color: var(--background-color);
  }
`;

const styles = css`
  :host { padding: var(--space-12) max(clamp(var(--space-7), 4%, var(--space-11)), calc((100% - 80rem) / 2)) var(--space-13); }
  :host(:state(introduced)) { padding-block: var(--space-13) var(--space-13); }
  .introduction { display: grid; gap: var(--space-7); align-items: end; margin-block-end: var(--space-10); }
  .introduction:not(.is-filled) { position: absolute; inline-size: var(--space-1); block-size: var(--space-1); margin: 0; overflow: clip; }
  .introduction > slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
  ::slotted([slot="heading"]) { margin: 0; font: var(--weight-regular) clamp(var(--text-4xl), 5.6cqi, 5rem)/0.98 var(--font-display); letter-spacing: -0.01em; text-wrap: balance; max-inline-size: 18ch; }
  ::slotted([slot="summary"]) { color: var(--text-secondary); margin: 0; max-inline-size: 40ch; font-size: var(--text-xl); }
  .grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-10) var(--space-8); align-items: stretch; }
  .grid > slot { display: contents; }
  @container (min-width: 20rem) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @container (min-width: 36rem) {
    .introduction:has(> slot[name="heading"].is-filled):has(> slot[name="summary"].is-filled) {
      grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); column-gap: var(--space-9);
    }
    .introduction > slot[name="summary"] { justify-self: end; }
  }
  @container (min-width: 48rem) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @container (min-width: 62rem) {
    :host([layout="spread"]) .grid { grid-template-columns: minmax(0, 5fr) repeat(3, minmax(0, 2.4fr)); }
    :host([layout="spread"]) .grid > slot::slotted(yuva-product-card:first-of-type) { grid-row: span 2; }
    :host([layout="spread"]) .grid > slot::slotted(yuva-product-card:nth-of-type(5)) { grid-column: span 2; }
  }
  @container (min-width: 76rem) {
    :host(:not([layout="spread"], [columns="3"])) .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
`;

/**
 * A responsive collection of product cards. Rows fit their content, so a query's show-more or
 * paginator control takes only its own height below the cards.
 */
export class YuvaProductGrid extends StoreElement {
  static preferenceTopics = Object.freeze([]);
  static styles = [...super.styles, styles];
  static template = html`
    <div class="collection">
      <header class="introduction">
        <slot name="heading"></slot>
        <slot name="summary"></slot>
      </header>
      <div class="grid">
        <slot></slot>
      </div>
    </div>
    <slot name="provenance"></slot>
  `;

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
    this.slotFor("heading").classList.toggle("is-filled", hasHeading);
    this.slotFor("summary").classList.toggle("is-filled", hasSummary);
  }
}
customElements.define("yuva-product-grid", YuvaProductGrid);
