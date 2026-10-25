import {
  createAuthorElement,
  createDocument,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelContentCard } from "./temel-content-card.js";

import { createFigure } from "./temel-figure.author.js";
import "./temel-action-group.author.js";

/**
 * Create one card with starter media and copy.
 * @param {{eyebrow: string, heading: string, body: string}} [copy]
 */
export function createContentCard(
  copy = {
    eyebrow: "Guide",
    heading: "Look a little closer.",
    body: "Share one story, project, or idea, with the detail that makes it worth opening.",
  },
) {
  const media = createFigure("");
  media.slot = "media";
  return createAuthorElement("temel-content-card", [
    media,
    createAuthorElement("span", [copy.eyebrow], { slot: "eyebrow" }),
    createAuthorElement("h3", [createAuthorElement("a", [copy.heading], { href: "/" })], {
      slot: "heading",
    }),
    createDocument("body", [copy.body]),
  ]);
}

/** @type {typeof TemelContentCard & {temel: Record<string, any>}} */ (TemelContentCard).temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return createContentCard();
  },
  getElementIcon() {
    return pageEssentialIcon("square");
  },
};

export { TemelContentCard };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 7,
    label: "Content Card",
    description:
      "One item in a Cards block: media, an eyebrow, a heading, a description, and actions.",
    category: "features-storytelling",
    allowBlank: true,
  },
  attributes: {
    surface: {
      type: "enum",
      presence: "optional",
      label: "Surface",
      description: "Keep the card unframed, or fill, outline, raise, or tint it.",
      options: ["plain", "muted", "outlined", "raised", "accent"],
      default: "plain",
    },
    link: {
      type: "enum",
      presence: "optional",
      label: "Link area",
      description:
        "Make only the heading link clickable, or extend it across the whole card. Other links in the card stay separately clickable.",
      options: ["heading", "card"],
      default: "heading",
    },
  },
  slots: {
    order: ["eyebrow", "heading", "media", "body", "actions"],
    configs: {
      media: {
        kind: "element",
        label: "Media",
        description: "An optional image, video, or other media element.",
        minItems: 0,
        maxItems: 1,
        allowedContentTypes: ["media"],
      },
      eyebrow: {
        kind: "text",
        label: "Eyebrow",
        description: "A category or other short context.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 200,
        inlineEditable: true,
      },
      heading: {
        kind: "text",
        label: "Heading",
        description: "The card's heading, optionally linked to its destination.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 300,
        inlineEditable: true,
      },
      body: {
        kind: "text",
        label: "Description",
        description: "Paragraphs and lists describing the item.",
        format: "rte-document-v1",
        minCharacters: 0,
        maxCharacters: null,
        inlineEditable: true,
      },
      actions: {
        kind: "element",
        label: "Actions",
        description: "Explicit destinations or commands.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-action-group"],
      },
    },
  },
});
