/** @typedef {{eur: number, usd: number, chf: number}} ProductPrices */

/** One document's price request, shared by its product views and cart. */
export class PriceClient extends EventTarget {
  #priceConfig;
  #pricesByPath = new Map();
  #reducedByPath = new Map();
  #request;
  #status = "idle";
  #error = null;

  /** @param {{url: string}} priceConfig */
  constructor(priceConfig) {
    super();
    this.#priceConfig = priceConfig;
  }

  get status() {
    return this.#status;
  }

  get error() {
    return this.#error;
  }

  /**
   * The amount a visitor pays: the reduced price while one applies, otherwise the regular price.
   * @param {string} productPath @param {string} currency @returns {number | null}
   */
  amount(productPath, currency) {
    return (
      this.#reducedByPath.get(productPath)?.[currency] ??
      this.#pricesByPath.get(productPath)?.[currency] ??
      null
    );
  }

  /**
   * The regular price of a product that is currently reduced; null when it is not reduced.
   * @param {string} productPath @param {string} currency @returns {number | null}
   */
  regularAmount(productPath, currency) {
    if (!this.#reducedByPath.has(productPath)) return null;
    return this.#pricesByPath.get(productPath)?.[currency] ?? null;
  }

  /** Fetch once per document; all consumers observe the same result. @returns {Promise<void>} */
  fetchPrices() {
    this.#request ??= this.#fetchPrices();
    return this.#request;
  }

  async #fetchPrices() {
    this.#status = "loading";
    this.dispatchEvent(new Event("change"));
    try {
      const response = await fetch(this.#priceConfig.url, {
        headers: { accept: "application/json" },
        priority: "low",
        redirect: "error",
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error(`Price request returned HTTP ${response.status}.`);
      if (!response.headers.get("content-type")?.includes("application/json"))
        throw new Error("The price service must return application/json.");
      const payload = await response.json();
      this.#pricesByPath = parsePrices(payload);
      this.#reducedByPath = parseReducedPrices(payload);
      this.#status = "ready";
    } catch (cause) {
      this.#error = cause;
      this.#status = "failed";
      throw cause;
    } finally {
      this.dispatchEvent(new Event("change"));
    }
  }
}

/** Validate external service data before prices affect displayed amounts or totals.
 * @param {unknown} payload @returns {Map<string, ProductPrices>} */
export function parsePrices(payload) {
  const prices = /** @type {{data?: {prices?: unknown}} | null} */ (payload)?.data?.prices;
  if (!prices || typeof prices !== "object" || Array.isArray(prices))
    throw new Error("The price service must return data.prices keyed by product URL.");
  return priceRecords(prices);
}

/** Campaign prices are optional; a response without data.reduced reduces nothing.
 * @param {unknown} payload @returns {Map<string, ProductPrices>} */
export function parseReducedPrices(payload) {
  const reduced = /** @type {{data?: {reduced?: unknown}} | null} */ (payload)?.data?.reduced;
  if (reduced === undefined) return new Map();
  if (!reduced || typeof reduced !== "object" || Array.isArray(reduced))
    throw new Error("The price service's data.reduced must be keyed by product URL.");
  return priceRecords(reduced);
}

/** @param {object} prices @returns {Map<string, ProductPrices>} */
function priceRecords(prices) {
  const pricesByPath = new Map();
  for (const [productPath, amounts] of Object.entries(prices)) {
    if (!/^\/products\/[a-z0-9-]+\/[a-z0-9]+(?:-[a-z0-9]+)*\.html$/u.test(productPath))
      throw new Error("A price record has an invalid product URL.");
    if (!amounts || typeof amounts !== "object" || Array.isArray(amounts))
      throw new Error(`Price record ${productPath} must supply EUR, USD, and CHF amounts.`);
    const normalized = {};
    for (const currency of ["eur", "usd", "chf"]) {
      const amount = amounts[currency];
      if (!Number.isSafeInteger(amount) || amount < 0)
        throw new Error(`Price record ${productPath} has an invalid ${currency} amount.`);
      normalized[currency] = amount;
    }
    pricesByPath.set(productPath, /** @type {ProductPrices} */ (normalized));
  }
  return pricesByPath;
}

export const priceClient = new PriceClient({
  url: new URL("../../prices.json", import.meta.url).href,
});
