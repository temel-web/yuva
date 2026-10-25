import {
  createAuthorElement,
  createDocument,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelStep } from "./temel-step.js";

/**
 * Create one step.
 * @param {{heading: string, body: string}} [copy]
 */
export function createStep(
  copy = {
    heading: "Tell us what you need",
    body: "Describe what happens at this stage and what the reader needs to do.",
  },
) {
  return createAuthorElement("temel-step", [
    createAuthorElement("h3", [copy.heading], { slot: "heading" }),
    createDocument("body", [copy.body]),
  ]);
}

/** @type {typeof TemelStep & {temel: Record<string, any>}} */ (TemelStep).temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return createStep();
  },
  getElementIcon() {
    return pageEssentialIcon("hash");
  },
};

export { TemelStep };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 2,
    label: "Step",
    description: "One numbered stage of a Steps block: a heading and its description.",
    category: "features-storytelling",
    allowBlank: true,
  },
  attributes: {},
  slots: {
    order: ["heading", "body"],
    configs: {
      heading: {
        kind: "text",
        label: "Heading",
        description: "The name of this stage.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 200,
        inlineEditable: true,
      },
      body: {
        kind: "text",
        label: "Description",
        description: "What happens in this stage, as paragraphs and lists.",
        format: "rte-document-v1",
        minCharacters: 0,
        maxCharacters: null,
        inlineEditable: true,
      },
    },
  },
});
