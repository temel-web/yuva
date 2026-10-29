import {
  createActions,
  createDocument,
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelFeature } from "./temel-feature.js";

import { createFigure } from "./temel-figure.author.js";
import "./temel-action-group.author.js";

/** Create a feature band: media beside an introduction, two paragraphs, and an action. */
export function createFeature() {
  const media = createFigure("");
  media.slot = "media";
  const element = document.createElement("temel-feature");
  element.append(
    media,
    ...createIntroduction({
      eyebrow: "How it works",
      heading: "Show one idea with the picture that explains it.",
      summary: ["Lead with the benefit, then let the image carry the detail."],
    }),
    createDocument("body", [
      "Describe what someone sees in the picture and why it matters to them.",
      "Keep each paragraph to one point so the band stays easy to scan.",
    ]),
    createActions(["Read more"], { indicator: "arrow", emphasis: "equal" }),
  );
  return element;
}

/** @type {typeof TemelFeature & {temel: Record<string, any>}} */ (TemelFeature).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createFeature,
  getElementIcon() {
    return pageEssentialIcon("columns-2");
  },
};

export { TemelFeature };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 1,
    label: "Feature",
    description: "A band that pairs media with its own introduction, body text, and actions.",
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
    "media-position": {
      type: "enum",
      presence: "optional",
      label: "Media position",
      description:
        "Place the media before or after the text; reading order follows the visual order.",
      options: ["start", "end"],
      default: "start",
    },
    ratio: {
      type: "enum",
      presence: "optional",
      label: "Ratio",
      description: "Give media and text equal space, or give one of them more.",
      options: ["equal", "media-wide", "content-wide"],
      default: "equal",
    },
    alignment: {
      type: "enum",
      presence: "optional",
      label: "Vertical alignment",
      description: "Center the media and text against each other, or align their tops.",
      options: ["center", "start"],
      default: "center",
    },
  },
  slots: {
    order: ["eyebrow", "heading", "summary", "body", "actions", "media"],
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
      media: {
        kind: "element",
        label: "Media",
        description: "The image, video, or recording the text explains.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-audio-player"],
        allowedContentTypes: ["media"],
      },
    },
  },
});
