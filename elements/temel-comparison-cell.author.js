import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelComparisonCell } from "./temel-comparison-cell.js";

/**
 * Create one value.
 * @param {string} [value]
 * @param {string} [mark]
 */
export function createComparisonCell(value = "Included", mark = "included") {
  return createAuthorElement(
    "temel-comparison-cell",
    [createAuthorElement("span", [value])],
    mark === "none" ? {} : { mark },
  );
}

/** @type {typeof TemelComparisonCell & {temel: Record<string, any>}} */ (
  TemelComparisonCell
).temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return createComparisonCell();
  },
  getElementIcon() {
    return pageEssentialIcon("square");
  },
};

export { TemelComparisonCell };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 2,
    label: "Comparison Cell",
    description: "One value in a Comparison Row, optionally marked as included or excluded.",
    category: "pricing",
    allowBlank: true,
  },
  attributes: {
    mark: {
      type: "enum",
      presence: "optional",
      label: "Mark",
      description:
        "Show a check or a dash before the value. Keep words in the value so every reader gets the meaning.",
      options: ["none", "included", "excluded"],
      default: "none",
    },
  },
  slots: {
    order: ["default"],
    configs: {
      default: {
        kind: "text",
        label: "Value",
        description: "The value for this column.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 200,
        inlineEditable: true,
      },
    },
  },
});
