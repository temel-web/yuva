import { TemelElement } from "/@/runtime/temel-element.js";
import "/@/runtime/temel-provenance.js";

const foundation = new CSSStyleSheet();
foundation.replaceSync(`
  :host { display: block; min-inline-size: 0; color: var(--text-primary); font: var(--type-body); container-type: inline-size; }
  *, *::before, *::after { box-sizing: border-box; }
  [hidden] { display: none !important; }
  ::slotted(*) { max-inline-size: 100%; }
  ::slotted(:is(img, temel-picture)) { display: block; inline-size: 100%; block-size: auto; }
  button, select, input { font: var(--button-font); color: var(--button-color); background: var(--button-background); border: var(--border-width) solid var(--button-border-color); border-radius: var(--radius-sm); min-block-size: var(--button-min-block-size); padding: var(--button-padding-block) var(--button-padding-inline); }
  button { cursor: pointer; }
  button:hover { background: var(--button-background-hover); }
  button:active { background: var(--button-background-active); }
  button:disabled { cursor: default; opacity: 0.5; }
  :is(button, select, input, a, canvas):focus-visible { outline: var(--focus-ring-width) solid var(--border-focus); outline-offset: var(--space-2); }
  a { color: var(--text-link); }
  [data-price] { min-block-size: 1lh; }
  [data-price] del { color: var(--text-secondary); font-weight: var(--weight-regular); }
  [data-price] ins { padding: 0 var(--space-3); background: var(--accent); color: var(--text-on-accent); text-decoration: none; }
  .muted { color: var(--text-muted); }
  .status { font: var(--type-caption); }
  .sr-only { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }
`);

/** Parse a constant HTML template once at module load. @param {string} markup */
export function createTemplate(markup) {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  return template;
}

/** Native foundation for Yuva's authored content and visitor interactions. */
export class StoreElement extends TemelElement(HTMLElement) {
  static preferenceTopics = Object.freeze(["cart", "currency"]);
  /** @type {CSSStyleSheet | null} */
  static styles = null;
  /** @type {HTMLTemplateElement | null} */
  static layout = null;
  #subscriptions;
  #internals;
  /** @type {{ name: string, className: string, attributes: [string, string][], current: HTMLSlotElement }[]} */
  #slots = [];
  #variationChain = "[]";
  #handlePreferenceBound = this.handlePreferenceChange.bind(this);
  #handleStorageBound = this.#handleStorageChange.bind(this);
  #handleContentBound = this.handleContentChange.bind(this);

  constructor() {
    super();
    const { styles, layout } = /** @type {typeof StoreElement} */ (
      this.constructor
    );
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = styles
      ? [foundation, styles]
      : [foundation];
    this.#internals = this.attachInternals();
    if (layout) {
      const fragment = /** @type {DocumentFragment} */ (
        layout.content.cloneNode(true)
      );
      this.mountSlots(fragment);
      this.shadowRoot.append(fragment);
    }
  }

  connectedCallback() {
    customElements.upgrade(this);
    this.#subscriptions?.abort();
    this.#subscriptions = new AbortController();
    const options = { signal: this.#subscriptions.signal };
    const topics = /** @type {typeof StoreElement} */ (this.constructor)
      .preferenceTopics;
    if (topics.length > 0)
      window.addEventListener("storage", this.#handleStorageBound, options);
    if (topics.includes("cart")) {
      document.addEventListener(
        "cart-change",
        this.#handlePreferenceBound,
        options,
      );
    }
    if (topics.includes("currency")) {
      document.addEventListener(
        "currency-change",
        this.#handlePreferenceBound,
        options,
      );
    }
    // The element does not observe its own content. A published page changes it only through
    // variations, which arrive in onTemel; the Editor reports every edit with temel-changed.
    // Do not update on slotchange: update() inserts fresh Slots for prices and statuses, and
    // each one would report a Slot change again.
    this.addEventListener("temel-changed", this.#handleContentBound, options);
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.#subscriptions?.abort();
    super.disconnectedCallback();
  }

  #handleStorageChange(event) {
    if (
      event.key !== null &&
      event.key !== "yuva.cart.v1" &&
      event.key !== "yuva.currency.v1"
    ) {
      return;
    }
    this.handlePreferenceChange();
  }

  onTemel() {
    const chain = JSON.stringify(this.activeVariationChain ?? []);
    if (chain !== this.#variationChain) {
      this.#variationChain = chain;
      for (const entry of this.#slots) {
        if (!entry.current.parentNode) continue;
        const freshSlot = this.#createTrackedSlot(entry);
        entry.current.replaceWith(freshSlot);
        entry.current = freshSlot;
      }
    }
    this.update();
  }
  handleContentChange() {
    this.update();
  }
  handlePreferenceChange() {
    this.update();
  }
  update() {}

  /** @param {string} name @param {boolean} isEnabled */
  setState(name, isEnabled) {
    if (isEnabled) this.#internals.states.add(name);
    else this.#internals.states.delete(name);
  }

  /** Replace every `<slot>` placeholder under `root` with a tracked `temelSlot()`. @param {ParentNode} root */
  mountSlots(root) {
    for (const placeholder of root.querySelectorAll("slot")) {
      const entry = {
        name: placeholder.getAttribute("name") ?? "",
        className: placeholder.className,
        attributes: Array.from(placeholder.attributes)
          .filter(
            (attribute) =>
              attribute.name !== "name" && attribute.name !== "class",
          )
          .map(
            (attribute) =>
              /** @type {[string, string]} */ ([
                attribute.name,
                attribute.value,
              ]),
          ),
        current: null,
      };
      const slot = this.#createTrackedSlot(entry);
      entry.current = slot;
      placeholder.replaceWith(slot);
      this.#slots.push(entry);
    }
  }

  /** @param {string} name @returns {HTMLSlotElement | null} */
  slotFor(name) {
    return this.#slots.find((entry) => entry.name === name)?.current ?? null;
  }

  /** @param {{ name: string, className: string, attributes: [string, string][] }} entry */
  #createTrackedSlot(entry) {
    const slot = this.temelSlot(entry.name);
    if (entry.className) {
      for (const cascadeSlot of [slot, ...slot.querySelectorAll("slot")]) {
        cascadeSlot.className = entry.className;
      }
    }
    for (const [attrName, attrValue] of entry.attributes) {
      slot.setAttribute(attrName, attrValue);
    }
    return slot;
  }

  /** @param {string} name @returns {HTMLElement | null} */
  field(name) {
    const slot =
      this.slotFor(name) ??
      this.shadowRoot.querySelector(`slot[name="${name}"]`);
    return slot?.assignedElements({ flatten: true })[0] ?? null;
  }

  /** @param {string} name @returns {string} */
  text(name) {
    return this.field(name)?.textContent.trim() ?? "";
  }
}
