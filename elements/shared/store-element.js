import { TemelElement, css } from "/@/runtime/temel-element.js";
import "/@/runtime/temel-provenance.js";

const foundation = css`
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
`;

/**
 * Find the outermost Slot for a declared name in a shadow root, including variation cascades.
 * @param {ShadowRoot} shadowRoot
 * @param {string} name
 * @returns {HTMLSlotElement | null}
 */
function findLayoutSlot(shadowRoot, name) {
  const selector = name ? `slot[name="${CSS.escape(name)}"]` : "slot:not([name])";
  let slot = shadowRoot.querySelector(selector);
  while (slot?.parentElement instanceof HTMLSlotElement) {
    slot = slot.parentElement;
  }
  return /** @type {HTMLSlotElement | null} */ (slot);
}

/** Native foundation for Yuva's authored content and visitor interactions. */
export class StoreElement extends TemelElement(HTMLElement) {
  static preferenceTopics = Object.freeze(["cart", "currency"]);
  /** @type {CSSStyleSheet[]} */
  static styles = [foundation];
  #subscriptions;
  #internals;
  #handlePreferenceBound = this.handlePreferenceChange.bind(this);
  #handleStorageBound = this.#handleStorageChange.bind(this);
  #handleContentBound = this.handleContentChange.bind(this);

  constructor() {
    super();
    this.#internals = this.attachInternals();
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
    super.onTemel();
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

  /** @param {string} name @returns {HTMLSlotElement | null} */
  slotFor(name) {
    return findLayoutSlot(this.shadowRoot, name);
  }

  /** @param {string} name @returns {HTMLElement | null} */
  field(name) {
    return this.slotFor(name)?.assignedElements({ flatten: true })[0] ?? null;
  }

  /** @param {string} name @returns {string} */
  text(name) {
    return this.field(name)?.textContent.trim() ?? "";
  }
}
