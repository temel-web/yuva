import { languageVersionPath, pageLanguages } from "/@/runtime/language-paths.js";
import { readPageContext } from "/@/runtime/page-context.js";

import {
  buttonSizeVariables,
  buttonVariantVariables,
} from "./page-essentials/button-foundation.js";
import { node, svgNode } from "./page-essentials/layout-template.js";
import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const VISUALLY_HIDDEN = `
  position: absolute; inline-size: var(--space-1); block-size: var(--space-1);
  min-block-size: var(--space-1); overflow: hidden; clip-path: inset(50%); white-space: nowrap;
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { container-type: normal; font: var(--type-ui); }
  :host(:state(empty)) { display: none; }
  :host(:not([layout="list"])) {
    display: inline-block; inline-size: max-content; max-inline-size: 100%; vertical-align: middle;
  }
  .selector { display: flex; align-items: center; gap: var(--space-3); }
  .label { font: var(--type-caption); color: var(--text-secondary); }
  :host([label-display="hidden"]) .label { ${VISUALLY_HIDDEN} }
  .trigger {
    ${buttonSizeVariables("s")} ${buttonVariantVariables("quiet")}
    anchor-name: --language-trigger; appearance: none; align-items: center; display: inline-flex;
    gap: var(--space-3); margin: 0; min-block-size: var(--space-11); min-inline-size: var(--space-11);
    padding: var(--button-padding-block) var(--space-4); cursor: pointer; white-space: nowrap;
    font: var(--button-font); letter-spacing: var(--tracking-wide); color: var(--button-color);
    background: var(--button-background); border-radius: var(--radius-sm);
    border: var(--border-width) var(--border-style) var(--button-border-color);
    transition: var(--transition-control);
  }
  .trigger:hover { background: var(--button-background-hover); }
  .trigger:active { background: var(--button-background-active); }
  .trigger[aria-expanded="true"] { background: var(--surface-selected); }
  /* An inset ring stays visible where a scrolling container, such as a header menu, clips. */
  .trigger:focus-visible { outline-offset: calc(-1 * var(--focus-ring-width)); }
  svg {
    flex: none; inline-size: 1lh; block-size: 1lh; fill: none; stroke: currentColor;
    stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.75;
  }
  .chevron {
    inline-size: 1em; block-size: 1em; color: var(--accent-text);
    transition: rotate var(--dur-fast) var(--ease-standard);
  }
  .trigger[aria-expanded="true"] .chevron { rotate: 180deg; }
  .languages[popover] {
    position-anchor: --language-trigger; position-area: block-end span-inline-start;
    position-try-fallbacks: flip-inline, flip-block, flip-block flip-inline;
    inset: auto; margin: var(--space-2) 0 0; padding: var(--space-3);
    min-inline-size: var(--w-menu-min); max-block-size: calc(100dvh - var(--space-11) * 2);
    overflow: auto; overscroll-behavior: contain; color: var(--text-primary);
    background: var(--surface-overlay); border: var(--border-width) var(--border-style) var(--border-default);
    border-radius: var(--radius-sm); box-shadow: var(--shadow-menu);
    transition: opacity var(--dur-fast) var(--ease-out), display var(--dur-fast) allow-discrete,
      overlay var(--dur-fast) allow-discrete;
  }
  .languages[popover]:not(:popover-open) { opacity: 0; }
  @starting-style { .languages[popover]:popover-open { opacity: 0; } }
  .list { display: grid; gap: var(--space-1); margin: 0; padding: 0; list-style: none; }
  [popover] a {
    display: flex; align-items: center; justify-content: space-between; gap: var(--space-7);
    min-block-size: var(--h-control); padding-inline: var(--space-5);
    border-radius: var(--radius-sm); color: var(--text-primary); text-decoration: none;
    transition: var(--transition-control);
  }
  [popover] a:hover { background: var(--surface-hover); }
  [popover] a[aria-current="page"] { background: var(--surface-selected); font: var(--type-ui-strong); }
  [popover] a:not([aria-current="page"]) .check { visibility: hidden; }
  :host([layout="list"]) .selector { display: grid; justify-items: start; gap: var(--space-5); }
  :host([layout="list"]) .trigger { display: none; }
  :host([layout="list"]) .list { display: flex; flex-direction: column; align-items: start; gap: var(--space-5); }
  :host([layout="list"]) a {
    display: inline-flex; align-items: center; min-block-size: var(--h-control);
    font: var(--type-ui-strong); color: var(--text-primary); text-decoration: none;
    background: linear-gradient(currentColor, currentColor) no-repeat 0 calc(100% - var(--space-2)) / 0 var(--border-width-thick);
    transition: background-size var(--dur-slow) var(--ease-out), color var(--dur-base) var(--ease-out);
  }
  :host([layout="list"]) a:is(:hover, [aria-current="page"]) { background-size: 100% var(--border-width-thick); }
  :host([layout="list"]) a[aria-current="page"] { color: var(--accent-text); }
  :host([layout="list"]) .check { display: none; }
  @media (forced-colors: active) {
    .languages[popover] { border-color: CanvasText; }
    [popover] a[aria-current="page"] { outline: var(--border-width) solid CanvasText; }
  }
`);

