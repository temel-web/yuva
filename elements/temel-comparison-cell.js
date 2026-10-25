import { PageEssentialElement } from "./page-essentials/page-essential-element.js";

const CHECK_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='m5 12.5 4.5 4.5L19 7.5' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";
const DASH_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 12h12' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E\")";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host {
   container-type: normal; display: flex; align-items: center; gap: var(--space-4);
   padding: var(--space-6) var(--space-7); font: inherit;
 }
 :host::before { content: ""; display: none; flex: none; inline-size: var(--size-icon); block-size: var(--size-icon); }
 :host([mark="included"])::before { display: block; background: var(--accent-text); mask: ${CHECK_MASK} center / contain no-repeat; }
 :host([mark="excluded"])::before { display: block; background: var(--text-muted); mask: ${DASH_MASK} center / contain no-repeat; }
 :host([mark="excluded"]) { color: var(--text-secondary); }
 .default { min-inline-size: var(--space-2); }
`);

/** One value in a Comparison Row, optionally marked as included or excluded. */
export class TemelComparisonCell extends PageEssentialElement {
  static pageEssentialsStyles = styles;

  /** Cells in the table's head row name their columns. */
  get semanticRole() {
    const row = this.parentElement;
    return row?.localName === "temel-comparison-row" &&
      /** @type {import("./temel-comparison-row.js").TemelComparisonRow} */ (row).isHeaderRow
      ? "columnheader"
      : "cell";
  }
}

customElements.define(
  "temel-comparison-cell",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelComparisonCell)),
);
