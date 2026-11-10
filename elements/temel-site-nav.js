import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host { container-type: normal; }
 nav { display: grid; gap: var(--space-5); }
 .label { font: var(--type-caption); color: var(--text-secondary); }
 :host([label-display="hidden"]) .label {
   position: absolute; inline-size: var(--space-1); block-size: var(--space-1);
   min-block-size: var(--space-1); overflow: hidden; clip-path: inset(50%);
 }
 .default { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-7) var(--space-9); }
 :host([direction="vertical"]) .default { flex-direction: column; align-items: start; gap: var(--space-5); }
 .default::slotted(a) {
   font: var(--type-ui-strong); text-decoration: none; min-block-size: var(--h-control);
   display: inline-flex; align-items: center; color: var(--text-primary);
   background: linear-gradient(currentColor, currentColor) no-repeat 0 calc(100% - var(--space-2)) / 0 var(--border-width-thick);
   transition: background-size var(--dur-slow) var(--ease-out), color var(--dur-base) var(--ease-out);
 }
 .default::slotted(a:hover), .default::slotted(a[aria-current="page"]) {
   background-size: 100% var(--border-width-thick);
 }
 .default::slotted(a[aria-current="page"]) { color: var(--accent-text); }
`);

const layout = createLayoutTemplate(
  '<nav><slot name="label" class="text-slot"></slot><slot part="links"></slot></nav><slot name="provenance"></slot>',
);

/** A navigation landmark named by its visible or visually hidden label, with native links. */
export class TemelSiteNav extends PageEssentialElement {
  static temelSlots = ["label", "", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;

  handleSlotChange() {
    super.handleSlotChange();
    this.#syncName();
  }

  handleTextMutation() {
    super.handleTextMutation();
    this.#syncName();
  }

  /** Name the landmark from the authored label text; references cannot cross the shadow root. */
  #syncName() {
    const navigation = this.shadowRoot.querySelector("nav");
    if (!navigation) return;
    const name = this.assignedTo("label")
      .map((label) => label.textContent)
      .join(" ")
      .trim();
    if (name) navigation.setAttribute("aria-label", name);
    else navigation.removeAttribute("aria-label");
  }
}

customElements.define(
  "temel-site-nav",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelSiteNav)),
);
