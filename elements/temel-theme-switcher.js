import {
  applyDocumentPageBackground,
  PAGE_COLOR_SCHEMES,
  resolvedPageBackgroundColor,
} from "/@/runtime/page-color-scheme.js";

import {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  buttonSizeVariables,
  buttonVariantVariables,
} from "./page-essentials/button-foundation.js";
import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";
import { PAGE_COLOR_SCHEME_STORAGE_KEY } from "./page-essentials/page-color-scheme-preference.js";

const [LIGHT_COLOR_SCHEME, DARK_COLOR_SCHEME] = PAGE_COLOR_SCHEMES;

function attributeVariableRules(attributeName, values, variableSource) {
  return values
    .map((value) => `:host([${attributeName}="${value}"]) { ${variableSource(value)} }`)
    .join("\n");
}

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host(:not([size])) { ${buttonSizeVariables("s")} }
  :host(:not([variant])) { ${buttonVariantVariables("quiet")} }
  ${attributeVariableRules("size", BUTTON_SIZES, buttonSizeVariables)}
  ${attributeVariableRules("variant", BUTTON_VARIANTS, buttonVariantVariables)}
  :host {
    container-type: normal; display: inline-block; inline-size: max-content;
    max-inline-size: 100%; vertical-align: middle;
  }
  button {
    align-items: center; appearance: none; background: var(--button-background);
    border: var(--border-width) var(--border-style) var(--button-border-color);
    border-radius: var(--radius-sm); color: var(--button-color); cursor: pointer;
    display: inline-flex; font: var(--button-font); gap: var(--space-4); margin: 0;
    max-inline-size: 100%; min-block-size: var(--space-11); min-inline-size: var(--space-11);
    padding: var(--button-padding-block); position: relative; transition: var(--transition-control); white-space: nowrap;
  }
  button:not(:disabled):hover { background: var(--button-background-hover); border-color: var(--button-border-color-hover); }
  button:not(:disabled):active { background: var(--button-background-active); border-color: var(--button-border-color-active); }
  button:disabled { cursor: not-allowed; opacity: .48; }
  button:has(> slot.default:not(.is-filled)) { justify-content: center; }
  button:has(> slot.default:not(.is-filled)) slot.default { position: absolute; inset: 0; }
  button[aria-checked="true"] { color: var(--accent-text); }
  svg {
    flex: none; inline-size: 1lh; block-size: 1lh; fill: none; stroke: currentColor;
    stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;
    transition: transform var(--dur-fast) var(--ease-standard);
  }
  button[aria-checked="true"] svg { fill: currentColor; transform: rotate(-12deg); }
  .default { display: block; min-inline-size: var(--space-2); min-block-size: var(--space-1); }
  :host([label-display="hidden"]) .default {
    position: absolute; inline-size: var(--space-1); block-size: var(--space-1);
    min-block-size: var(--space-1); overflow: hidden; clip-path: inset(50%); white-space: nowrap;
  }
  :host([label-display="hidden"]) button { justify-content: center; }
  @media (forced-colors: active) { button { border-color: ButtonText; } }
