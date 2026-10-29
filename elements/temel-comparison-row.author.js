import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelComparisonRow } from "./temel-comparison-row.js";

import { createComparisonCell } from "./temel-comparison-cell.author.js";

/**
 * Create one row: its label and one value per column.
 * @param {string} [label]
 * @param {[string, string][]} [values] Value text and mark for each column.
 */
export function createComparisonRow(
  label = "Hosting and backups",
  values = [
    ["Included", "included"],
    ["Included", "included"],
    ["Included", "included"],
  ],
) {
  return createAuthorElement("temel-comparison-row", [
    createAuthorElement("span", [label], { slot: "label" }),
    ...values.map(([value, mark]) => createComparisonCell(value, mark)),
  ]);
}

/** @type {typeof TemelComparisonRow & {temel: Record<string, any>}} */ (TemelComparisonRow).temel =
  {
    getSchema() {
      return authorSchema;
    },
    create() {
      return createComparisonRow();
    },
    getElementIcon() {
      return pageEssentialIcon("list");
    },
  };

export { TemelComparisonRow };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 2,
    label: "Comparison Row",
    description:
      "One labelled row of values in a Comparison Table; in the table's head it names the columns.",
    category: "pricing",
    allowBlank: true,
  },
  attributes: {},
  slots: {
    order: ["label", "default"],
    configs: {
      label: {
        kind: "text",
        label: "Label",
        description: "What this row compares, or the corner label in the head row.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 200,
        inlineEditable: true,
      },
      default: {
        kind: "element",
        label: "Values",
        description: "One value per column, in column order.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["temel-comparison-cell"],
      },
    },
  },
});
