import { fetchCartLine } from "./cart-line-client.js";

const MAX_CONCURRENT_REQUESTS = 3;

/**
 * @typedef {{path: string, status: string, line?: HTMLElement, request?: AbortController}} CartContent
 */

/** Own this cart's product-content cache, bounded queue and cancellation. */
export class CartContentController {
  #cartContentServices;
  #contentByPath = new Map();
  #paths = [];
  #activeRequests = 0;
  #isConnected = false;

  /** @param {{ownerDocument: Document, onChange: () => void}} cartContentServices */
  constructor(cartContentServices) {
    this.#cartContentServices = cartContentServices;
  }

  connect() {
    this.#isConnected = true;
  }

  disconnect() {
    this.#isConnected = false;
    for (const [path, content] of this.#contentByPath) {
      if (["queued", "loading"].includes(content.status)) content.request?.abort();
      if (content.status !== "ready") this.#contentByPath.delete(path);
    }
  }

  /** Retain saved order and coalesce work; removed in-flight results can never reappear.
   * @param {string[]} paths @returns {CartContent[]} */
  synchronize(paths) {
    this.#paths = paths;
    for (const [path, content] of this.#contentByPath) {
      if (paths.includes(path)) continue;
      if (["queued", "loading"].includes(content.status)) content.request?.abort();
      this.#contentByPath.delete(path);
    }
    for (const path of paths) {
      if (!this.#contentByPath.has(path))
        this.#contentByPath.set(path, { path, status: "queued" });
    }
    this.#startQueuedRequests();
    return paths.map((path) => this.#contentByPath.get(path));
  }

  /** Retry an explicit failed read of the same product document. @param {string} path */
  retry(path) {
    const content = this.#contentByPath.get(path);
    if (content?.status !== "failed") return;
    content.status = "queued";
    this.#cartContentServices.onChange();
  }

  #startQueuedRequests() {
    if (!this.#isConnected) return;
    for (const path of this.#paths) {
      if (this.#activeRequests >= MAX_CONCURRENT_REQUESTS) return;
      const content = this.#contentByPath.get(path);
      if (content.status !== "queued") continue;
      content.status = "loading";
      content.request = new AbortController();
      this.#activeRequests += 1;
      // Each request reports its terminal state and releases its owned queue slot.
      void this.#fetchContent(content);
    }
  }

  /** @param {CartContent} content */
  async #fetchContent(content) {
    const signal = content.request.signal;
    try {
      const line = await fetchCartLine(
        content.path,
        this.#cartContentServices.ownerDocument,
        signal,
      );
      if (signal.aborted || this.#contentByPath.get(content.path) !== content)
        return;
      content.line = line;
      content.status = "ready";
    } catch (cause) {
      if (signal.aborted || this.#contentByPath.get(content.path) !== content)
        return;
      content.status =
        cause?.code === "cart_product_missing" ? "missing" : "failed";
    } finally {
      this.#activeRequests -= 1;
      if (this.#isConnected) {
        this.#startQueuedRequests();
        this.#cartContentServices.onChange();
      }
    }
  }
}
