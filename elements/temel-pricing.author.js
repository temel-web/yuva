import {
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelPricing } from "./temel-pricing.js";

import { createPricingPlan } from "./temel-pricing-plan.author.js";

/** Create three plans, the middle one featured, with their introduction. */
export function createPricing() {
  const featured = createPricingPlan({
    badge: "Most popular",
    heading: "Studio",
    summary: "For a growing team with several sites.",
    price: {
      prefix: "From",
      amount: "$79",
      period: "per month",
      note: "Billed monthly. Cancel any time.",
    },
    features: ["Three websites", "Twenty editors", "Priority support"],
    action: "Choose Studio",
    footnote: "Prices exclude local taxes.",
  });
  featured.setAttribute("emphasis", "featured");
  const element = document.createElement("temel-pricing");
  element.setAttribute("columns", "3");
  element.append(
    ...createIntroduction({
      eyebrow: "Pricing",
      heading: "Simple plans that grow with you.",
      summary: ["Every plan includes hosting, backups, and updates."],
    }),
    createPricingPlan(),
    featured,
    createPricingPlan({
      badge: "",
      heading: "Organization",
      summary: "For many teams under one roof.",
      price: {
        prefix: "",
        amount: "On request",
        period: "",
        note: "Annual agreement.",
      },
      features: ["Unlimited websites", "Single sign-on", "A named contact"],
      action: "Talk to us",
      footnote: "Includes an onboarding workshop.",
    }),
  );
  return element;
}

/** @type {typeof TemelPricing & {temel: Record<string, any>}} */ (TemelPricing).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createPricing,
  getElementIcon() {
    return pageEssentialIcon("tag");
  },
};

export { TemelPricing };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 1,
    label: "Pricing",
    description: "A band of Pricing Plans with its own introduction and actions.",
    category: "pricing",
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
        label: "Plans",
        description: "The plans, in reading order.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["temel-pricing-plan"],
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
