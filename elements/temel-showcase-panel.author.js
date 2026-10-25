import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelShowcasePanel } from "./temel-showcase-panel.js";

import { createFeature } from "./temel-feature.author.js";

/**
 * Create one complete tab: its button label and a Feature to show.
 * @param {string} [label]
 */
export function createShowcasePanel(label = "Overview") {
  return createAuthorElement("temel-showcase-panel", [
    createAuthorElement("button", [label], { type: "button", slot: "label" }),
    createFeature(),
  ]);
}

/** @type {typeof TemelShowcasePanel & {temel: Record<string, any>}} */ (
  TemelShowcasePanel
).temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return createShowcasePanel();
  },
  getElementIcon() {
    return pageEssentialIcon("panel-top");
  },
};

export { TemelShowcasePanel };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 5,
    label: "Tab Panel",
    description:
      "One tab of a Tabbed Showcase: its button label and the blocks it shows.",
    category: "interaction",
    allowBlank: true,
  },
  attributes: {},
  slots: {
    order: ["label", "default"],
    configs: {
      label: {
        kind: "text",
        label: "Label",
        description: "The tab's native button label.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 100,
        inlineEditable: true,
      },
      default: {
        editor: { interaction: "select" },
        kind: "element",
        label: "Content",
        description:
          "The feature, cards, figure, or text shown while this tab is selected.",
        minItems: 0,
        maxItems: null,
        allowedTags: [
          "temel-cards",
          "temel-feature",
          "temel-figure",
          "temel-text-section",
        ],
      },
    },
  },
});
