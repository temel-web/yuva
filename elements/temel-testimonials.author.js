import {
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelTestimonials } from "./temel-testimonials.js";

import { createTestimonial } from "./temel-testimonial.author.js";

/** Create two testimonials with their introduction. */
export function createTestimonials() {
  const element = document.createElement("temel-testimonials");
  element.setAttribute("columns", "2");
  element.append(
    ...createIntroduction({
      eyebrow: "In their words",
      heading: "What people say after working with us.",
      summary: ["Only publish statements you have permission to share."],
    }),
    createTestimonial(),
    createTestimonial(),
  );
  return element;
}

/** @type {typeof TemelTestimonials & {temel: Record<string, any>}} */ (TemelTestimonials).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createTestimonials,
  getElementIcon() {
    return pageEssentialIcon("users");
  },
};

export { TemelTestimonials };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 1,
    label: "Testimonials",
    description: "A band of Testimonials with its own introduction and actions.",
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
        label: "Testimonials",
        description: "The testimonials, in reading order.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["temel-testimonial"],
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
