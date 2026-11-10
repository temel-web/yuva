import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host(:state(dismissed)) { display: none; }
 :host([spacing-before="none"]) { margin-block-start: var(--space-0); }
 :host([spacing-before="compact"]) { margin-block-start: var(--space-7); }
 :host([spacing-before="comfortable"]) { margin-block-start: var(--space-8); }
 :host([spacing-before="spacious"]) { margin-block-start: var(--space-10); }
 .bar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-4) var(--space-7); }
 :host([alignment="center"]) .bar { justify-content: center; text-align: center; }
 .text { flex: 1 1 20rem; font: var(--weight-medium) var(--text-md)/var(--leading-body) var(--font-ui); }
 :host([alignment="center"]) .text { flex: 0 1 auto; }
 button {
   appearance: none; display: inline-flex; align-items: center; gap: var(--space-3); flex: none;
   background: transparent; border: var(--border-width) var(--border-style) currentColor;
   border-radius: var(--radius-pill); color: inherit; cursor: pointer;
   font: var(--weight-semibold) var(--text-sm)/var(--leading-ui) var(--font-ui);
   min-block-size: var(--h-control); padding: var(--space-2) var(--space-5);
   transition: var(--transition-control);
 }
 button:hover { background: color-mix(in srgb, currentColor 14%, transparent); }
 button:focus-visible { outline-color: currentColor; }
 .dismiss-label { min-inline-size: var(--space-2); }
 .close {
   inline-size: var(--size-icon-sm); block-size: var(--size-icon-sm); background: currentColor;
   mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 6l12 12M18 6 6 18' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat;
 }
 @media (forced-colors: active) { button { border-color: ButtonText; } }
`);

const layout = createLayoutTemplate(
  '<div class="bar"><slot name="text" class="text-slot"></slot><button type="button"><slot name="dismiss-label" class="text-slot"></slot><span class="close" aria-hidden="true"></span></button></div><slot name="provenance"></slot>',
);

/** A short site-wide notice band that visitors can dismiss for the current page view. */
export class TemelAnnouncement extends PageEssentialElement {
  static temelSlots = ["text", "dismiss-label", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;

  constructor() {
    super();
    this.shadowRoot.addEventListener("click", this.handleDismissClick.bind(this));
  }

  /** Hide the notice for this page view without changing the authored document. */
  handleDismissClick(event) {
    if (!event.composedPath().includes(this.shadowRoot.querySelector("button"))) return;
    this.toggleCustomState("dismissed", true);
  }
}

customElements.define(
  "temel-announcement",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelAnnouncement)),
);
