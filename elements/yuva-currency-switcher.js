import {
  buttonSizeVariables,
  buttonVariantVariables,
} from "/@temel/elements/page-essentials/page-essential-element.js";
import { StoreElement, createTemplate } from "./shared/store-element.js";
import {
  CURRENCIES,
  readCurrency,
  setCurrency,
} from "./shared/store-preferences.js";

const MENU_KEYS = new Set(["ArrowDown", "ArrowUp", "Home", "End"]);
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { position: relative; container-type: normal; display: inline-block; font: var(--type-ui); }
  .trigger {
    ${buttonSizeVariables("s")} ${buttonVariantVariables("quiet")}
    anchor-name: --currency-trigger; display: inline-flex; align-items: center; gap: var(--space-3);
    min-block-size: var(--space-11); min-inline-size: var(--space-11); margin: 0;
    padding: var(--button-padding-block) var(--space-4); white-space: nowrap;
    letter-spacing: var(--tracking-wide);
  }
  .trigger[aria-expanded="true"] { background: var(--surface-selected); }
  .trigger:focus-visible { outline-offset: calc(-1 * var(--focus-ring-width)); }
  svg {
    inline-size: 1em; block-size: 1em; fill: none; stroke: currentColor; stroke-width: 1.75;
    stroke-linecap: round; stroke-linejoin: round;
  }
  .chevron { color: var(--accent-text); transition: rotate var(--dur-fast) var(--ease-standard); }
  .trigger[aria-expanded="true"] .chevron { rotate: 180deg; }
  .currencies {
    margin: var(--space-2) 0 0; padding: var(--space-3); min-inline-size: var(--w-menu-min);
    max-block-size: calc(100dvh - var(--space-11) * 2); overflow: auto; overscroll-behavior: contain;
    color: var(--text-primary); background: var(--surface-overlay);
    border: var(--border-width) var(--border-style) var(--border-default);
    border-radius: var(--radius-sm); box-shadow: var(--shadow-menu);
  }
  .currencies[popover] {
    position-anchor: --currency-trigger; position-area: block-end span-inline-start;
    position-try-fallbacks: flip-inline, flip-block, flip-block flip-inline; inset: auto;
  }
  .currencies:not([popover]) { position: static; max-block-size: none; }
  .menu-label {
    display: block; padding: var(--space-3) var(--space-5);
    color: var(--text-secondary); font: var(--type-caption);
  }
  .choice {
    display: flex; align-items: center; justify-content: space-between; gap: var(--space-7);
    inline-size: 100%; min-block-size: var(--h-control); padding: var(--space-3) var(--space-5);
    color: var(--text-primary); background: transparent; border-color: transparent;
    text-align: start; font: var(--type-ui);
  }
  .choice:hover { background: var(--surface-hover); }
  .choice[aria-checked="true"] { background: var(--surface-selected); font: var(--type-ui-strong); }
  .choice:not([aria-checked="true"]) .check { visibility: hidden; }
  slot { display: inline-block; min-inline-size: var(--space-1); min-block-size: 1lh; }
  @media (prefers-reduced-motion: reduce) { .chevron { transition: none; } }
  @media (forced-colors: active) { .currencies { border-color: CanvasText; } }
`);

const layout = createTemplate(`
  <button
    type="button"
    class="trigger"
    popovertarget="currencies"
    aria-haspopup="menu"
    aria-controls="currencies"
    aria-expanded="false"
    aria-labelledby="currency-label current-currency"
  >
    <span id="current-currency"></span>
    <svg class="chevron" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6"></path>
    </svg>
  </button>
  <div id="currencies" class="currencies" role="menu" popover="auto" aria-labelledby="currency-label">
    <span id="currency-label" class="menu-label"><slot name="label"></slot></span>
  </div>
  <slot name="provenance"></slot>
`);

const choiceTemplate = createTemplate(`
  <button type="button" class="choice" role="menuitemradio" aria-checked="false">
    <slot></slot>
    <svg class="check" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="m5 12 5 5 9-10"></path>
    </svg>
  </button>
