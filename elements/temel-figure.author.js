import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelFigure } from "./temel-figure.js";

const STARTER_IMAGE = new URL("./page-essentials/assets/starter-scene.webp", import.meta.url)
  .pathname;

/**
 * Create the starter illustration with an editable caption.
 * @param {string} [caption] Starter caption text; blocks that lead with media pass an empty one.
 */
export function createFigure(caption = "The harbor at first light.") {
  return createAuthorElement(
    "temel-figure",
    [
      createAuthorElement("img", [], {
        src: STARTER_IMAGE,
        alt: "An illustrated harbor with a lighthouse beneath a low afternoon sun.",
        width: "1200",
        height: "800",
      }),
      createAuthorElement("span", [caption], { slot: "caption" }),
    ],
    { ratio: "landscape" },
  );
}

/** @type {typeof TemelFigure & {temel: Record<string, any>}} */ (TemelFigure).temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return createFigure();
  },
  getElementIcon() {
    return pageEssentialIcon("image");
  },
};

export { TemelFigure };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 5,
    label: "Figure",
    description: "A responsive image or video with fitting, aspect ratio, and an editable caption.",
    category: "features-storytelling",
    contentTypes: ["media"],
    allowBlank: true,
  },
  attributes: {
    ratio: {
      type: "enum",
      presence: "optional",
      label: "Aspect ratio",
      description: "Preserve the media's own proportions or choose an intentional frame.",
      options: ["auto", "landscape", "portrait", "square", "wide"],
      default: "auto",
    },
    fit: {
      type: "enum",
      presence: "optional",
      label: "Fit",
      description: "Fill the frame or show the complete media.",
      options: ["cover", "contain"],
      default: "cover",
    },
    frame: {
      type: "enum",
      presence: "optional",
      label: "Frame",
      description:
        "Choose the corners and depth: standard, softly rounded, elevated with a shadow, or square.",
      options: ["standard", "rounded", "elevated", "square"],
      default: "standard",
    },
  },
  slots: {
    order: ["default", "caption"],
    configs: {
      default: {
        kind: "element",
        label: "Media",
        description: "A plain image, web image, or video.",
        minItems: 0,
        maxItems: 1,
        allowedContentTypes: ["media"],
      },
      caption: {
        kind: "text",
        label: "Caption",
        description: "A visible description or credit that also names the figure.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 500,
        inlineEditable: true,
      },
    },
  },
});