`);

const layout = createLayoutTemplate(
  '<button type="button" role="switch" part="control"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"></path></svg><slot class="text-slot"></slot></button><slot name="provenance"></slot>',
);

/** The page, or the nested content boundary, whose color scheme the switch controls. */
function themeBoundary(element) {
  const contentBoundary = element.closest("temel-page, temel-elements");
  const isFullPage =
    !contentBoundary || contentBoundary.parentElement === element.ownerDocument.body;
  return isFullPage ? element.ownerDocument.documentElement : contentBoundary;
}

function boundaryColorScheme(boundary) {
  const colorScheme = getComputedStyle(boundary).colorScheme.trim();
  return colorScheme.startsWith(DARK_COLOR_SCHEME) ? DARK_COLOR_SCHEME : LIGHT_COLOR_SCHEME;
}

/** A labelled switch between the light and dark presentation of the page. */
export class TemelThemeSwitcher extends PageEssentialElement {
  static temelSlots = ["", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static observedAttributes = ["disabled"];

  /** @type {HTMLElement | null} */
  #boundary = null;
  /** @type {MutationObserver | null} */
  #schemeObserver = null;

  constructor() {
    super();
    this.shadowRoot.addEventListener("click", this.handleToggleClick.bind(this));
  }

  connectedCallback() {
    this.#boundary = themeBoundary(this);
    this.#restoreDocumentColorScheme();
    if (this.ownerDocument.readyState === "complete") this.#syncDocumentBackground();
    else
      addEventListener("load", this.handleDocumentLoad.bind(this), {
        once: true,
      });
    this.#schemeObserver = new MutationObserver(this.handleBoundaryMutation.bind(this));
    this.#schemeObserver.observe(this.#boundary, {
      attributeFilter: ["color-scheme", "style"],
      attributes: true,
    });
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.#schemeObserver?.disconnect();
    this.#schemeObserver = null;
    this.#boundary = null;
    super.disconnectedCallback();
  }

  attributeChangedCallback() {
    if (this.#control) this.#control.disabled = this.hasAttribute("disabled");
  }

  onTemel() {
    super.onTemel();
    this.#control.disabled = this.hasAttribute("disabled");
    if (this.#boundary) this.#syncCheckedState();
  }

  /** @returns {boolean} */
  get disabled() {
    return this.hasAttribute("disabled");
  }

  /** @param {boolean} isDisabled */
  set disabled(isDisabled) {
    this.toggleAttribute("disabled", Boolean(isDisabled));
  }

  /** @param {FocusOptions=} options Moves focus to the native switch. */
  focus(options) {
    this.#control.focus(options);
  }

  /** Activates the native switch. */
  click() {
    this.#control.click();
  }

  /** Synchronizes the switch after its containing Design System finishes loading. */
  refreshThemeState() {
    this.#syncCheckedState();
  }

  handleToggleClick(event) {
    if (!(event.target instanceof Element) || !event.target.closest("button")) return;
    if (event.defaultPrevented || this.disabled || !this.#boundary) return;
    const colorScheme =
      boundaryColorScheme(this.#boundary) === DARK_COLOR_SCHEME
        ? LIGHT_COLOR_SCHEME
        : DARK_COLOR_SCHEME;
    const backgroundColor = this.#isDocumentBoundary ? resolvedPageBackgroundColor(this) : null;
    if (this.#isDocumentBoundary) {
      localStorage.setItem(PAGE_COLOR_SCHEME_STORAGE_KEY, colorScheme);
    }
    this.#boundary.style.setProperty("color-scheme", colorScheme);
    if (backgroundColor !== null) {
      this.#boundary.style.setProperty("background-color", backgroundColor);
    }
    this.#syncCheckedState();
    this.dispatchEvent(
      new CustomEvent("color-scheme-changed", {
        bubbles: true,
        composed: true,
        detail: Object.freeze({ colorScheme }),
      }),
    );
  }

  handleDocumentLoad() {
    if (this.isConnected) this.#syncDocumentBackground();
  }

  handleBoundaryMutation() {
    this.#syncCheckedState();
  }

  get #isDocumentBoundary() {
    return this.#boundary === this.ownerDocument.documentElement;
  }

  /** @returns {HTMLButtonElement | null} */
  get #control() {
    return this.shadowRoot.querySelector("button");
  }

  #syncDocumentBackground() {
    if (this.#isDocumentBoundary) applyDocumentPageBackground(this.ownerDocument, this);
  }

  #restoreDocumentColorScheme() {
    if (!this.#isDocumentBoundary) return;
    const colorScheme = localStorage.getItem(PAGE_COLOR_SCHEME_STORAGE_KEY);
    if (colorScheme === null) return;
    if (!PAGE_COLOR_SCHEMES.includes(colorScheme)) {
      localStorage.removeItem(PAGE_COLOR_SCHEME_STORAGE_KEY);
      return;
    }
    this.#boundary.style.setProperty("color-scheme", colorScheme);
  }

  #syncCheckedState() {
    const control = this.#control;
    if (!control || !this.#boundary) return;
    const isDark = boundaryColorScheme(this.#boundary) === DARK_COLOR_SCHEME;
    control.setAttribute("aria-checked", String(isDark));
  }
}

customElements.define(
  "temel-theme-switcher",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelThemeSwitcher)),
);
