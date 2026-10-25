import { PageCollectionElement } from "./page-essentials/page-collection-element.js";

import "./temel-step.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .items { gap: var(--space-10); }
 @container (min-width: 38rem) {
   :host(:not([layout="horizontal"])) .items { grid-template-columns: minmax(0, 1fr); }
 }
 @container (min-width: 60rem) {
   :host(:not([layout="horizontal"])) .items { grid-template-columns: minmax(0, 1fr); }
 }
 @container (min-width: 48rem) {
   :host([layout="horizontal"]) .items { grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); }
 }
`);

/** An ordered process whose Steps number themselves from their current order. */
export class TemelSteps extends PageCollectionElement {
  static pageEssentialsStyles = styles;

  handleSlotChange() {
    super.handleSlotChange();
    this.#numberSteps();
  }

  /** Number visible Steps from their resolved Slot order. */
  #numberSteps() {
    let position = 0;
    for (const element of this.assignedTo("")) {
      if (element.localName !== "temel-step") continue;
      customElements.upgrade(element);
      /** @type {import("./temel-step.js").TemelStep} */ (element).position = element.hidden
        ? null
        : ++position;
    }
  }
}

customElements.define(
  "temel-steps",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelSteps)),
);
