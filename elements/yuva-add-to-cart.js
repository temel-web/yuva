import { languagePath } from "/@/runtime/language-paths.js";

import { StoreElement, node } from "./shared/store-element.js";
import { addProduct, readCart } from "./shared/store-preferences.js";
import {
  buttonSizeVariables,
  buttonVariantVariables,
} from "./page-essentials/button-foundation.js";

/** An accessible command that adds one product to the visitor's cart. */
export class YuvaAddToCart extends StoreElement {
  static temelSlots = [
    "",
    "pending",
    "added",
    "quantity",
    "view-cart",
    "dismiss",
    "error",
    "provenance",
  ];
  static observedAttributes = ["size", "variant", "disabled"];
  #button;
  #message;
  #confirmation;
  #preview;
  #quantity;
  #cartCount;
  #isPending = false;
  /** @type {"ready" | "pending" | "added" | "error"} */
  #currentStatus = "ready";
  productPath = "";
  /** @type {{title: string, image: Element | null}} */
  productSummary = { title: "", image: null };

  constructor() {
    super();
    this.#button = node(
      "button",
      {
        type: "button",
        "aria-controls": "cart-confirmation",
        "aria-expanded": "false",
      },
      [
        node("span", { class: "label" }, [this.temelSlot("")]),
        node("span", { class: "pending-label" }, [this.temelSlot("pending")]),
      ],
    );
    this.#message = node("div", {
      role: "status",
      class: "status sr-only",
      "aria-atomic": "true",
    });
    this.#preview = node("div", { class: "product-summary", hidden: "" });
    this.#quantity = node("output");
    this.#cartCount = node("span", { class: "cart-count" });
    const dismiss = node("button", { type: "button", class: "dismiss" }, [
      this.temelSlot("dismiss"),
    ]);
    this.#confirmation = node(
      "aside",
      {
        id: "cart-confirmation",
        class: "confirmation",
        popover: "auto",
        hidden: "",
        "aria-labelledby": "confirmation-heading",
      },
      [
        node("h2", { id: "confirmation-heading" }, [this.temelSlot("added")]),
        this.#preview,
        node("div", { class: "quantity" }, [this.temelSlot("quantity"), this.#quantity]),
        node("a", { href: languagePath("/cart/", this.ownerDocument), class: "view-cart" }, [
          this.temelSlot("view-cart"),
          this.#cartCount,
        ]),
        dismiss,
      ],
    );
    this.shadowRoot.append(
      this.#button,
      this.#message,
      this.#confirmation,
      this.temelSlot("provenance"),
    );
    this.#button.addEventListener("click", this.handleAddClick.bind(this));
    dismiss.addEventListener("click", this.handleDismissClick.bind(this));
    this.#confirmation.addEventListener("toggle", this.handleConfirmationToggle.bind(this));
    this.shadowRoot.addEventListener("keydown", this.handleConfirmationKeydown.bind(this));
    this.addStyles(`
      :host { container-type: normal; }
      button { inline-size: 100%; ${buttonSizeVariables("l")} ${buttonVariantVariables("accent")} }
      :host(:not([disabled])) > button { opacity: 1; }
      button:disabled { pointer-events: none; }
      :host([size="s"]) button { ${buttonSizeVariables("s")} }
      :host([size="m"]) button { ${buttonSizeVariables("m")} }
      :host([size="xl"]) button { ${buttonSizeVariables("xl")} }
      :host([size="xxl"]) button { ${buttonSizeVariables("xxl")} }
      :host([variant="outline"]) button { ${buttonVariantVariables("outline")} }
      :host([variant="quiet"]) button { ${buttonVariantVariables("quiet")} }
      button { display: flex; justify-content: space-between; align-items: center; gap: var(--space-6); border-radius: 0; }
      button::after { content: ""; inline-size: var(--space-4); block-size: var(--space-4); flex: none; background: linear-gradient(currentColor, currentColor) center / 100% var(--border-width-thick) no-repeat, linear-gradient(currentColor, currentColor) center / var(--border-width-thick) 100% no-repeat; transition: rotate var(--dur-base) var(--ease-out); }
      :host(:state(added)) button::after { background: none; border-inline-end: var(--border-width-thick) solid currentColor; border-block-end: var(--border-width-thick) solid currentColor; inline-size: var(--space-3); rotate: 45deg; }
      .pending-label { display: none; }
      :host(:state(pending)) .label { display: none; }
      :host(:state(pending)) .pending-label { display: block; }
      :host(:state(pending)) > button::after { background: none; border: var(--border-width-thick) solid currentColor; border-inline-end-color: transparent; border-radius: var(--radius-pill); rotate: 0deg; animation: saving 700ms linear infinite; }
      :host(:state(pending)) > button { opacity: 1; cursor: progress; }
      :host(:state(pending)) { cursor: progress; }
      .confirmation { position: fixed; inset: auto var(--space-7) var(--space-7) auto; margin: 0; inline-size: min(28rem, calc(100% - 2 * var(--space-7))); max-block-size: calc(100% - 2 * var(--space-7)); overflow: auto; padding: var(--space-8); border: var(--border-width) solid var(--border-default); border-radius: 0; background: var(--surface-overlay); color: var(--text-primary); box-shadow: var(--shadow-dialog); container-type: inline-size; }
      .confirmation:not([popover]) { position: static; inline-size: min(28rem, 100%); max-block-size: none; margin-block-start: var(--space-6); border: var(--border-width) solid var(--border-subtle); box-shadow: none; opacity: 1; translate: none; transition: none; }
      .confirmation h2 { display: flex; align-items: center; gap: var(--space-4); margin: 0 0 var(--space-7); font: var(--weight-semibold) var(--text-xl)/var(--leading-snug) var(--font-ui); }
      .confirmation h2::before { content: ""; flex: none; inline-size: var(--space-3); block-size: var(--space-5); border-inline-end: var(--border-width-thick) solid var(--accent-text); border-block-end: var(--border-width-thick) solid var(--accent-text); rotate: 45deg; margin-inline: var(--space-2); }
      .product-summary { display: grid; grid-template-columns: clamp(5rem, 25cqi, 7rem) minmax(0, 1fr); gap: var(--space-6); align-items: center; }
      .product-summary > :is(img, temel-picture) { inline-size: 100%; aspect-ratio: 4 / 5; block-size: auto; min-block-size: 0; align-self: start; overflow: clip; object-fit: contain; background: white; padding: var(--space-3); }
      .product-summary temel-picture > picture { display: contents; object-fit: inherit; }
      .product-summary temel-picture > picture > img { display: block; inline-size: 100%; block-size: 100%; object-fit: inherit; }
      .product-summary .title { margin: 0; font: var(--weight-semibold) var(--text-lg)/var(--leading-snug) var(--font-ui); overflow-wrap: anywhere; }
      .quantity { display: flex; justify-content: space-between; gap: var(--space-4); margin-block: var(--space-6) var(--space-7); padding-block-start: var(--space-6); border-block-start: var(--border-width) solid var(--border-subtle); font: var(--type-ui); }
      .quantity output, .cart-count { font-variant-numeric: tabular-nums; }
      .quantity output:empty, .cart-count:empty { display: none; }
      .view-cart { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); min-block-size: var(--space-11); padding: var(--space-4) var(--space-6); background: var(--accent); color: var(--text-on-accent); text-decoration: none; font: var(--type-ui-strong); }
      .view-cart:hover { background: var(--accent-hover); }
      .cart-count { min-inline-size: var(--space-7); text-align: end; }
      .confirmation .dismiss { justify-content: center; ${buttonVariantVariables("quiet")} border: none; text-decoration: underline; text-underline-offset: var(--space-2); margin-block-start: var(--space-3); }
      .dismiss::after { display: none; }
      slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
      .status.has-error { margin-block-start: var(--space-3); color: var(--status-error); }
      @keyframes saving { to { rotate: 360deg; } }
      @media (prefers-reduced-motion: no-preference) {
        .confirmation { opacity: 0; translate: 0 var(--space-7); transition: opacity var(--dur-slowest) var(--ease-out), translate var(--dur-slowest) var(--ease-out), display var(--dur-slowest) allow-discrete, overlay var(--dur-slowest) allow-discrete; }
        .confirmation:popover-open { opacity: 1; translate: 0 0; }
        @starting-style { .confirmation:popover-open { opacity: 0; translate: 0 var(--space-7); } }
      }
      @media (prefers-reduced-motion: reduce) { button::after { transition: none; animation: none; } }
    `);
  }

  attributeChangedCallback() {
    this.update();
  }

  /** The drawn command state; changing it never adds a product or opens a popover. */
  get status() {
    return this.#currentStatus;
  }

  /** @param {"ready" | "pending" | "added" | "error"} status */
  set status(status) {
    this.#currentStatus = status;
    this.setState("pending", status === "pending");
    this.setState("added", status === "added");
    this.#message.replaceChildren(...(status === "error" ? [this.temelSlot("error")] : []));
    this.#message.classList.toggle("has-error", status === "error");
    this.#message.classList.toggle("sr-only", status !== "error");
    this.#confirmation.removeAttribute("popover");
    this.#confirmation.hidden = status !== "added";
    this.update();
  }

  update() {
    if (!this.#button) return;
    this.#button.disabled =
      this.#isPending ||
      this.status === "pending" ||
      this.hasAttribute("disabled") ||
      !this.productPath;
    this.#button.setAttribute("aria-busy", String(this.status === "pending"));
    this.#button.setAttribute(
      "aria-expanded",
      String(
        this.#confirmation.matches(":popover-open") ||
          (!this.#confirmation.hasAttribute("popover") && !this.#confirmation.hidden),
      ),
    );
    if (this.#confirmation.matches(":popover-open")) this.#updateCounts();
  }

  async handleAddClick() {
    if (this.#button.disabled || this.#isPending) return;
    const wasFocused = this.shadowRoot.activeElement === this.#button;
    this.#isPending = true;
    this.status = "pending";
    try {
      await addProduct(this.productPath);
      this.status = "added";
      this.#message.textContent = this.text("added");
    } catch (cause) {
      this.status = "error";
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
      if (
        wasFocused &&
        this.isConnected &&
        [this, this.ownerDocument.body].includes(this.ownerDocument.activeElement)
      ) {
        this.#button.focus({ preventScroll: true });
      }
    }
    if (this.isConnected && this.status === "added") {
      this.#showConfirmation();
    }
  }

  handleDismissClick() {
    if (this.#confirmation.hasAttribute("popover")) this.#confirmation.hidePopover();
    else this.status = "ready";
    this.#button.focus({ preventScroll: true });
  }

  handleConfirmationToggle() {
    this.#button.setAttribute("aria-expanded", String(this.#confirmation.matches(":popover-open")));
  }

  disconnectedCallback() {
    if (this.#confirmation.matches(":popover-open")) this.#confirmation.hidePopover();
    super.disconnectedCallback();
  }

  handleConfirmationKeydown(event) {
    if (event.key !== "Escape" || !this.#confirmation.matches(":popover-open")) return;
    event.preventDefault();
    this.handleDismissClick();
  }

  #showConfirmation() {
    const title = node("p", { class: "title" });
    title.textContent = this.productSummary.title;
    const image = this.productSummary.image?.cloneNode(true);
    this.#preview.replaceChildren(...(image ? [image, title] : [title]));
    this.#preview.hidden = !image && !title.textContent;
    this.#updateCounts();
    this.#confirmation.setAttribute("popover", "auto");
    this.#confirmation.showPopover({ source: this.#button });
  }

  #updateCounts() {
    const items = readCart();
    this.#quantity.textContent = String(
      items.find((item) => item.path === this.productPath)?.quantity ?? 0,
    );
    this.#cartCount.textContent = String(items.reduce((total, item) => total + item.quantity, 0));
  }
}
customElements.define("yuva-add-to-cart", YuvaAddToCart);
