import {
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelFaq } from "./temel-faq.js";

import { createFaqItem } from "./temel-faq-item.author.js";

/** Create three questions with their introduction; the first starts open. */
export function createFaq() {
  const first = createFaqItem();
  first.setAttribute("open", "");
  const element = document.createElement("temel-faq");
  element.append(
    ...createIntroduction({
      eyebrow: "Questions",
      heading: "Answers before you ask.",
      summary: ["The questions people ask us most often."],
    }),
    first,
    createFaqItem({
      question: "What does it cost?",
      answer: "Give a range or a starting price, and say what changes it.",
    }),
    createFaqItem({
      question: "Who will I work with?",
      answer: "Name the role of the person who answers, so readers know what to expect.",
    }),
  );
  return element;
}

/** @type {typeof TemelFaq & {temel: Record<string, any>}} */ (TemelFaq).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createFaq,
  getElementIcon() {
    return pageEssentialIcon("circle-help");
  },
};

export { TemelFaq };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 4,
    label: "FAQ",
    description:
      "A band of frequently asked questions, each a native disclosure, with its introduction.",
    category: "interaction",
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
    layout: {
      type: "enum",
      presence: "optional",
      label: "Layout",
      description:
        "Stack the introduction above the questions, or place it beside them when there is room.",
      options: ["stacked", "split"],
      default: "stacked",
    },
  },
  slots: {
    order: ["eyebrow", "heading", "summary", "default", "actions"],
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
      default: {
        kind: "element",
        label: "Questions",
        description: "The questions, in reading order.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["temel-faq-item"],
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
