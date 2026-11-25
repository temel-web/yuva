import { StoreElement } from "./store-element.js";
import { priceClient } from "./price-client.js";

/** Load shared prices when a product or cart approaches the viewport. */
export class PricedStoreElement extends StoreElement {
  #priceSubscriptions;
  #priceObserver = new IntersectionObserver(this.handlePriceVisibilityChange.bind(this), {
    rootMargin: "200px 0px",
  });

  connectedCallback() {
    this.#priceSubscriptions = new AbortController();
    priceClient.addEventListener("change", this.handlePreferenceChange.bind(this), {
      signal: this.#priceSubscriptions.signal,
    });
    super.connectedCallback();
    if (priceClient.status === "idle") this.#priceObserver.observe(this);
  }

  disconnectedCallback() {
    this.#priceSubscriptions.abort();
    this.#priceObserver.disconnect();
    super.disconnectedCallback();
  }

  /** @param {IntersectionObserverEntry[]} entries */
  handlePriceVisibilityChange(entries) {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    this.#priceObserver.disconnect();
    if (priceClient.status !== "idle") return;
    priceClient.fetchPrices().catch(function reportPriceFailure(cause) {
      document.dispatchEvent(new CustomEvent("prices-error", { detail: cause }));
    });
  }
}
