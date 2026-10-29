import { node, layoutTemplate } from "./page-essentials/layout-template.js";
import { PageEssentialElement } from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host { border-block-end: var(--border-width) var(--border-style) var(--border-default); interpolate-size: allow-keywords; }
 summary {
   align-items: center; cursor: pointer; display: flex; gap: var(--space-8); justify-content: space-between;
   font: var(--weight-semibold) var(--text-xl)/var(--leading-snug) var(--font-ui); list-style: none; padding-block: var(--space-9);
   transition: color var(--dur-base) var(--ease-out);
 }
 summary::-webkit-details-marker { display: none; }
 summary::after {
   content: ""; flex: none; inline-size: var(--space-9); block-size: var(--space-9); background: var(--accent-text);
   mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 5v14M5 12h14' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat;
 }
 details[open] > summary::after {
   mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 12h14' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat;
 }
 summary:hover { color: var(--accent-text); }
 summary slot { flex: 1 1 auto; }
 details::details-content {
   block-size: 0; overflow: clip;
   transition: block-size var(--dur-slowest) var(--ease-out), content-visibility var(--dur-slowest) allow-discrete;
 }
 details[open]::details-content { block-size: auto; }
 @media (prefers-reduced-motion: reduce) { details::details-content { transition: none; } summary { transition: none; } }
 .answer { padding-block-end: var(--space-9); max-inline-size: 66ch; color: var(--text-secondary); }
`);

const layout = layoutTemplate(
  node("details", {}, [
    node("summary", {}, [node("slot", { name: "question", class: "text-slot" })]),
    node("slot", { name: "answer", class: "text-slot" }),
  ]),
  node("slot", { name: "provenance" }),
);

/** One question in an FAQ block: a native disclosure with the question and its answer. */
export class TemelFaqItem extends PageEssentialElement {
  static temelSlots = ["question", "answer", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static observedAttributes = ["open"];
  /** @type {boolean | null} Visitor state; null follows the authored `open` attribute. */
  #isOpen = null;

  constructor() {
    super();
    this.shadowRoot.addEventListener("toggle", this.handleDisclosureToggle.bind(this), true);
  }

  attributeChangedCallback() {
    this.#isOpen = null;
    this.#applyOpen();
  }

  onTemel() {
    super.onTemel();
    this.#applyOpen();
  }

  handleDisclosureToggle(event) {
    if (event.target === this.#details) this.#isOpen = this.#details.open;
  }

  /** Current visitor presentation; changing it does not rewrite the authored initial state. */
  get open() {
    return this.#details?.open ?? this.hasAttribute("open");
  }

  /** @param {boolean | null} isOpen null follows the authored `open` attribute again. */
  set open(isOpen) {
    this.#isOpen = isOpen === null ? null : Boolean(isOpen);
    this.#applyOpen();
  }

  get #details() {
    return this.shadowRoot.querySelector("details");
  }

  #applyOpen() {
    const details = this.#details;
    if (!details) return;
    details.open =
      this.#isOpen ?? (this.hasAttribute("open") && this.getAttribute("open") !== "false");
  }
}

customElements.define(
  "temel-faq-item",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelFaqItem)),
);
