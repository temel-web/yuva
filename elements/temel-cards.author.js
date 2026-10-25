import {
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelCards } from "./temel-cards.js";

import { createContentCard } from "./temel-content-card.author.js";

/** Create a three-card band with its introduction. */
export function createCards() {
  const element = document.createElement("temel-cards");
  element.setAttribute("columns", "3");
  element.append(
    ...createIntroduction({
      eyebrow: "Explore",
      heading: "Three ways to get to know us.",
      summary: ["Pick the one that matches what you came for."],
    }),
    createContentCard({
      eyebrow: "Visit",
      heading: "Plan a visit",
      body: "Opening hours, directions, and what to bring.",
    }),
    createContentCard({
      eyebrow: "Read",
      heading: "Browse the journal",
      body: "Notes from our work, published as it happens.",
    }),
    createContentCard({
      eyebrow: "Join",
      heading: "Work with us",
      body: "How we collaborate and how to start a conversation.",
    }),
  );
  return element;
}

/** @type {typeof TemelCards & {temel: Record<string, any>}} */ (TemelCards).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createCards,
  getElementIcon() {
    return pageEssentialIcon("layout-grid");
  },
};

export { TemelCards };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 2,
    label: "Cards",
    description:
      "A band of Content Cards with its own introduction and actions, as a grid or as rows.",
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
    columns: {
      type: "enum",
      presence: "optional",
      label: "Columns",
      description: "The most items side by side; narrower spaces show fewer columns automatically.",
      options: ["1", "2", "3", "4"],
      default: "3",
    },
    layout: {
      type: "enum",
      presence: "optional",
      label: "Layout",
      description:
        "Arrange the cards in a grid, or list them as rows with their media beside the text.",
      options: ["grid", "rows"],
      default: "grid",
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
        label: "Cards",
        description: "The cards, in reading order.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["temel-content-card"],
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
