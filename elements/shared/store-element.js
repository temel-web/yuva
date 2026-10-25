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
  .muted { color: var(--text-muted); }
  .status { font: var(--type-caption); }
  .sr-only { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }
`);

/** Native foundation for Yuva's authored content and visitor interactions. */
export class StoreElement extends TemelElement(HTMLElement) {
  #observer = new MutationObserver(this.handleContentChange.bind(this));
  #subscriptions;
  #internals;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [foundation];
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    customElements.upgrade(this);
    this.#subscriptions = new AbortController();
    const options = { signal: this.#subscriptions.signal };
    window.addEventListener(
      "storage",
      this.handlePreferenceChange.bind(this),
      options,
    );
    document.addEventListener(
      "cart-change",
      this.handlePreferenceChange.bind(this),
      options,
    );
    document.addEventListener(
      "currency-change",
      this.handlePreferenceChange.bind(this),
      options,
    );
    this.#observer.observe(this, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.#subscriptions.abort();
    this.#observer.disconnect();
    super.disconnectedCallback();
  }

  onTemel() {
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

  /** @param {string} css */
  addStyles(css) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this.shadowRoot.adoptedStyleSheets = [
      ...this.shadowRoot.adoptedStyleSheets,
      sheet,
    ];
  }

  /** @param {string} name @returns {HTMLElement | null} */
  field(name) {
    const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
    return slot?.assignedElements()[0] ?? null;
  }

  /** @param {string} name @returns {string} */
  text(name) {
    return this.field(name)?.textContent.trim() ?? "";
  }
}

/** Build owned DOM without parsing HTML strings. @param {string} tag
 * @param {Record<string, string>} [attributes] @param {Node[]} [children] */
export function node(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes))
    element.setAttribute(name, value);
  element.append(...children);
  return element;
}

/** @param {StoreElement} host @param {string[]} names */
export function appendSlots(host, names) {
  host.shadowRoot.append(...names.map((name) => host.temelSlot(name)));
}
