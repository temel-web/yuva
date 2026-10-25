import { node } from "./shared/store-element.js";
import { PricedStoreElement } from "./shared/priced-store-element.js";
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
    this.#total = node("output");
    this.#status = node("div", { role: "status", class: "status" });
    this.shadowRoot.append(this.#createLine(), this.temelSlot("provenance"));
    this.shadowRoot.addEventListener("click", this.handleQuantityClick.bind(this));
    this.#input.addEventListener("change", this.handleQuantityChange.bind(this));
    this.addStyles(`
      :host { padding-block: var(--space-8); border-block-end: var(--border-width) solid var(--border-subtle); }
      :host(:not(:state(in-cart))) { display: none; }
      .line { display: grid; grid-template-columns: 6rem minmax(0, 1fr); gap: var(--space-7); }
      .image { align-self: start; background: white; }
      ::slotted(:is(img, temel-picture)) { aspect-ratio: 1; object-fit: contain; }
      .copy { display: grid; gap: var(--space-4); }
      ::slotted([slot="title"]) { font: var(--type-heading); margin: 0; }
      ::slotted([slot="brand"]) { color: var(--text-muted); font: var(--type-caption); }
      .title-link { color: var(--text-primary); font: var(--type-title); text-decoration: none; }
      .title-link:hover { color: var(--text-link); }
      .title-link span, .title-link slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
      .title-link.has-display-name .catalogue-title, .title-link:not(.has-display-name) .display-name { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }
      ::slotted([slot="display-name"]) { font: inherit; margin: 0; }
      .controls button, .controls input { border-radius: 0; }
      .controls button[value="remove"] { background: transparent; border-color: transparent; text-decoration: underline; text-underline-offset: var(--space-2); }
      .controls { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); }
      input { inline-size: 4rem; background: var(--surface-input); color: var(--text-primary); text-align: center; font-variant-numeric: tabular-nums; appearance: textfield; }
      input::-webkit-inner-spin-button, input::-webkit-outer-spin-button { appearance: none; margin: 0; }
      output { grid-column: 2; font: var(--type-title); }
      @container (min-width: 42rem) { .line { grid-template-columns: 10rem minmax(0, 1fr) auto; } output { grid-column: 3; } }
    `);
  }

  #createLine() {
    this.#titleLink = node("a", { class: "title-link" }, [
      node("span", { id: "display-name", class: "display-name" }, [this.temelSlot("display-name")]),
      node("span", { id: "catalogue-title", class: "catalogue-title" }, [this.temelSlot("title")]),
    ]);
    return node("div", { class: "line" }, [
      node("div", { class: "image" }, [this.temelSlot("image")]),
      node("div", { class: "copy" }, [
        this.#titleLink,
        this.temelSlot("brand"),
        node("output", { "data-price": "" }),
        this.#quantityControls(),
        this.#status,
      ]),
      this.#total,
    ]);
  }

  #quantityControls() {
    return node("div", { class: "controls" }, [
      node("span", { id: "quantity-label", class: "sr-only" }, [this.temelSlot("quantity")]),
      this.#decrease,
      this.#input,
      this.#increase,
      this.#remove,
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
    if (this.productPath) this.#titleLink.setAttribute("href", productPageHref(this));
    else this.#titleLink.removeAttribute("href");
    this.setState("in-cart", this.quantity > 0);
    this.#input.value = String(this.quantity);
    this.#input.disabled = this.#isPending;
    this.#decrease.disabled = this.#isPending || this.quantity <= 1;
    this.#increase.disabled = this.#isPending;
    this.#remove.disabled = this.#isPending;
    showPrice(this);
    const total = this.amount === null ? NaN : this.amount * this.quantity;
    this.#total.textContent = Number.isSafeInteger(total) ? money(total, readCurrency()) : "";
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