const layout = createLayoutTemplate(
  '<div class="selector"><slot class="label text-slot"></slot><button class="trigger" type="button" popovertarget="languages" aria-expanded="false" part="control"><svg class="globe" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"></path></svg><span class="code"></span><svg class="chevron" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg></button><span class="current" hidden></span><div class="languages" id="languages" part="languages"><ul class="list" role="list"></ul></div></div><slot name="provenance"></slot>',
);

const LINK_KEYS = Object.freeze(["ArrowDown", "ArrowUp", "Home", "End"]);

/**
 * @typedef {{code: string, href: string, name: string, isCurrent: boolean}} LanguageVersion
 */

/**
 * A language's name in that language, capitalized as a menu item: Français, Deutsch (Schweiz).
 * @param {string} code
 */
function nativeLanguageName(code) {
  const names = new Intl.DisplayNames([code], { type: "language", languageDisplay: "standard" });
  const name = names.of(code) ?? code;
  return `${name.charAt(0).toLocaleUpperCase(code)}${name.slice(1)}`;
}

/**
 * The current page in every language of its site that has a version of it, in the order of the
 * site's language settings. Empty on a page without language data.
 * @param {Element} element
 * @returns {LanguageVersion[]}
 */
function pageLanguageVersions(element) {
  const languages = pageLanguages(element.ownerDocument);
  if (languages === null || languages.languages.length < 2) return [];
  const { pagePath } = readPageContext(element);
  return languages.languages.flatMap(function languageVersion(language) {
    const href = languageVersionPath(pagePath, language.code, element.ownerDocument);
    if (href === null) return [];
    const isCurrent = language === languages.language;
    return [{ code: language.code, href, name: nativeLanguageName(language.code), isCurrent }];
  });
}

/** @param {LanguageVersion} version */
function languageItem(version) {
  const link = node("a", { href: version.href, hreflang: version.code, lang: version.code }, [
    node("span", { class: "name" }, [version.name]),
    svgNode(
      "svg",
      { class: "check", "aria-hidden": "true", focusable: "false", viewBox: "0 0 24 24" },
      [svgNode("path", { d: "m5 12 5 5 9-10" })],
    ),
  ]);
  if (version.isCurrent) link.setAttribute("aria-current", "page");
  return node("li", {}, [link]);
}

/**
 * The link a list key moves focus to, from the focused link's index.
 * @param {string} key @param {number} index @param {number} count
 */
function nextLinkIndex(key, index, count) {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (key === "ArrowDown") return (index + 1) % count;
  return index <= 0 ? count - 1 : index - 1;
}

/**
 * Links to the current page in each language of the site, from the language settings delivery
 * writes into the page. A compact button opens the list, or the list shows as a labelled column.
 */
