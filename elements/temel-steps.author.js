import {
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelSteps } from "./temel-steps.js";

import { createStep } from "./temel-step.author.js";

/** Create a three-stage process with its introduction. */
export function createSteps() {
  const element = document.createElement("temel-steps");
  element.append(
    ...createIntroduction({
      eyebrow: "How it works",
      heading: "From first message to finished work.",
      summary: ["Each stage has a clear owner and a clear result."],
    }),
    createStep({
      heading: "Tell us what you need",
      body: "Send a short description and we reply with questions or a proposal.",
    }),
    createStep({
      heading: "Agree on the plan",
      body: "We confirm the scope, the schedule, and the price in writing.",
    }),
    createStep({
      heading: "Receive the work",
      body: "We deliver, walk you through the result, and stay available for changes.",
    }),
  );
  return element;
}

/** @type {typeof TemelSteps & {temel: Record<string, any>}} */ (TemelSteps).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createSteps,
  getElementIcon() {
    return pageEssentialIcon("list-ordered");
  },
};

export { TemelSteps };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 2,
    label: "Steps",
    description: "An ordered process whose Steps number themselves from their current order.",
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
      description: "Stack the steps vertically, or place them side by side when there is room.",
      options: ["vertical", "horizontal"],
      default: "vertical",
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
        label: "Steps",
        description: "The steps; their order sets their numbers.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["temel-step"],
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
