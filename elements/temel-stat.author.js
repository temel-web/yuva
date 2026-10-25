import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelStat } from "./temel-stat.js";

/**
 * Create one statistic.
 * @param {{value: string, label: string, summary: string}} [copy]
 */
export function createStat(
  copy = {
    value: "12",
    label: "Years in the neighborhood",
    summary: "Replace the number with a fact you can stand behind.",
  },
) {
  return createAuthorElement("temel-stat", [
    createAuthorElement("strong", [copy.value], { slot: "value" }),
    createAuthorElement("span", [copy.label], { slot: "label" }),
    createAuthorElement("p", [copy.summary], { slot: "summary" }),
  ]);
}

/** @type {typeof TemelStat & {temel: Record<string, any>}} */ (TemelStat).temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return createStat();
  },
  getElementIcon() {
    return pageEssentialIcon("hash");
  },
};

export { TemelStat };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 3,
    label: "Statistic",
    description:
      "One figure in a Stats block: an authored value, what it measures, and its context.",
    category: "features-storytelling",
    allowBlank: true,
  },
  attributes: {
    emphasis: {
      type: "enum",
      presence: "optional",
      label: "Emphasis",
      description: "Keep the value neutral, or color it and its rule with the accent.",
      options: ["plain", "accent"],
      default: "plain",
    },
    alignment: {
      type: "enum",
      presence: "optional",
      label: "Alignment",
      description: "Align the statistic with the content edge or center it.",
      options: ["start", "center"],
      default: "start",
    },
  },
  slots: {
    order: ["value", "label", "summary"],
    configs: {
      value: {
        kind: "text",
        label: "Value",
        description: "The quantity exactly as it should read, such as 98% or 1,200.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 40,
        inlineEditable: true,
      },
      label: {
        kind: "text",
        label: "Label",
        description: "What the value measures.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 120,
        inlineEditable: true,
      },
      summary: {
        kind: "text",
        label: "Context",
        description: "The unit, source, or period behind the value.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 300,
        inlineEditable: true,
      },
    },
  },
});
