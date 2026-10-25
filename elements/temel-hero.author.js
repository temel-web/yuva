import {
  createActions,
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelHero } from "./temel-hero.js";

import { createFigure } from "./temel-figure.author.js";
import "./temel-action-group.author.js";

/** Create an opening band with an h1, a short summary, two actions, and lead media. */
export function createHero() {
  const media = createFigure("");
  media.slot = "media";
  media.setAttribute("ratio", "wide");
  const element = document.createElement("temel-hero");
  element.append(
    ...createIntroduction({
      eyebrow: "Welcome",
      heading: "Make the first thing people read count.",
      summary: [
        "Say what you offer and who it is for in a sentence or two, then point visitors to their next step.",
      ],
      headingTag: "h1",
    }),
    createActions(["Get started", "See how it works"]),
    media,
  );
  return element;
}

/** @type {typeof TemelHero & {temel: Record<string, any>}} */ (
  TemelHero
).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createHero,
  getElementIcon() {
    return pageEssentialIcon("layout-template");
  },
};

export { TemelHero };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 17,
    label: "Hero",
    description:
      "The page's opening band: a large heading, supporting copy, actions, and lead media.",
    category: "features-storytelling",
    allowBlank: true,
  },
  attributes: {
    height: {
      type: "enum",
      presence: "optional",
      label: "Minimum height",
      description:
        "Fit the content, or reserve at least one viewport for the opening band.",
      options: ["content", "viewport"],
      default: "content",
    },
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
      description:
        "Keep the page background, tint the band, or add a soft brand-colored glow.",
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
        "Stack the media below the copy, center everything, place the media beside the copy, set an oversized masthead heading, or group the introduction beside a room photograph in a study.",
      options: ["stacked", "centered", "split", "masthead", "study"],
      default: "stacked",
    },
  },
  slots: {
    order: ["eyebrow", "heading", "summary", "actions", "media"],
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
        description: "The page's main heading, usually its h1.",
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
      actions: {
        kind: "element",
        label: "Actions",
        description: "The visitor's next steps.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-action-group"],
      },
      media: {
        kind: "element",
        label: "Media",
        description: "A lead image, video, or recording.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-audio-player"],
        allowedContentTypes: ["media"],
      },
    },
  },
});