`);

function nextChoiceIndex(key, index, count) {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (key === "ArrowDown") return (index + 1) % count;
  return index <= 0 ? count - 1 : index - 1;
}

/** The visitor's currency preference, chosen from a labelled dropdown. */
export class YuvaCurrencySwitcher extends StoreElement {
  static preferenceTopics = Object.freeze(["currency"]);
  static temelSlots = ["label", "eur", "usd", "chf", "provenance"];
  static styles = styles;
  static layout = layout;
  #choices = [];
  #trigger;
  #current;
  #menu;
  #presentation = null;
  #firstFocus = null;

  constructor() {
    super();
    this.#trigger = this.shadowRoot.querySelector(".trigger");
    this.#current = this.shadowRoot.querySelector("#current-currency");
    this.#menu = this.shadowRoot.querySelector("#currencies");
    this.#choices = CURRENCIES.map((currency) => this.#createChoice(currency));
    this.#menu.append(...this.#choices);
    this.#trigger.addEventListener("click", this.handleTriggerClick.bind(this));
    this.#menu.addEventListener("toggle", this.handleMenuToggle.bind(this));
    this.shadowRoot.addEventListener(
      "keydown",
      this.handleSelectorKeydown.bind(this),
    );
    this.shadowRoot.addEventListener(
      "slotchange",
      this.handleContentChange.bind(this),
    );
  }

  update() {
    if (!this.#current) return;
    const currency = readCurrency(this);
    const selected = this.#choices.find((choice) => choice.value === currency);
    const slot = selected.querySelector("slot");
    this.#current.textContent = slot
      .assignedNodes({ flatten: true })
      .map((content) => content.textContent)
      .join("")
      .trim();
    for (const choice of this.#choices) {
      choice.setAttribute("aria-checked", String(choice.value === currency));
    }
  }

  /** Draw an editor state without changing the visitor preference or moving focus. */
  presentState(state) {
    if (![null, "default", "open"].includes(state)) {
      throw new Error("Currency presentation must be default, open, or null.");
    }
    this.#presentation = state;
    if (this.#menu.matches(":popover-open")) this.#menu.hidePopover();
    if (state === null) this.#menu.setAttribute("popover", "auto");
    else this.#menu.removeAttribute("popover");
    this.#menu.hidden = state !== null && state !== "open";
    this.#trigger.setAttribute("aria-expanded", String(state === "open"));
  }

  handleTriggerClick(event) {
    if (this.#presentation !== null) event.preventDefault();
  }

  handleCurrencyClick(event) {
    if (this.#presentation !== null) return;
    try {
      setCurrency(event.currentTarget.value);
    } finally {
      this.#menu.hidePopover();
      this.#trigger.focus();
    }
  }

  handleMenuToggle(event) {
    const isOpen = this.#presentation === "open" || event.newState === "open";
    this.#trigger.setAttribute("aria-expanded", String(isOpen));
    if (!isOpen || this.#presentation !== null) return;
    const index = this.#firstFocus ?? CURRENCIES.indexOf(readCurrency(this));
    this.#choices[index].focus();
    this.#firstFocus = null;
  }

  handleSelectorKeydown(event) {
    if (this.#presentation !== null) return;
    const isOpen = this.#menu.matches(":popover-open");
    if (isOpen && event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.#menu.hidePopover();
      this.#trigger.focus();
      return;
    }
    if (!MENU_KEYS.has(event.key)) return;
    if (!isOpen && !["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    if (!isOpen) {
      this.#firstFocus = event.key === "ArrowUp" ? this.#choices.length - 1 : 0;
      this.#menu.showPopover();
      return;
    }
    const index = this.#choices.indexOf(this.shadowRoot.activeElement);
    this.#choices[
      nextChoiceIndex(event.key, index, this.#choices.length)
    ].focus();
  }

  #createChoice(currency) {
    const fragment = /** @type {DocumentFragment} */ (
      choiceTemplate.content.cloneNode(true)
    );
    const choice = fragment.querySelector("button");
    choice.value = currency;
    fragment.querySelector("slot").setAttribute("name", currency);
    this.mountSlots(fragment);
    choice.addEventListener("click", this.handleCurrencyClick.bind(this));
    return choice;
  }
}
customElements.define("yuva-currency-switcher", YuvaCurrencySwitcher);
