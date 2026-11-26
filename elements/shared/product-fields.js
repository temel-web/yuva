import { languagePath } from "/@/runtime/language-paths.js";

import { createTemplate } from "./store-element.js";
import { money, readCurrency } from "./store-preferences.js";
import { priceClient } from "./price-client.js";

const reducedPriceTemplate = createTemplate("<del></del> <ins></ins>");

const PRODUCT_PATH_PATTERN =
  /^\/products\/[a-z0-9-]+\/[a-z0-9]+(?:-[a-z0-9]+)*\.html$/u;

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
  const value =
    host.querySelector(":scope > data[slot='path']")?.getAttribute("value") ??
    "";
  return PRODUCT_PATH_PATTERN.test(value) ? value : "";
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
export function productAmount(host, currency = readCurrency(host)) {
  return priceClient.amount(productPath(host), currency);
}

/** @param {HTMLElement} host @param {{path?: string, currency?: string}} [options] */
export function showPrice(host, options = {}) {
  const output = host.shadowRoot.querySelector("[data-price]");
  const path = options.path ?? productPath(host);
  const currency = options.currency ?? readCurrency(host);
  const amount = priceClient.amount(path, currency);
  const isLoading = ["idle", "loading"].includes(priceClient.status);
  if (priceClient.status === "ready" && amount !== null) {
    const regularAmount = priceClient.regularAmount(path, currency);
    if (regularAmount === null) {
      output.textContent = money(amount, currency, host);
      return;
    }
    const fragment = /** @type {DocumentFragment} */ (
      reducedPriceTemplate.content.cloneNode(true)
    );
    fragment.querySelector("del").textContent = money(
      regularAmount,
      currency,
      host,
    );
    fragment.querySelector("ins").textContent = money(amount, currency, host);
    output.replaceChildren(fragment);
    return;
  }
  output.replaceChildren(...(isLoading ? [] : [host.temelSlot("price-error")]));
}
