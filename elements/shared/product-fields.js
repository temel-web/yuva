import { money, readCurrency } from "./store-preferences.js";
import { priceClient } from "./price-client.js";

export const PRODUCT_FIELDS = Object.freeze([
  "path",
  "image",
  "title",
  "category",
  "brand",
  "price-error",
]);

/** Product identity is separate from its visible heading. @param {HTMLElement} host */
export function productPath(host) {
  return host.querySelector(":scope > data[slot='path']")?.getAttribute("value") ?? "";
}

/** @param {HTMLElement} host @param {string} [currency] */
export function productAmount(host, currency = readCurrency()) {
  return priceClient.amount(productPath(host), currency);
}

/** @param {HTMLElement} host */
export function showPrice(host) {
  const output = host.shadowRoot.querySelector("[data-price]");
  const amount = productAmount(host);
  const isLoading = ["idle", "loading"].includes(priceClient.status);
  output.hidden = isLoading;
  if (priceClient.status === "ready" && amount !== null) {
    output.textContent = money(amount, readCurrency());
    return;
  }
  output.replaceChildren(...(isLoading ? [] : [host.temelSlot("price-error")]));
}
