import { StoreElement, node } from "./shared/store-element.js";
import {
  buttonSizeVariables,
  buttonVariantVariables,
} from "./page-essentials/button-foundation.js";

/**
 * Shows more results of the query that contains it. The query loads the next batch when the button
 * is activated, marks this element `loading` meanwhile and `error` after a failed load, and hides it
 * when no results remain.
 */
export class YuvaShowMore extends StoreElement {
  static temelSlots = ["", "error", "provenance"];

  constructor() {
    super();
    this.shadowRoot.append(
      node("button", { type: "button" }, [this.temelSlot("")]),
      node("p", { class: "error status" }, [this.temelSlot("error")]),
      this.temelSlot("provenance"),
    );
    this.addStyles(`
      :host { display: grid; justify-items: center; gap: var(--space-3); padding-block-start: var(--space-6); }
      :host([hidden]) { display: none; }
      button { ${buttonSizeVariables("l")} ${buttonVariantVariables("outline")} }
      :host(.loading) button { cursor: progress; opacity: 0.6; }
      .error { margin: 0; color: var(--text-muted); }
      :host(:not(.error)) .error { display: none; }
    `);
  }
}
customElements.define("yuva-show-more", YuvaShowMore);
