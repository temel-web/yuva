import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

import "./temel-comparison-row.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host { display: grid; }
 .table { display: grid; gap: var(--space-6); min-inline-size: 0; }
 .caption {
   font: var(--weight-semibold) var(--text-xl)/var(--leading-snug) var(--font-display);
   letter-spacing: var(--tracking-tight);
 }
 .scroller {
   overflow-x: auto; border: var(--border-width) var(--border-style) var(--border-default);
   border-radius: var(--radius-lg); background: var(--surface-card);
 }
 .grid { display: grid; min-inline-size: min-content; }
 .head, .rows { display: grid; grid-column: 1 / -1; grid-template-columns: subgrid; }
 .actions.is-filled { margin-block-start: var(--space-10); }
`);

const layout = createLayoutTemplate(
  '<div class="introduction" part="introduction"><slot name="eyebrow" class="text-slot"></slot><slot name="heading" class="text-slot"></slot><slot name="summary" class="text-slot"></slot></div><div class="table"><slot name="caption" class="text-slot"></slot><div class="scroller"><div class="grid" role="table"><slot name="head"></slot><slot class="rows"></slot></div></div></div><slot name="actions"></slot><slot name="provenance"></slot>',
);

/** A band that compares values across named columns, such as plans or options. */
export class TemelComparisonTable extends PageEssentialElement {
  static temelSlots = [
    "eyebrow",
    "heading",
    "summary",
    "caption",
    "head",
    "",
    "actions",
    "provenance",
  ];
  static introductionSlots = Object.freeze(["eyebrow", "heading", "summary"]);
  static layout = layout;
  static pageEssentialsStyles = styles;
  #rowObserver = new MutationObserver(this.handleRowMutation.bind(this));

  connectedCallback() {
    super.connectedCallback();
    this.#rowObserver.observe(this, {
      attributeFilter: ["hidden", "slot"],
      childList: true,
      subtree: true,
    });
  }

  disconnectedCallback() {
    this.#rowObserver.disconnect();
    super.disconnectedCallback();
  }

  handleSlotChange() {
    super.handleSlotChange();
    this.#syncTable();
  }

  handleRowMutation() {
    this.#syncTable();
  }

  handleTextMutation() {
    super.handleTextMutation();
    this.#syncTable();
  }

  /** Name the table from its caption text, or its heading when the caption is empty. */
  #syncTable() {
    const table = this.shadowRoot.querySelector('[role="table"]');
    if (!table) return;
    const textOf = (name) =>
      this.assignedTo(name)
        .map((element) => element.textContent.trim())
        .join(" ");
    const name = textOf("caption") || textOf("heading");
    if (name) table.setAttribute("aria-label", name);
    else table.removeAttribute("aria-label");
    this.#syncColumns();
  }

  /** Size the shared grid to the widest resolved row: one label column plus its value columns. */
  #syncColumns() {
    const rows = [...this.assignedTo("head"), ...this.assignedTo("")];
    const columnCount = Math.max(
      1,
      ...rows.map(function valueCount(row) {
        const values = row.shadowRoot?.querySelector("slot.default");
        return (
          values
            ?.assignedElements({ flatten: true })
            .filter((element) => element.localName !== "template").length ?? 0
        );
      }),
    );
    this.shadowRoot.querySelector(".grid").style.gridTemplateColumns =
      `minmax(10rem, 1.4fr) repeat(${columnCount}, minmax(8rem, 1fr))`;
  }
}

customElements.define(
  "temel-comparison-table",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelComparisonTable)),
);
