import { node } from "./shared/store-element.js";
import { PricedStoreElement } from "./shared/priced-store-element.js";
import { priceClient } from "./shared/price-client.js";
import {
  PRODUCT_FIELDS,
  productAmount,
  productPageHref,
  productPath,
  showPrice,
} from "./shared/product-fields.js";
import {
  readCart,
  setQuantity,
  changeQuantity,
  money,
  readCurrency,
} from "./shared/store-preferences.js";

export function getReferences() {
  return {
    source: {
      fields: ["path", "image", "title", "display-name", "category", "brand", "price-error"],
      targets: ["yuva-product"],
    },
  };
}

/** One projected product with cart-owned quantity and removal controls. */
export class YuvaCartLine extends PricedStoreElement {
  static temelSlots = [
    ...PRODUCT_FIELDS,
    "display-name",
    "quantity",
    "increase",
    "decrease",
    "remove",
    "updated",
    "error",
    "provenance",
  ];
  #input;
  #decrease;
  #increase;
  #remove;
  #total;
  #status;
  #isPending = false;
  #titleLink;
  constructor() {
    super();
    this.#input = node("input", {
      type: "number",
      min: "1",
      step: "1",
      "aria-labelledby": "quantity-label",
    });
    this.#decrease = node("button", { type: "button", value: "decrease" }, [
      this.temelSlot("decrease"),
    ]);
    this.#increase = node("button", { type: "button", value: "increase" }, [
      this.temelSlot("increase"),
    ]);
    this.#remove = node("button", { type: "button", value: "remove" }, [this.temelSlot("remove")]);
    this.#total = node("output", { class: "total" });
    this.#status = node("div", { role: "status", class: "status" });
    this.shadowRoot.append(this.#createLine(), this.temelSlot("provenance"));
    this.shadowRoot.addEventListener("click", this.handleQuantityClick.bind(this));
    this.#input.addEventListener("change", this.handleQuantityChange.bind(this));
    this.addStyles(`
      :host { padding-block: var(--space-8); border-block-end: var(--border-width) solid var(--border-subtle); }
      :host(:not(:state(in-cart))) { display: none; }
      .line { display: grid; grid-template-columns: 5.5rem minmax(0, 1fr) auto; gap: var(--space-5) var(--space-7); align-items: start; }
      .image { grid-row: span 3; isolation: isolate; background: light-dark(#e3e0da, #d8d3cb); aspect-ratio: 1; overflow: clip; }
      ::slotted(:is(img, temel-picture)) { box-sizing: border-box; aspect-ratio: 1; object-fit: contain; padding: var(--space-4); mix-blend-mode: multiply; }
      .copy { grid-column: 2 / -1; display: grid; gap: var(--space-2); justify-items: start; }
      ::slotted([slot="title"]) { font: inherit; margin: 0; }
      ::slotted([slot="brand"]) { color: var(--text-secondary); font: var(--type-ui); }
      .title-link { color: var(--text-primary); font: var(--weight-semibold) var(--text-lg)/var(--leading-snug) var(--font-ui); text-decoration: none; }
      .title-link:hover { text-decoration: underline; text-underline-offset: 0.2em; }
      .title-link span, .title-link slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
      .title-link.has-display-name .catalogue-title, .title-link:not(.has-display-name) .display-name { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }
      ::slotted([slot="display-name"]) { font: inherit; margin: 0; }
      .copy button[value="remove"] { min-block-size: var(--space-9); padding: 0; background: transparent; border: 0; color: var(--text-secondary); font: var(--type-ui); text-decoration: underline; text-underline-offset: var(--space-2); }
      .copy button[value="remove"]:hover { color: var(--text-primary); }
      .unit { grid-column: 2; align-self: center; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
      .controls { grid-column: 2; display: flex; align-items: center; }
      .controls button, .controls input { border-radius: 0; }
      .controls button { inline-size: var(--h-control); padding: 0; }
      input { inline-size: 3.5rem; border-inline: 0; background: var(--surface-input); color: var(--text-primary); text-align: center; font-variant-numeric: tabular-nums; appearance: textfield; }
      input::-webkit-inner-spin-button, input::-webkit-outer-spin-button { appearance: none; margin: 0; }
      .total { grid-column: 3; grid-row: 2 / span 2; align-self: center; justify-self: end; font: var(--weight-semibold) var(--text-lg)/var(--leading-snug) var(--font-ui); font-variant-numeric: tabular-nums; }
      .status { grid-column: 2 / -1; }
      .status:empty { display: none; }
      @container (min-width: 46rem) {
        .line { grid-template-columns: 7rem minmax(0, 1fr) 7rem 10rem 7rem; column-gap: var(--space-8); align-items: center; }
        .image { grid-row: auto; }
        .copy { grid-column: 2; }
        .unit { grid-column: 3; justify-self: end; color: var(--text-primary); }
        .controls { grid-column: 4; justify-self: center; }
        .total { grid-column: 5; grid-row: auto; }
      }
    `);
  }

  #createLine() {
    this.#titleLink = node("a", { class: "title-link" }, [
      node("span", { id: "display-name", class: "display-name" }, [this.temelSlot("display-name")]),
      node("span", { id: "catalogue-title", class: "catalogue-title" }, [this.temelSlot("title")]),
    ]);
    return node("div", { class: "line" }, [
      node("div", { class: "image" }, [this.temelSlot("image")]),
      node("div", { class: "copy" }, [this.#titleLink, this.temelSlot("brand"), this.#remove]),
      node("output", { class: "unit", "data-price": "" }),
      this.#quantityControls(),
      this.#total,
      this.#status,
    ]);
  }

  #quantityControls() {
    return node("div", { class: "controls" }, [
      node("span", { id: "quantity-label", class: "sr-only" }, [this.temelSlot("quantity")]),
      this.#decrease,
      this.#input,
      this.#increase,
    ]);
  }

  get productPath() {
    return productPath(this);
  }
  get quantity() {
    return readCart().find((item) => item.path === this.productPath)?.quantity ?? 0;
  }
  get amount() {
    return productAmount(this);
  }

  update() {
    const hasDisplayName = Boolean(this.text("display-name"));
    this.#titleLink.classList.toggle("has-display-name", hasDisplayName);
    this.#titleLink.setAttribute(
      "aria-labelledby",
      hasDisplayName ? "display-name" : "catalogue-title",
    );
    const path = this.productPath;
    if (path) this.#titleLink.setAttribute("href", productPageHref(this));
    else this.#titleLink.removeAttribute("href");
    const quantity = readCart().find((item) => item.path === path)?.quantity ?? 0;
    this.setState("in-cart", quantity > 0);
    this.#input.value = String(quantity);
    this.#input.disabled = this.#isPending;
    this.#decrease.disabled = this.#isPending || quantity <= 1;
    this.#increase.disabled = this.#isPending;
    this.#remove.disabled = this.#isPending;
    if (!this.#isPending && quantity === 0) this.#status.replaceChildren();
    const currency = readCurrency(this);
    showPrice(this, { path, currency });
    const amount = priceClient.amount(path, currency);
    const total = amount === null ? NaN : amount * quantity;
    this.#total.textContent = Number.isSafeInteger(total) ? money(total, currency, this) : "";
  }

  async handleQuantityClick(event) {
    const button = event.composedPath().find((entry) => entry instanceof HTMLButtonElement);
    if (!button) return;
    const change =
      button.value === "remove" ? { quantity: 0 } : { delta: button.value === "increase" ? 1 : -1 };
    await this.#commitQuantity(change);
  }
  async handleQuantityChange() {
    if (!this.#input.checkValidity()) {
      this.#input.reportValidity();
      this.#status.replaceChildren(this.temelSlot("error"));
      return;
    }
    await this.#commitQuantity({ quantity: this.#input.valueAsNumber });
  }

  async #commitQuantity(change) {
    this.#isPending = true;
    this.update();
    try {
      if ("delta" in change) await changeQuantity(this.productPath, change.delta);
      else await setQuantity(this.productPath, change.quantity);
      this.#status.replaceChildren(this.temelSlot("updated"));
      if (change.quantity === 0)
        this.dispatchEvent(
          new CustomEvent("cart-item-removed", {
            bubbles: true,
            composed: true,
          }),
        );
    } catch (cause) {
      this.#status.replaceChildren(this.temelSlot("error"));
      this.dispatchEvent(
        new CustomEvent("cart-error", {
          bubbles: true,
          composed: true,
          detail: cause,
        }),
      );
    } finally {
      this.#isPending = false;
      this.update();
    }
  }
}
customElements.define("yuva-cart-line", YuvaCartLine);
