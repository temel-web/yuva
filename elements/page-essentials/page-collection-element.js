import { createLayoutTemplate, PageEssentialElement } from "./page-essential-element.js";

/** Column grid shared by collection blocks; three columns unless the author chooses otherwise. */
const collectionStyles = new CSSStyleSheet();
collectionStyles.replaceSync(`
  :host { display: grid; }
  .items { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-9); }
  .actions.is-filled { margin-block-start: var(--space-10); }
  @container (min-width: 38rem) {
    :host(:not([columns="1"])) .items {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @container (min-width: 60rem) {
    :host(:not([columns="1"], [columns="2"], [columns="4"])) .items {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    :host([columns="4"]) .items { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
`);

const layout = createLayoutTemplate(
  '<div class="introduction" part="introduction"><slot name="eyebrow" class="text-slot"></slot><slot name="heading" class="text-slot"></slot><slot name="summary" class="text-slot"></slot></div><div class="list" role="list"><slot class="items"></slot></div><slot name="actions"></slot><slot name="provenance"></slot>',
);

/**
 * A block that introduces itself and presents its items as one list named by its heading.
 * Items declare this block's tag as their `collectionTag`.
 */
export class PageCollectionElement extends PageEssentialElement {
  static temelSlots = ["eyebrow", "heading", "summary", "", "actions", "provenance"];
  static introductionSlots = Object.freeze(["eyebrow", "heading", "summary"]);
  static layout = layout;
  static sharedStyles = Object.freeze([collectionStyles]);

  handleSlotChange() {
    super.handleSlotChange();
    const list = this.shadowRoot.querySelector(".list");
    if (list) list.ariaLabelledByElements = this.assignedTo("heading");
  }
}
