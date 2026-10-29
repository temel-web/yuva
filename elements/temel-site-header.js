import { node, layoutTemplate, svgNode } from "./page-essentials/layout-template.js";
import {
  buttonSizeVariables,
  buttonVariantVariables,
} from "./page-essentials/button-foundation.js";
import { PageEssentialElement } from "./page-essentials/page-essential-element.js";

// Register the identity and navigation before the masthead can enter layout. Otherwise
// a late navigation upgrade expands the header after the main content has painted.
import "./temel-site-brand.js";
import "./temel-site-nav.js";

/** Collapsible navigation uses the menu at every width; responsive navigation only when narrow. */
const MENU_MODE_HOST =
  ':host(:is([navigation-mode="collapsible"], [navigation-mode="responsive"]))';

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host { border-block-end: var(--border-width) var(--border-style) var(--border-default); }
 .layout { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-7) var(--space-9); }
 /* Keep the styled outer slots boxed when their audience content inherits defaults. */
 :host .layout slot:is(.brand, .navigation, .actions, .preferences, .utilities, .menu-label) { display: block; }
 .brand { flex: 0 1 auto; min-inline-size: var(--space-8); margin-inline-end: auto; }
 .navigation-group { flex: 0 1 auto; min-inline-size: var(--space-8); }
 .actions, .preferences, .utilities { flex: 0 1 auto; min-inline-size: var(--space-2); }
 .tools { display: flex; align-items: center; gap: var(--space-4); }
 .panel { min-inline-size: 0; }
 .preferences { min-block-size: var(--space-2); }
 :host .layout slot.preferences { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-4); }
 .preferences::slotted(*) { flex: none; }
 .panel-content > .preferences {
   margin-block-start: var(--space-7); padding-block-start: var(--space-7);
   border-block-start: var(--border-width) solid var(--border-default);
 }
 .menu-label {
   position: absolute; inline-size: var(--space-1); block-size: var(--space-1);
   min-block-size: var(--space-1); overflow: hidden; clip-path: inset(50%);
 }
 .toggle {
   ${buttonSizeVariables("s")} ${buttonVariantVariables("quiet")}
   display: none; position: relative; align-items: center; justify-content: center; appearance: none;
   border: var(--border-width) var(--border-style) var(--button-border-color);
   border-radius: var(--radius-sm); background: var(--button-background); color: var(--button-color);
   cursor: pointer; font: var(--button-font); margin: 0; padding: var(--button-padding-block);
   min-block-size: var(--space-11); min-inline-size: var(--space-11); transition: var(--transition-control);
 }
 .toggle:hover { background: var(--button-background-hover); }
 .toggle:active { background: var(--button-background-active); }
 .toggle svg {
   flex: none; inline-size: 1lh; block-size: 1lh; fill: none; stroke: currentColor;
   stroke-linecap: round; stroke-width: 2;
 }
 .toggle[aria-expanded="false"] .close, .toggle[aria-expanded="true"] .open { display: none; }
 :host(:state(menu)) { position: relative; z-index: var(--z-menu); background: var(--background-color); }
 :host([navigation-mode="responsive"]) .brand::slotted(temel-site-brand) {
   font: var(--weight-semibold) var(--text-xl)/var(--leading-tight) var(--font-display);
 }
 ${MENU_MODE_HOST} .navigation-group { display: contents; }
 ${MENU_MODE_HOST} .layout {
   display: grid; grid-template-columns: minmax(var(--space-11), 1fr) minmax(0, auto) minmax(var(--space-11), 1fr);
   gap: var(--space-7);
 }
 ${MENU_MODE_HOST} .brand {
   grid-column: 2; grid-row: 1; justify-self: center; margin-inline-end: 0;
   min-inline-size: 0; max-inline-size: 100%;
 }
 ${MENU_MODE_HOST} .tools {
   grid-column: 3; grid-row: 1; justify-self: end; justify-content: end;
   min-inline-size: 0; max-inline-size: 100%; flex-wrap: wrap;
 }
 ${MENU_MODE_HOST} .toggle { display: inline-flex; grid-column: 1; grid-row: 1; justify-self: start; gap: var(--space-5); padding-inline: var(--space-4); }
 ${MENU_MODE_HOST} .toggle .menu-label {
   position: static; inline-size: auto; block-size: auto; overflow: visible; clip-path: none;
   max-inline-size: 12ch; overflow-wrap: anywhere;
 }
 ${MENU_MODE_HOST} .panel {
   position: absolute; inset-block-start: 100%; inset-inline: 0;
   padding: var(--space-9) max(var(--space-7), calc((100% - 80rem) / 2));
   max-block-size: calc(100dvh - var(--space-14));
   background: color-mix(in srgb, var(--surface-panel) 40%, var(--background-color));
   box-shadow: var(--shadow-menu);
 }
 ${MENU_MODE_HOST} .panel-content {
   max-block-size: calc(100dvh - var(--space-14) - var(--space-9) * 2);
   overflow: auto; overscroll-behavior: contain;
 }
 @media (prefers-reduced-motion: no-preference) {
   :host(:state(menu)) .panel:not([hidden]) { animation: open-index var(--dur-slow) var(--ease-out); }
 }
 @keyframes open-index { from { opacity: 0; translate: 0 calc(-1 * var(--space-4)); } to { opacity: 1; translate: 0 0; } }
 @container (max-width: 40rem) {
   .layout { gap: var(--space-4); }
   .toggle { gap: var(--space-3); }
   .toggle svg { inline-size: var(--space-7); block-size: var(--space-7); }
   ${MENU_MODE_HOST} .layout { gap: var(--space-4); }
   ${MENU_MODE_HOST} .toggle { padding-inline: var(--space-3); }
   ${MENU_MODE_HOST} .toggle .menu-label { position: absolute; inline-size: var(--space-1); block-size: var(--space-1); overflow: hidden; clip-path: inset(50%); }
 }
 @container (min-width: 40rem) {
   :host([navigation-mode="responsive"]) .layout {
     grid-template-columns: auto minmax(0, 1fr); gap: var(--space-3) var(--space-8);
   }
   :host([navigation-mode="responsive"]) .brand { grid-column: 1; justify-self: start; }
   :host([navigation-mode="responsive"]) .tools {
     grid-column: 2; flex-wrap: nowrap; gap: var(--space-7);
   }
   :host([navigation-mode="responsive"]) .navigation-group {
     display: block; grid-column: 1 / -1; grid-row: 2;
     border-block-start: var(--border-width) solid var(--border-subtle);
     padding-block-start: var(--space-3);
   }
   :host([navigation-mode="responsive"]) .toggle { display: none; }
   :host([navigation-mode="responsive"]) .panel {
     position: static; padding: 0; max-block-size: none;
     background: transparent; box-shadow: none;
   }
   :host([navigation-mode="responsive"]) .panel-content {
     max-block-size: none; overflow: visible;
   }
   :host([navigation-mode="responsive"]) .tools > .preferences { flex-wrap: nowrap; }
 }
 @container (min-width: 68rem) {
   :host([navigation-mode="responsive"]) .layout {
     grid-template-columns: auto minmax(0, 1fr) auto; gap: var(--space-8);
   }
   :host([navigation-mode="responsive"]) .navigation-group {
     grid-column: 2; grid-row: 1; border-block-start: 0; padding-block-start: 0;
   }
   :host([navigation-mode="responsive"]) .tools { grid-column: 3; }
 }