export class TemelLanguageSelector extends PageEssentialElement {
  static temelSlots = ["", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static nameSlot = "";
  static observedAttributes = ["layout"];

  constructor() {
    super();
    this.shadowRoot.addEventListener("keydown", this.handleSelectorKeydown.bind(this));
    this.shadowRoot.addEventListener("toggle", this.handleLanguagesToggle.bind(this), {
      capture: true,
    });
  }

  attributeChangedCallback() {
    if (!this.#languages) return;
    this.#syncLayout();
    this.syncSemanticRole();
  }

  onTemel() {
    super.onTemel();
    this.#syncLayout();
    if (this.isConnected) this.#renderLanguages();
  }

  /** The list is a navigation landmark when it shows as a column; the compact list is a popover. */
  get semanticRole() {
    return this.#isList ? "navigation" : null;
  }

  handleSlotChange() {
    super.handleSlotChange();
    this.#syncTriggerName();
  }

  /** @param {ToggleEvent} event */
  handleLanguagesToggle(event) {
    if (event.target !== this.#languages) return;
    this.#trigger.setAttribute("aria-expanded", String(event.newState === "open"));
  }

  /**
   * Arrow keys, Home, and End move between the open list's links. Escape closes only the list and
   * returns focus to its button, so a containing menu, such as the site header's, stays open.
   * @param {KeyboardEvent} event
   */
  handleSelectorKeydown(event) {
    const languages = this.#languages;
    if (!languages?.matches("[popover]:popover-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      languages.hidePopover();
      this.#trigger.focus();
      return;
    }
    if (!LINK_KEYS.includes(event.key)) return;
    const links = [...languages.querySelectorAll("a")];
    if (links.length === 0) return;
    event.preventDefault();
    const index = links.indexOf(/** @type {HTMLAnchorElement} */ (this.shadowRoot.activeElement));
    links[nextLinkIndex(event.key, index, links.length)].focus();
  }

  get #isList() {
    return this.getAttribute("layout") === "list";
  }

  /** @returns {HTMLElement | null} */
  get #languages() {
    return this.shadowRoot.querySelector(".languages");
  }

  /** @returns {HTMLButtonElement} */
  get #trigger() {
    return /** @type {HTMLButtonElement} */ (this.shadowRoot.querySelector(".trigger"));
  }

  /** A column shows every link; the compact layout keeps them in a popover the button opens. */
  #syncLayout() {
    const languages = /** @type {HTMLElement} */ (this.#languages);
    if (this.#isList) languages.removeAttribute("popover");
    else if (!languages.hasAttribute("popover")) languages.setAttribute("popover", "auto");
    this.#trigger.setAttribute("aria-expanded", "false");
  }

  #renderLanguages() {
    const versions = pageLanguageVersions(this);
    const current = versions.find((version) => version.isCurrent);
    this.toggleCustomState("empty", versions.length < 2);
    const code = /** @type {HTMLElement} */ (this.shadowRoot.querySelector(".code"));
    const currentName = /** @type {HTMLElement} */ (this.shadowRoot.querySelector(".current"));
    code.textContent = current?.code.toUpperCase() ?? "";
    currentName.textContent = current?.name ?? "";
    if (current !== undefined) currentName.setAttribute("lang", current.code);
    this.shadowRoot.querySelector(".list")?.replaceChildren(...versions.map(languageItem));
    this.#syncTriggerName();
  }

  /** The button reads its label and the current language's code, described by its name. */
  #syncTriggerName() {
    const trigger = this.#trigger;
    if (!trigger) return;
    trigger.ariaLabelledByElements = [
      ...this.assignedTo(""),
      /** @type {Element} */ (this.shadowRoot.querySelector(".code")),
    ];
    trigger.ariaDescribedByElements = [
      /** @type {Element} */ (this.shadowRoot.querySelector(".current")),
    ];
  }
}

customElements.define(
  "temel-language-selector",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelLanguageSelector)),
);
