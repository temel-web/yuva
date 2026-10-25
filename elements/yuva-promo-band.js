import { StoreElement, node } from "./shared/store-element.js";

/** A short campaign message that follows the active audience path. */
export class YuvaPromoBand extends StoreElement {
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
      :host { padding: var(--space-9) max(clamp(var(--space-7), 4%, var(--space-9)), calc((100% - 80rem) / 2)); background: var(--surface-selected); }
      section { display: grid; gap: var(--space-6); align-items: center; }
      ::slotted(*) { margin: 0; }
      ::slotted([slot^="heading"]) { font: var(--type-title); }
      ::slotted([slot^="action"]) { font: var(--type-ui-strong); }
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
