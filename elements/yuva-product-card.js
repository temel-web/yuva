import { node } from "./shared/store-element.js";
import { PricedStoreElement } from "./shared/priced-store-element.js";
import { PRODUCT_FIELDS, productPath, showPrice } from "./shared/product-fields.js";
import "./yuva-add-to-cart.js";

export function getReferences() {
  return {
    source: {
      fields: ["path", "image", "title", "display-name", "category", "brand", "price-error"],
      imageAttributes: { loading: "lazy" },
      targets: ["yuva-product"],
    },
  };
}

/** A compact projection of one product's source fields. */
export class YuvaProductCard extends PricedStoreElement {
  static temelSlots = [...PRODUCT_FIELDS, "display-name", "action", "provenance"];
  #link;
  #titleLink;

  constructor() {
    super();
    this.#link = node("a", { class: "image-link", tabindex: "-1", "aria-hidden": "true" }, [
      this.temelSlot("image"),
    ]);
    this.#titleLink = node(
      "a",
      {
        class: "title-link",
        "aria-labelledby": "display-name catalogue-title",
      },
      [
        node("span", { id: "display-name", class: "display-name" }, [
          this.temelSlot("display-name"),
        ]),
        node("span", { id: "catalogue-title", class: "catalogue-title" }, [
          this.temelSlot("title"),
        ]),
      ],
    );
    const heading = node("div", { class: "heading" }, [
      this.#titleLink,
      node("output", { class: "price", "data-price": "" }),
      node("div", { class: "meta" }, [this.temelSlot("brand"), this.temelSlot("category")]),
    ]);
    const copy = node("div", { class: "copy" }, [this.temelSlot("action")]);
    this.shadowRoot.append(this.#link, heading, copy, this.temelSlot("provenance"));
    this.addStyles(`
      :host { display: flex; flex-direction: column; background: transparent; }
      .image-link { display: block; position: relative; flex: none; background: white; aspect-ratio: 4 / 5; overflow: clip; }
      .image-link > slot { display: block; inline-size: 100%; block-size: 100%; }
      ::slotted(:is(img, temel-picture)) { position: absolute; inset: 0; box-sizing: border-box; inline-size: 100%; block-size: 100%; object-fit: contain; padding: var(--space-8); transition: transform var(--dur-slow) var(--ease-out); }
      .heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--space-4); align-items: baseline; padding-block-start: var(--space-7); }
      .meta { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: var(--space-3) var(--space-5); font: var(--type-caption); color: var(--text-secondary); }
      .meta > slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
      .title-link { color: var(--text-primary); text-decoration: none; font: var(--weight-semibold) var(--text-xl)/var(--leading-snug) var(--font-ui); text-wrap: pretty; }
      .title-link:hover { color: var(--text-link); }
      .title-link span, .title-link slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
      .title-link.has-display-name .catalogue-title, .title-link:not(.has-display-name) .display-name { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }
      .title-link.has-display-name .catalogue-title slot { inline-size: var(--space-1); block-size: var(--space-1); }
      ::slotted([slot="title"]), ::slotted([slot="display-name"]) { margin: 0; font: inherit; }
      .price { font: var(--type-ui); font-variant-numeric: tabular-nums; white-space: nowrap; }
      .price:has(slot) { grid-column: 1 / -1; white-space: normal; }
      .copy { display: grid; margin-block-start: auto; padding-block-start: var(--space-6); }
      .copy > slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
      @container (max-width: 18rem) { .heading { grid-template-columns: minmax(0, 1fr); } }
      @media (prefers-reduced-motion: no-preference) {
        :host(:hover) .image-link > slot::slotted(:is(img, temel-picture)),
        :host(:focus-within) .image-link > slot::slotted(:is(img, temel-picture)) { transform: scale(1.04); }
      }
    `);
  }

  update() {
    const hasDisplayName = Boolean(this.text("display-name"));
    this.#titleLink.classList.toggle("has-display-name", hasDisplayName);
    this.#titleLink.setAttribute(
      "aria-labelledby",
      hasDisplayName ? "display-name" : "catalogue-title",
    );
    const path = productPath(this);
    this.#link.href = path || "#";
    if (path) this.#titleLink.setAttribute("href", path);
    else this.#titleLink.removeAttribute("href");
    const action = this.querySelector(":scope > yuva-add-to-cart");
    if (action) {
      action.productPath = path;
      action.productSummary = {
        title: this.text("display-name") || this.text("title"),
        image: this.field("image"),
      };
      action.update();
    }
    showPrice(this);
  }
}
customElements.define("yuva-product-card", YuvaProductCard);
