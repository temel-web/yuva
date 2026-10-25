import { StoreElement, node } from "./shared/store-element.js";
import {
  CURRENCIES,
  readCurrency,
  setCurrency,
} from "./shared/store-preferences.js";

/** Three authored currency choices, with one visitor preference. */
export class YuvaCurrencySwitcher extends StoreElement {
  static temelSlots = ["label", "eur", "usd", "chf", "provenance"];
  #buttons = [];
  constructor() {
    super();
    const label = node("span", { id: "currency-label", class: "sr-only" }, [
      this.temelSlot("label"),
    ]);
    const group = node("div", {
      role: "group",
      "aria-labelledby": "currency-label",
    });
    for (const currency of CURRENCIES) {
      const button = node("button", { type: "button", value: currency }, [
        this.temelSlot(currency),
      ]);
      button.addEventListener("click", this.handleCurrencyClick.bind(this));
      this.#buttons.push(button);
      group.append(button);
    }
    this.shadowRoot.append(label, group, this.temelSlot("provenance"));
    this.addStyles(`
      :host { container-type: normal; display: inline-block; }
      [role="group"] { display: flex; gap: var(--space-1); }
      button { min-block-size: var(--space-11); border-color: transparent; }
      button[aria-pressed="true"] { background: var(--surface-selected); font-weight: var(--weight-bold); }
    `);
  }
  update() {
    const currency = readCurrency();
    for (const button of this.#buttons)
      button.setAttribute("aria-pressed", String(button.value === currency));
  }
  handleCurrencyClick(event) {
    setCurrency(event.currentTarget.value);
  }
}
customElements.define("yuva-currency-switcher", YuvaCurrencySwitcher);
