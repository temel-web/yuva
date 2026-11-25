import { languagePath } from "/@/runtime/language-paths.js";

import { StoreElement, node } from "./shared/store-element.js";
import { readCart } from "./shared/store-preferences.js";
import { svgNode } from "/@temel/elements/page-essentials/page-essential-element.js";

const compactQuantity = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumSignificantDigits: 2,
  useGrouping: false,
});

/** The cart destination and its live quantity count. */
export class YuvaCartLink extends StoreElement {
  static preferenceTopics = Object.freeze(["cart"]);
  static temelSlots = ["", "provenance"];
  static observedAttributes = ["href"];
  #link;
  #count;
  #accessibleCount;
  constructor() {
    super();
    this.#count = node("span", { class: "count", "aria-hidden": "true" });
    this.#accessibleCount = node("span", { class: "sr-only" });
    this.#link = node("a", {}, [
      svgNode("svg", { "aria-hidden": "true", focusable: "false", viewBox: "0 0 24 24" }, [
        svgNode("path", { d: "M5 7h14l1 14H4L5 7ZM8 8V6a4 4 0 0 1 8 0v2" }),
      ]),
      node("span", { class: "label" }, [this.temelSlot("")]),
      this.#count,
      this.#accessibleCount,
    ]);
    this.shadowRoot.append(this.#link, this.temelSlot("provenance"));
    this.addStyles(`
      :host { container-type: normal; display: inline-block; }
      a { display: inline-flex; align-items: center; gap: var(--space-4); padding: var(--space-4); min-block-size: var(--space-11); min-inline-size: var(--space-11); max-inline-size: 100%; color: var(--text-primary); text-decoration: none; font: var(--type-ui-strong); }
      a:hover { color: var(--text-link); }
      a:hover .label { text-decoration: underline; text-underline-offset: var(--space-2); }
      svg { flex: none; inline-size: var(--space-7); block-size: var(--space-7); fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
      .label { max-inline-size: 12ch; overflow-wrap: anywhere; }
      .count { font: var(--type-ui); font-variant-numeric: tabular-nums; color: var(--text-secondary); }
      @container (max-width: 40rem) {
        a { gap: var(--space-3); padding-inline: var(--space-2); }
        .label { position: absolute; inline-size: var(--space-1); block-size: var(--space-1); overflow: hidden; clip-path: inset(50%); }
        .count { font: var(--type-caption); font-variant-numeric: tabular-nums; }
      }
    `);
  }
  attributeChangedCallback() {
    this.update();
  }
  update() {
    if (!this.#link) return;
    this.#link.href = languagePath(this.getAttribute("href") ?? "/cart/", this.ownerDocument);
    let items = [];
    try {
      items = readCart();
    } catch {}
    const count = items.reduce((total, item) => total + item.quantity, 0);
    this.#count.textContent = count < 1000 ? String(count) : compactQuantity.format(count);
    this.#accessibleCount.textContent = String(count);
    this.setState("empty", count === 0);
  }
}
customElements.define("yuva-cart-link", YuvaCartLink);
