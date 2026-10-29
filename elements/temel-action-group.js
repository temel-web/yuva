import { PageEssentialElement } from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 /* Actions contribute their intrinsic width to surrounding grid and flex layouts. */
 :host { container-type: normal; }
 .default { display: flex; flex-wrap: wrap; gap: var(--space-4); align-items: center; }
 :host([alignment="center"]) .default { justify-content: center; }
 :host([alignment="end"]) .default { justify-content: end; }
 .default::slotted(:is(a, button)) {
   align-items: center; display: inline-flex; justify-content: center;
   font: var(--button-font); min-block-size: var(--button-min-block-size);
   padding: var(--space-6) var(--space-7); min-block-size: var(--space-11);
   color: var(--button-color); background: var(--button-background);
   border: var(--border-width) var(--border-style) var(--button-border-color);
   border-radius: 0; text-decoration: none; cursor: pointer;
   transition: var(--transition-control);
 }
 :host([shape="pill"]) .default::slotted(:is(a, button)) { border-radius: var(--radius-pill); }
 .default::slotted(:is(a, button:not(:disabled)):hover) {
   background: var(--button-background-hover); border-color: var(--button-border-color-hover);
 }
 .default::slotted(:is(a, button:not(:disabled)):active) {
   background: var(--button-background-active); border-color: var(--button-border-color-active);
 }
 :host([emphasis="primary-first"]) .default::slotted(:is(a, button):first-child) {
   background: var(--accent); border-color: var(--accent); color: var(--text-on-accent);
 }
 :host([emphasis="primary-first"]) .default::slotted(:is(a, button):first-child:hover) {
   background: var(--accent-hover); border-color: var(--accent-hover);
 }
 :host([emphasis="primary-first"]) .default::slotted(:is(a, button):first-child:active) {
   background: var(--accent-press); border-color: var(--accent-press);
 }
 :host([emphasis="primary-first"]) .default::slotted(a:not(:first-child)) { background: transparent; border-color: transparent; color: var(--text-primary); padding-inline: var(--space-4); text-decoration: underline; text-underline-offset: var(--space-2); }
 .default::slotted(button:disabled) { opacity: .48; cursor: not-allowed; }
 :host([indicator="arrow"]) .default::slotted(a)::after {
   content: ""; display: block; flex: 0 0 auto; inline-size: var(--size-icon); block-size: var(--size-icon);
   margin-inline-start: var(--space-5); background: currentColor;
   transition: transform var(--dur-slow) var(--ease-out);
   mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 17 17 7M7 7h10v10' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat;
 }
 @media (prefers-reduced-motion: no-preference) {
   :host([indicator="arrow"]) .default::slotted(a:hover)::after {
     transform: translate(var(--space-1), calc(-1 * var(--space-1)));
   }
 }
 @media (forced-colors: active) { .default::slotted(:is(a, button)) { border-color: ButtonText; } }
`);

/** A wrapping group of native links and commands with a shared button treatment. */
export class TemelActionGroup extends PageEssentialElement {
  static pageEssentialsStyles = styles;
}

customElements.define(
  "temel-action-group",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelActionGroup)),
);
