import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelQuote } from "./temel-quote.js";

/** Create a pull quote with its attribution. */
export function createQuote() {
  return createAuthorElement(
    "temel-quote",
    [
      createAuthorElement(
        "p",
        ["Good work starts with paying attention to what is already there."],
        { slot: "text" },
      ),
      createAuthorElement("cite", ["From our studio notes"], {
        slot: "credit",
      }),
    ],
    { width: "reading" },
  );
}

/** @type {typeof TemelQuote & {temel: Record<string, any>}} */ (TemelQuote).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createQuote,
  getElementIcon() {
    return pageEssentialIcon("quote");
  },
};

export { TemelQuote };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 3,
    label: "Quotation",
    description: "A band for one attributed quotation or editorial pull quote.",
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
    layout: {
      type: "enum",
      presence: "optional",
      label: "Layout",
      description:
        "Mark the quotation with a side rule, a large quotation mark, or a centered pull-quote treatment.",
      options: ["rule", "mark", "centered"],
      default: "rule",
    },
  },
  slots: {
    order: ["text", "credit"],
    configs: {
      text: {
        kind: "text",
        label: "Quotation",
        description: "The quoted words.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 600,
        inlineEditable: true,
      },
      credit: {
        kind: "text",
        label: "Attribution",
        description: "The speaker or source.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 300,
        inlineEditable: true,
      },
    },
  },
});
