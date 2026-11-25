import "/@/runtime/temel-provenance.js";
import { PageContextLinkController } from "/@/runtime/page-context.js";
import { StoreElement, node } from "./shared/store-element.js";

/** Native category links whose current-page state follows the surrounding page. */
export class YuvaCategoryNav extends StoreElement {
  static preferenceTopics = Object.freeze([]);
  static temelSlots = ["", "provenance"];

  #context;

  constructor() {
    super();
    const links = this.temelSlot("");
    links.className = "links";
    const navigation = node("nav");
    navigation.append(links);
    this.#context = new PageContextLinkController(this);
    this.shadowRoot.append(navigation, this.temelSlot("provenance"));
    this.addStyles(`
      :host { container-type: normal; font: var(--type-ui-strong); }
      nav { min-inline-size: 0; }
      .links { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-3) var(--space-9); min-block-size: var(--space-11); min-inline-size: var(--space-11); }
      .links::slotted(a) {
        display: flex; align-items: center; justify-content: space-between;
        min-block-size: var(--space-11); padding: var(--space-6) var(--space-4);
        color: var(--text-primary); text-decoration: none; overflow-wrap: anywhere;
        font: var(--weight-regular) clamp(var(--text-3xl), 7cqi, var(--text-4xl))/1.1 var(--font-display);
        border-block-end: var(--border-width) solid var(--border-subtle);
      }
      .links::slotted(a)::after { content: ""; inline-size: var(--space-4); block-size: var(--space-4); border-block-start: var(--border-width-thick) solid currentColor; border-inline-end: var(--border-width-thick) solid currentColor; rotate: 45deg; margin-inline: var(--space-4); flex: none; }
      .links::slotted(a:hover) { background: var(--surface-hover); }
      .links::slotted(a:focus-visible) { outline: var(--border-width-thick) solid var(--border-focus); outline-offset: var(--space-1); }
      .links::slotted(a[aria-current="page"]) { background: var(--surface-selected); }
      @container (min-width: 40rem) {
        .links { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-2); }
        .links::slotted(a) {
          justify-content: center; min-block-size: var(--space-11);
          padding: var(--space-4) var(--space-6); border-block-end: 0;
          font: var(--type-ui-strong); white-space: nowrap;
        }
        .links::slotted(a)::after { display: none; }
        .links::slotted(a[aria-current="page"]) { font-weight: var(--weight-bold); }
      }
    `);
  }

  connectedCallback() {
    super.connectedCallback();
    this.#context.connect();
  }

  /** Mark the current page again after the links change. */
  update() {
    if (this.isConnected) this.#context.update();
  }

  disconnectedCallback() {
    this.#context.disconnect();
    super.disconnectedCallback();
  }
}

customElements.define("yuva-category-nav", YuvaCategoryNav);
