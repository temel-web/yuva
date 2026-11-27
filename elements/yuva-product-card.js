import { css, html } from "/@/runtime/temel-element.js";
import { PricedStoreElement } from "./shared/priced-store-element.js";
import {
  PRODUCT_FIELDS,
  productPageHref,
  productPath,
  showPrice,
} from "./shared/product-fields.js";
import { isRoomPhotograph } from "./shared/photograph-kind.js";
import "./yuva-add-to-cart.js";

const styles = css`
  :host { display: flex; flex-direction: column; background: transparent; }
  .stage { position: relative; display: flex; flex: 1 1 auto; min-block-size: 0; }
  .image-link { display: block; position: relative; flex: 1 1 auto; min-inline-size: 0; isolation: isolate; background: light-dark(#e3e0da, #d8d3cb); aspect-ratio: 4 / 5; overflow: clip; }
  .image-link > slot { display: block; inline-size: 100%; block-size: 100%; }
  ::slotted(:is(img, temel-picture)) { position: absolute; inset: 0; box-sizing: border-box; inline-size: 100%; block-size: 100%; object-fit: contain; padding: var(--space-8); mix-blend-mode: multiply; transition: transform var(--dur-slowest) var(--ease-out); }
  :host(:state(room)) ::slotted(:is(img, temel-picture)) { object-fit: cover; padding: 0; mix-blend-mode: normal; }
  .action { position: absolute; inset-block-end: var(--space-6); inset-inline-end: var(--space-6); }
  .action > slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
  .heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--space-2) var(--space-6); align-items: baseline; padding-block-start: var(--space-7); }
  .meta { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: var(--space-3) var(--space-5); font: var(--type-ui); font-size: var(--text-sm); color: var(--text-secondary); }
  .meta > slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
  .title-link { color: var(--text-primary); text-decoration: none; font: var(--weight-semibold) var(--text-lg)/var(--leading-snug) var(--font-ui); text-wrap: pretty; }
  .title-link:hover { text-decoration: underline; text-underline-offset: 0.2em; }
  .title-link span, .title-link slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
  .title-link.has-display-name .catalogue-title, .title-link:not(.has-display-name) .display-name { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }
  .title-link.has-display-name .catalogue-title slot { inline-size: var(--space-1); block-size: var(--space-1); }
  ::slotted([slot="title"]), ::slotted([slot="display-name"]) { margin: 0; font: inherit; }
  .price { align-self: start; font: var(--weight-medium) var(--text-md)/var(--leading-snug) var(--font-ui); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .price:has(slot) { grid-column: 1 / -1; white-space: normal; }
  @container (max-width: 14rem) { .heading { grid-template-columns: minmax(0, 1fr); } }
  @container (min-width: 28rem) {
    .image-link { aspect-ratio: auto; flex: 1 1 0; min-block-size: 20rem; }
    .title-link { font: var(--weight-regular) var(--text-3xl)/1.1 var(--font-display); }
    .price { font-size: var(--text-xl); }
    .meta { font-size: var(--text-ui); }
  }
  @media (prefers-reduced-motion: no-preference) {
    :host(:hover) .image-link > slot::slotted(:is(img, temel-picture)),
    :host(:focus-within) .image-link > slot::slotted(:is(img, temel-picture)) { transform: scale(1.04); }
  }
`;

export function getReferences() {
  return {
    source: {
      fields: [
        "path",
        "image",
        "title",
        "display-name",
        "category",
        "brand",
        "price-error",
      ],
      imageAttributes: { loading: "lazy" },
      targets: ["yuva-product"],
    },
  };
}

/** A compact projection of one product's source fields. */
export class YuvaProductCard extends PricedStoreElement {
  static preferenceTopics = Object.freeze(["currency"]);
  static temelSlots = [
    ...PRODUCT_FIELDS,
    "display-name",
    "action",
    "provenance",
  ];
  static styles = [...super.styles, styles];
  static template = html`
    <div class="stage">
      <a class="image-link" tabindex="-1" aria-hidden="true">
        <slot name="image"></slot>
      </a>
      <div class="action">
        <slot name="action"></slot>
      </div>
    </div>
    <div class="heading">
      <a class="title-link" aria-labelledby="display-name catalogue-title">
        <span id="display-name" class="display-name"><slot name="display-name"></slot></span>
        <span id="catalogue-title" class="catalogue-title"><slot name="title"></slot></span>
      </a>
      <output class="price" data-price></output>
      <div class="meta">
        <slot name="brand"></slot>
        <slot name="category"></slot>
      </div>
    </div>
    <slot name="provenance"></slot>
  `;
  #link;
  #titleLink;

  constructor() {
    super();
    this.#link = this.shadowRoot.querySelector(".image-link");
    this.#titleLink = this.shadowRoot.querySelector(".title-link");
  }

  update() {
    const hasDisplayName = Boolean(this.text("display-name"));
    this.#titleLink.classList.toggle("has-display-name", hasDisplayName);
    this.#titleLink.setAttribute(
      "aria-labelledby",
      hasDisplayName ? "display-name" : "catalogue-title",
    );
    const path = productPath(this);
    const href = productPageHref(this);
    this.#link.href = href || "#";
    if (href) this.#titleLink.setAttribute("href", href);
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
    this.#showPhotographKind();
  }

  /** A room photograph fills the stage; a cutout on white sits inside it. */
  #showPhotographKind() {
    const photograph = this.#photograph;
    if (!photograph) return;
    if (photograph.complete && photograph.naturalWidth > 0) {
      this.setState("room", isRoomPhotograph(photograph));
      return;
    }
    photograph.addEventListener("load", this.handlePhotographLoad.bind(this), {
      once: true,
    });
  }

  handlePhotographLoad() {
    this.#showPhotographKind();
  }

  /** @returns {HTMLImageElement | null} */
  get #photograph() {
    const image = this.field("image");
    if (!image) return null;
    return /** @type {HTMLImageElement | null} */ (
      image.localName === "img" ? image : image.querySelector("img")
    );
  }
}
customElements.define("yuva-product-card", YuvaProductCard);