`);

const layout = layoutTemplate(
  node("div", { class: "layout" }, [
    node("slot", { name: "brand" }),
    node("div", { class: "navigation-group" }, [
      node(
        "button",
        {
          class: "toggle",
          type: "button",
          "aria-controls": "navigation-panel",
          "aria-expanded": "false",
        },
        [
          svgNode("svg", { "aria-hidden": "true", focusable: "false", viewBox: "0 0 24 24" }, [
            svgNode("path", { class: "open", d: "M4 7h16M4 12h16M4 17h16" }),
            svgNode("path", { class: "close", d: "M6 6l12 12M18 6 6 18" }),
          ]),
        ],
      ),
      node("slot", { name: "menu-label", class: "text-slot" }),
      node("div", { class: "panel", id: "navigation-panel" }, [
        node("div", { class: "panel-content" }, [node("slot", { name: "navigation" })]),
      ]),
    ]),
    node("div", { class: "tools" }, [
      node("slot", { name: "actions" }),
      node("slot", { name: "utilities" }),
    ]),
    node("slot", { name: "preferences" }),
    node("slot", { name: "provenance" }),
  ]),
);

/** A responsive masthead for the site's identity, navigation, actions, and theme switch. */
export class TemelSiteHeader extends PageEssentialElement {
  static temelSlots = [
    "brand",
    "navigation",
    "actions",
    "preferences",
    "utilities",
    "menu-label",
    "provenance",
  ];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static observedAttributes = ["navigation-mode"];
  #isOpen = false;
  #canDismissMenu = false;
  #resizeObserver = new ResizeObserver(this.handleLayoutResize.bind(this));
  #menuListeners;

  constructor() {
    super();
    this.shadowRoot.addEventListener("click", this.handleHeaderClick.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.#resizeObserver.observe(this);
    this.#menuListeners = new AbortController();
    const options = { signal: this.#menuListeners.signal };
    document.addEventListener("pointerdown", this.handleOutsidePointerdown.bind(this), options);
    document.addEventListener("keydown", this.handleHeaderKeydown.bind(this), options);
  }

  disconnectedCallback() {
    this.#resizeObserver.disconnect();
    this.#menuListeners.abort();
    this.#isOpen = false;
    this.#canDismissMenu = false;
    super.disconnectedCallback();
  }

  attributeChangedCallback() {
    if (this.#toggle) this.handleLayoutResize();
  }

  onTemel() {
    super.onTemel();
    this.handleLayoutResize();
  }

  /** Draw the menu without moving focus, changing authored content, or enabling dismissal. */
  get open() {
    return this.#isOpen;
  }

  /** @param {boolean} isOpen */
  set open(isOpen) {
    this.#canDismissMenu = false;
    this.#isOpen = isOpen;
    this.handleLayoutResize();
  }

  /**
   * Keep the keyboard order aligned with the compact menu, two-row navigation, or single row.
   * @param {ResizeObserverEntry[]} [entries]
   */
  handleLayoutResize(entries = []) {
    const toggle = this.#toggle;
    if (!toggle) return;
    const focusedElement = entries.length > 0 ? this.#focusedNavigationElement : null;
    const hasMenu = this.#hasMenu;
    this.#isOpen = hasMenu && this.#isOpen;
    if (!this.#isOpen) this.#canDismissMenu = false;
    this.#positionNavigation();
    this.#positionPreferences();
    this.shadowRoot.querySelector(".panel").hidden = hasMenu && !this.#isOpen;
    this.toggleCustomState("menu", hasMenu);
    toggle.setAttribute("aria-expanded", String(this.#isOpen));
    if (focusedElement !== null) {
      const target = hasMenu && !this.#isOpen ? toggle : focusedElement;
      target.focus({ preventScroll: true });
    }
  }

  #positionNavigation() {
    const toggle = this.#toggle;
    const group = this.#navigationGroup;
    const label = this.layoutSlot("menu-label");
    const hasMenu = this.#hasMenu;
    const labelOwner = hasMenu ? toggle : group;
    if (label.parentElement !== labelOwner) labelOwner.append(label);
    label.setAttribute("aria-hidden", String(!hasMenu));
    const layout = this.shadowRoot.querySelector(".layout");
    let next = this.shadowRoot.querySelector(".tools");
    if (hasMenu) next = this.layoutSlot("brand");
    else if (getComputedStyle(group).gridRowStart === "2") next = null;
    if (group.nextElementSibling !== next) layout.insertBefore(group, next);
  }

  #positionPreferences() {
    const hasMenu = this.#hasMenu;
    const tools = this.shadowRoot.querySelector(".tools");
    const preferences = this.layoutSlot("preferences");
    const panelContent = this.shadowRoot.querySelector(".panel-content");
    const preferencesOwner = hasMenu ? panelContent : tools;
    if (preferences.parentElement === preferencesOwner) return;
    if (hasMenu) panelContent.append(preferences);
    else tools.insertBefore(preferences, this.layoutSlot("actions"));
  }

  handleHeaderClick(event) {
    const path = event.composedPath();
    if (path.includes(this.#toggle)) {
      this.open = !this.open;
      this.#canDismissMenu = this.open;
      return;
    }
    const isNavigationLink =
      path.includes(this.shadowRoot.querySelector(".panel")) &&
      path.some((node) => node instanceof HTMLAnchorElement);
    if (!isNavigationLink || !this.#canDismissMenu) return;
    const shouldReturnFocus = this.#hasMenu;
    this.open = false;
    if (shouldReturnFocus) this.#toggle.focus();
  }

  handleHeaderKeydown(event) {
    if (event.key !== "Escape" || !this.#canDismissMenu) return;
    event.preventDefault();
    this.open = false;
    this.#toggle.focus();
  }

  handleOutsidePointerdown(event) {
    if (!this.#canDismissMenu || event.composedPath().includes(this)) return;
    this.open = false;
  }

  /** @returns {HTMLButtonElement | null} */
  get #toggle() {
    return this.shadowRoot.querySelector(".toggle");
  }

  get #navigationGroup() {
    return this.shadowRoot.querySelector(".navigation-group");
  }

  /** Preserve the native control's focus when its navigation or preference Slot moves. */
  get #focusedNavigationElement() {
    const activeHost = this.ownerDocument.activeElement;
    const controls = ["navigation", "preferences"].flatMap((name) => this.assignedTo(name));
    if (!controls.some((element) => element.contains(activeHost))) return null;
    let activeElement = activeHost;
    while (activeElement.shadowRoot?.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }
    return /** @type {HTMLElement} */ (activeElement);
  }

  /** CSS chooses the menu only when the header cannot show its navigation inline. */
  get #hasMenu() {
    return getComputedStyle(this.#toggle).display !== "none";
  }
}

customElements.define(
  "temel-site-header",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelSiteHeader)),
);
