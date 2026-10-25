import { languagePath } from "/@/runtime/language-paths.js";

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

/**
 * The product's page in the language of the page showing it; the cart and prices keep the
 * product's identity, its source-language path.
 * @param {HTMLElement} host
 */
export function productPageHref(host) {
  const path = productPath(host);
  return path === "" ? "" : languagePath(path, host.ownerDocument);
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
