import {
  createAuthorElement,
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelComparisonTable } from "./temel-comparison-table.js";

import { createComparisonRow } from "./temel-comparison-row.author.js";

/** Create a three-column comparison with a head row and two rows. */
export function createComparisonTable() {
  const head = createComparisonRow("Plan", [
    ["Starter", "none"],
    ["Studio", "none"],
    ["Organization", "none"],
  ]);
  head.slot = "head";
  const element = document.createElement("temel-comparison-table");
  element.append(
    ...createIntroduction({
      eyebrow: "Compare",
      heading: "Find the plan that fits.",
      summary: ["Every plan includes the essentials; the differences are below."],
    }),
    createAuthorElement("h3", ["What each plan includes"], { slot: "caption" }),
    head,
    createComparisonRow(),
    createComparisonRow("Single sign-on", [
      ["Not included", "excluded"],
      ["Not included", "excluded"],
      ["Included", "included"],
    ]),
  );
  return element;
}

/** @type {typeof TemelComparisonTable & {temel: Record<string, any>}} */ (
  TemelComparisonTable
).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createComparisonTable,
  getElementIcon() {
    return pageEssentialIcon("table");
  },
};

export { TemelComparisonTable };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 2,
    label: "Comparison Table",
    description: "A band that compares values across named columns, such as plans or options.",
    category: "pricing",
    allowBlank: true,
  },
  attributes: {
    padding: {
      type: "enum",
      presence: "optional",
      label: "Padding",
      description:
        "Space around the band's content. A block placed directly in the page header, main content, or footer is spacious unless you choose otherwise.",
      options: ["none", "compact", "comfortable", "spacious"],
    },
    width: {
      type: "enum",
      presence: "optional",
      label: "Content width",
      description:
        "Let content use the whole band, or center it in a wide or reading-width column while the background stays full width.",
      options: ["full", "wide", "reading"],
      default: "full",
    },
    background: {
      type: "enum",
      presence: "optional",
      label: "Background",
      description: "Keep the page background, tint the band, or add a soft brand-colored glow.",
      options: ["none", "muted", "accent", "glow"],
      default: "none",
    },
    surface: {
      type: "enum",
      presence: "optional",
      label: "Surface",
      description:
        "Keep the band edge to edge, or present it as an inset card that is filled, outlined, raised, or accent-tinted.",
      options: ["plain", "muted", "outlined", "raised", "accent"],
      default: "plain",
    },
  },
  slots: {
    order: ["eyebrow", "heading", "summary", "caption", "head", "default", "actions"],
    configs: {
      eyebrow: {
        kind: "text",
        label: "Eyebrow",
        description: "Short context above the heading.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 200,
        inlineEditable: true,
      },
      heading: {
        kind: "text",
        label: "Heading",
        description: "The band's heading, usually an h2.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 300,
        inlineEditable: true,
      },
      summary: {
        kind: "text",
        label: "Summary",
        description: "Supporting paragraphs below the heading.",
        format: "rte-document-v1",
        minCharacters: 0,
        maxCharacters: null,
        inlineEditable: true,
      },
      caption: {
        kind: "text",
        label: "Caption",
        description: "The table's visible name; the heading names it when this is empty.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 200,
        inlineEditable: true,
      },
      head: {
        kind: "element",
        label: "Column names",
        description: "One row whose values name the compared columns.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-comparison-row"],
      },
      default: {
        kind: "element",
        label: "Rows",
        description: "The compared rows, in reading order.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["temel-comparison-row"],
      },
      actions: {
        kind: "element",
        label: "Actions",
        description: "Links or commands that follow the content.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-action-group"],
      },
    },
  },
});
