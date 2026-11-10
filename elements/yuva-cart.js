import { node } from "./shared/store-element.js";
import { PricedStoreElement } from "./shared/priced-store-element.js";
import { money, readCart, readCurrency, setQuantity } from "./shared/store-preferences.js";
import { CartContentController } from "./shared/cart-content-controller.js";
import { priceClient } from "./shared/price-client.js";
import "./yuva-cart-line.js";

const documentStyles = new CSSStyleSheet();
documentStyles.replaceSync(`
  yuva-cart > [slot="empty"] a {
    display: inline-flex; align-items: center; min-block-size: var(--space-11);
    padding-block: var(--space-4); color: var(--text-primary); font: var(--type-ui-strong);
    text-decoration-thickness: var(--border-width); text-underline-offset: var(--space-2);
  }
  yuva-cart > [slot="empty"] a:focus-visible {
    outline: var(--border-width-thick) solid var(--border-focus); outline-offset: var(--space-2);
  }
`);

/** Read saved product documents and compose their cart rows in the browser. */
export class YuvaCart extends PricedStoreElement {
  static temelSlots = [
    "",
    "heading",
    "empty",
    "subtotal",
    "loading",
    "unavailable",
    "content-error",
    "retry",
    "remove",
    "error",
    "price-error",
    "notice",
    "provenance",
  ];
  #empty;
  #summary;
  #total;
  #loading;
  #items;
  #status;
  #lineTemplateSlot;
  #rowsByPath = new Map();
  #observedLines = new WeakSet();
  #content = new CartContentController({
    ownerDocument: this.ownerDocument,
    onChange: this.update.bind(this),
  });

  constructor() {
    super();
    this.#empty = node("div", { tabindex: "-1", hidden: "" }, [this.temelSlot("empty")]);
    this.#loading = node("div", { role: "status", tabindex: "-1" }, [this.temelSlot("loading")]);
    this.#items = node("ul", { class: "items" });
    this.#total = node("output");
    this.#summary = node("div", { class: "summary", hidden: "" }, [
      this.temelSlot("subtotal"),
      this.#total,
    ]);
    this.#status = node("div", { role: "status", class: "status" });
    this.#lineTemplateSlot = this.temelSlot("");
    this.shadowRoot.append(
      this.temelSlot("heading"),
      this.temelSlot("notice"),
      this.#loading,
      this.#empty,
      node("div", { hidden: "" }, [this.#lineTemplateSlot]),
      this.#items,
      node("div", { hidden: "" }, [
        ...["unavailable", "content-error", "retry", "remove"].map((name) => this.temelSlot(name)),
      ]),
      this.#summary,
      this.#status,
      this.temelSlot("provenance"),
    );
    this.shadowRoot.addEventListener("cart-item-removed", this.handleItemRemoved.bind(this));
    this.addStyles(`
      :host { padding: var(--space-11) max(clamp(var(--space-7), 4%, var(--space-9)), calc((100% - 80rem) / 2)) var(--space-13); min-block-size: 50svh; }
      ::slotted([slot="heading"]) { font: var(--weight-semibold) clamp(var(--text-4xl), 6cqi, var(--text-6xl))/1.05 var(--font-ui); letter-spacing: -0.035em; margin-block: 0 var(--space-8); }
      ::slotted([slot="notice"]) { color: var(--text-muted); }
      ::slotted([slot="empty"]) { display: grid; gap: var(--space-7); max-inline-size: 42ch; padding-block: var(--space-11); }
      .items { list-style: none; padding: 0; margin: 0; }
      .summary { border-block-start: var(--border-width) solid var(--border-default); padding-block-start: var(--space-8); display: flex; justify-content: space-between; font: var(--type-title); margin-block-start: var(--space-10); }
      .unavailable { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-6); padding-block: var(--space-8); }
      .unavailable span { flex: 1; overflow-wrap: anywhere; }
    `);
  }

  connectedCallback() {
    const root = this.getRootNode();
    if (!root.adoptedStyleSheets.includes(documentStyles)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, documentStyles];
    }
    this.#content.connect();
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.#content.disconnect();
    super.disconnectedCallback();
  }

  update() {
    if (!this.isConnected) return;
    let items;
    try {
      items = readCart();
    } catch (cause) {
      this.#showStorageFailure(cause);
      return;
    }
    const content = this.#content.synchronize(items.map((item) => item.path));
    const isLoading = content.some((entry) => ["queued", "loading"].includes(entry.status));
    const wasLoadingFocused = this.shadowRoot.activeElement === this.#loading;
    this.#loading.hidden = !isLoading;
    this.#items.setAttribute("aria-busy", String(isLoading));
    this.#empty.hidden = items.length > 0;
    this.#renderItems(content.filter((entry) => !["queued", "loading"].includes(entry.status)));
    this.#updateSubtotal(items, content);
    if (wasLoadingFocused && !isLoading) this.#focusItem(this.#items.firstElementChild);
    this.setState("empty", items.length === 0);
  }

  /** @param {import("./shared/cart-content-controller.js").CartContent[]} content */
  #renderItems(content) {
    const paths = new Set(content.map((entry) => entry.path));
    let shouldMoveFocus = false;
    for (const [path, row] of this.#rowsByPath) {
      if (paths.has(path)) continue;
      shouldMoveFocus ||= row.contains(this.shadowRoot.activeElement);
      row.remove();
      this.#rowsByPath.delete(path);
    }
    let previous = null;
    for (const entry of content) {
      let row = this.#rowsByPath.get(entry.path);
      if (!row) {
        row = node("li");
        this.#rowsByPath.set(entry.path, row);
      }
      const next = previous ? previous.nextSibling : this.#items.firstChild;
      if (next !== row) this.#items.insertBefore(row, next);
      previous = row;
      this.#updateRow(row, entry);
    }
    if (shouldMoveFocus) this.#focusItem(this.#items.firstElementChild);
  }

  /** @param {HTMLElement} row
   * @param {import("./shared/cart-content-controller.js").CartContent} entry */
  #updateRow(row, entry) {
    const hasFocus = row.contains(this.shadowRoot.activeElement);
    if (entry.status === "ready") {
      if (!this.#observedLines.has(entry.line)) {
        const template = this.#lineTemplateSlot.assignedElements()[0];
        const populatedSlots = new Set(Array.from(entry.line.children, (child) => child.slot));
        const labels = Array.from(template?.children ?? []).filter(
          (child) => !populatedSlots.has(child.slot),
        );
        entry.line.append(...labels.map((child) => child.cloneNode(true)));
        entry.line.addEventListener("cart-item-removed", this.handleItemRemoved.bind(this));
        this.#observedLines.add(entry.line);
      }
      if (row.firstChild !== entry.line) row.replaceChildren(entry.line);
      entry.line.update();
    } else {
      if (row.dataset.status !== entry.status) {
        row.replaceChildren(this.#unresolvedItem(entry));
      }
      const message = entry.status === "missing" ? "unavailable" : "content-error";
      row.querySelector("span").textContent = this.text(message);
      row.querySelector("button").textContent = this.text("remove");
      const retry = row.querySelector("button + button");
      if (retry) retry.textContent = this.text("retry");
    }
    row.dataset.status = entry.status;
    if (hasFocus && !row.contains(this.shadowRoot.activeElement)) this.#focusItem(row);
  }

  /** @param {import("./shared/cart-content-controller.js").CartContent} entry */
  #unresolvedItem(entry) {
    const isFailed = entry.status === "failed";
    const isMissing = entry.status === "missing";
    const message = node("span");
    message.textContent = this.text(isMissing ? "unavailable" : "content-error");
    const remove = node("button", { type: "button" }, [this.text("remove")]);
    remove.dataset.path = entry.path;
    remove.addEventListener("click", this.handleUnavailableRemove.bind(this));
    const children = [message, remove];
    if (isFailed) {
      const retry = node("button", { type: "button" }, [this.text("retry")]);
      retry.dataset.path = entry.path;
      retry.addEventListener("click", this.handleContentRetry.bind(this));
      children.push(retry);
    }
    return node("div", { class: "unavailable" }, children);
  }

  /** @param {import("./shared/store-preferences.js").CartItem[]} items
   * @param {import("./shared/cart-content-controller.js").CartContent[]} content */
  #updateSubtotal(items, content) {
    const hasContent = content.every((entry) => entry.status === "ready");
    const lines = content.map((entry) => entry.line);
    const hasPrices =
      hasContent && priceClient.status === "ready" && lines.every((line) => line.amount !== null);
    const subtotal = hasPrices
      ? items.reduce((total, item, index) => total + item.quantity * lines[index].amount, 0)
      : 0;
    const hasSubtotal = hasPrices && Number.isSafeInteger(subtotal);
    this.#total.textContent = hasSubtotal ? money(subtotal, readCurrency(this), this) : "";
    this.#summary.hidden = items.length === 0 || !hasSubtotal;
    const shouldReport =
      items.length > 0 &&
      hasContent &&
      !hasSubtotal &&
      !["idle", "loading"].includes(priceClient.status);
    const message = hasPrices ? "error" : "price-error";
    const current = this.#status.querySelector("slot")?.name;
    if (current !== (shouldReport ? message : undefined)) {
      this.#status.replaceChildren(...(shouldReport ? [this.temelSlot(message)] : []));
    }
  }

  /** @param {Error} cause */
  #showStorageFailure(cause) {
    this.#content.synchronize([]);
    this.#items.replaceChildren();
    this.#rowsByPath.clear();
    this.#empty.hidden = true;
    this.#loading.hidden = true;
    this.#summary.hidden = true;
    this.#status.replaceChildren(this.temelSlot("error"));
    this.dispatchEvent(
      new CustomEvent("cart-error", {
        bubbles: true,
        composed: true,
        detail: cause,
      }),
    );
  }

  handleContentRetry(event) {
    this.#content.retry(event.currentTarget.dataset.path);
  }

  async handleUnavailableRemove(event) {
    try {
      await setQuantity(event.currentTarget.dataset.path, 0);
      this.handleItemRemoved();
    } catch (cause) {
      this.#status.replaceChildren(this.temelSlot("error"));
      this.dispatchEvent(
        new CustomEvent("cart-error", {
          bubbles: true,
          composed: true,
          detail: cause,
        }),
      );
    }
  }

  handleItemRemoved() {
    this.#focusItem(this.#items.firstElementChild);
  }

  /** @param {Element | null} row */
  #focusItem(row) {
    const input = row?.querySelector("yuva-cart-line")?.shadowRoot?.querySelector("input");
    const button = row?.querySelector("button");
    (input ?? button ?? (this.#loading.hidden ? this.#empty : this.#loading)).focus();
  }
}
customElements.define("yuva-cart", YuvaCart);
