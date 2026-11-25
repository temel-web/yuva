import { StoreElement, node } from "./shared/store-element.js";

/** A short campaign message that follows the active audience path. */
export class YuvaPromoBand extends StoreElement {
  static preferenceTopics = Object.freeze([]);
  static temelSlots = ["heading", "summary", "action", "provenance"];
  constructor() {
    super();
    this.shadowRoot.append(
      node("section", {}, [
        this.temelSlot("heading"),
        this.temelSlot("summary"),
        this.temelSlot("action"),
      ]),
      this.temelSlot("provenance"),
    );
    this.addStyles(`
      :host { color-scheme: dark; padding: var(--space-11) max(clamp(var(--space-7), 4%, var(--space-11)), calc((100% - 80rem) / 2)); background: var(--surface-panel); color: var(--text-primary); }
      section { display: grid; gap: var(--space-7) var(--space-10); align-items: center; }
      ::slotted(*) { margin: 0; }
      ::slotted([slot^="heading"]) { font: var(--weight-regular) clamp(var(--text-3xl), 3.6cqi, var(--text-4xl))/1.05 var(--font-display); letter-spacing: -0.01em; text-wrap: balance; }
      ::slotted([slot^="summary"]) { color: var(--text-secondary); }
      ::slotted(a[slot^="action"]) { display: inline-flex; align-items: center; justify-self: start; min-block-size: var(--h-control-lg); padding: var(--space-4) var(--space-8); background: var(--accent); color: var(--text-on-accent); font: var(--type-ui-strong); text-decoration: none; }
      ::slotted(a[slot^="action"]:hover) { background: var(--accent-hover); }
      :host([visibility="returning"]:not(:state(returning))) { display: none; }
      @container (min-width: 48rem) { section { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) auto; } }
    `);
  }
  onTemel(activePath) {
    this.setState(
      "returning",
      activePath?.startsWith("returning-users") === true,
    );
  }
}
customElements.define("yuva-promo-band", YuvaPromoBand);
