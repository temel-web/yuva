import {
  createAuthorElement,
  createDocument,
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelTextSection } from "./temel-text-section.js";

import "./temel-action-group.author.js";

/** Create a text band: an introduction, two paragraphs, and a list. */
export function createTextSection() {
  const body = createDocument("body", [
    "Use this band for the part of the story that needs a few paragraphs: background, a process, or the details behind a decision.",
  ]);
  body.append(
    createAuthorElement("ul", [
      createAuthorElement("li", ["Lead with what the reader needs first."]),
      createAuthorElement("li", ["Add the details that answer their next question."]),
      createAuthorElement("li", ["Close with where to go next."]),
    ]),
  );
  const element = document.createElement("temel-text-section");
  element.append(
    ...createIntroduction({
      eyebrow: "Our approach",
      heading: "Give the story room to breathe.",
      summary: ["A short summary helps readers decide whether to read on."],
    }),
    body,
  );
  return element;
}

/** @type {typeof TemelTextSection & {temel: Record<string, any>}} */ (TemelTextSection).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createTextSection,
  getElementIcon() {
    return pageEssentialIcon("align-left");
  },
};

export { TemelTextSection };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 1,
    label: "Text Section",
    description: "A band of readable text with its own introduction and actions.",
    category: "features-storytelling",
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
    alignment: {
      type: "enum",
      presence: "optional",
      label: "Alignment",
      description: "Align the text with the content edge or center it.",
      options: ["start", "center"],
      default: "start",
    },
    measure: {
      type: "enum",
      presence: "optional",
      label: "Measure",
      description:
        "Keep lines at a comfortable reading length, or let the text use the full content width.",
      options: ["reading", "full"],
      default: "reading",
    },
  },
  slots: {
    order: ["eyebrow", "heading", "summary", "body", "actions"],
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
      body: {
        kind: "text",
        label: "Body",
        description: "Paragraphs, lists, and subheadings.",
        format: "rte-document-v1",
        minCharacters: 0,
        maxCharacters: null,
        inlineEditable: true,
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
