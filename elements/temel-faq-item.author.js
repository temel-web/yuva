import {
  createAuthorElement,
  createDocument,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelFaqItem } from "./temel-faq-item.js";

/**
 * Create one question and its answer.
 * @param {{question: string, answer: string}} [copy]
 */
export function createFaqItem(
  copy = {
    question: "How long does a typical project take?",
    answer:
      "Answer in a sentence or two, and link to the page with the details.",
  },
) {
  return createAuthorElement("temel-faq-item", [
    createAuthorElement("span", [copy.question], { slot: "question" }),
    createDocument("answer", [copy.answer]),
  ]);
}

/** @type {typeof TemelFaqItem & {temel: Record<string, any>}} */ (
  TemelFaqItem
).temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return createFaqItem();
  },
  getElementIcon() {
    return pageEssentialIcon("chevron-down");
  },
  presentState(element, state) {
    element.open = state === "open" ? true : null;
  },
};

export { TemelFaqItem };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 7,
    label: "FAQ Item",
    description:
      "One question in an FAQ block: a native disclosure with the question and its answer.",
    category: "interaction",
    allowBlank: true,
  },
  attributes: {
    open: {
      type: "boolean",
      presence: "optional",
      default: false,
      label: "Initially open",
      description: "Show the answer when the page first loads.",
    },
  },
  slots: {
    order: ["question", "answer"],
    configs: {
      question: {
        kind: "text",
        label: "Question",
        description: "The visible disclosure label.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 300,
        inlineEditable: true,
      },
      answer: {
        editor: { interaction: "select" },
        kind: "text",
        label: "Answer",
        description:
          "Paragraphs, lists, and links shown when the question is open.",
        format: "rte-document-v1",
        minCharacters: 0,
        maxCharacters: null,
        inlineEditable: true,
      },
    },
  },
  states: {
    order: ["default", "open"],
    configs: {
      default: { label: "Initial" },
      open: {
        label: "Open",
        description: "The answer, shown after a visitor opens the question.",
        slots: ["answer"],
      },
    },
  },
});
