import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelPricingPlan } from "./temel-pricing-plan.js";

import { createPrice } from "./temel-price.author.js";
import "./temel-action-group.author.js";

/**
 * Create one plan with its price, inclusions, action, and terms.
 * @param {{badge: string, heading: string, summary: string, price: Parameters<typeof createPrice>[0], features: string[], action: string, footnote: string}} [copy]
 */
export function createPricingPlan(
  copy = {
    badge: "",
    heading: "Starter",
    summary: "For a small team getting its first site live.",
    price: {
      prefix: "From",
      amount: "$29",
      period: "per month",
      note: "Billed monthly. Cancel any time.",
    },
    features: ["One website", "Five editors", "Email support"],
    action: "Choose Starter",
    footnote: "Prices exclude local taxes.",
  },
) {
  const price = createPrice(copy.price);
  price.slot = "price";
  return createAuthorElement("temel-pricing-plan", [
    createAuthorElement("span", [copy.badge], { slot: "badge" }),
    createAuthorElement("h3", [copy.heading], { slot: "heading" }),
    createAuthorElement("p", [copy.summary], { slot: "summary" }),
    price,
    createAuthorElement(
      "div",
      [
        createAuthorElement(
          "ul",
          copy.features.map((feature) => createAuthorElement("li", [feature])),
        ),
      ],
      { slot: "body" },
    ),
    createAuthorElement(
      "temel-action-group",
      [createAuthorElement("a", [copy.action], { href: "/" })],
      { slot: "actions" },
    ),
    createAuthorElement("p", [copy.footnote], { slot: "footnote" }),
  ]);
}

/** @type {typeof TemelPricingPlan & {temel: Record<string, any>}} */ (TemelPricingPlan).temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return createPricingPlan();
  },
  getElementIcon() {
    return pageEssentialIcon("file-text");
  },
};

export { TemelPricingPlan };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 3,
    label: "Pricing Plan",
    description: "One offer in a Pricing block: its name, price, inclusions, terms, and actions.",
    category: "pricing",
    allowBlank: true,
  },
  attributes: {
    emphasis: {
      type: "enum",
      presence: "optional",
      label: "Emphasis",
      description:
        "Highlight this plan with an accent border and elevation. Write any badge text yourself.",
      options: ["standard", "featured"],
      default: "standard",
    },
  },
  slots: {
    order: ["badge", "heading", "summary", "price", "body", "actions", "footnote"],
    configs: {
      badge: {
        kind: "text",
        label: "Badge",
        description: "An optional qualifier, such as Most popular.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 60,
        inlineEditable: true,
      },
      heading: {
        kind: "text",
        label: "Plan name",
        description: "The name of this offer.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 200,
        inlineEditable: true,
      },
      summary: {
        kind: "text",
        label: "Summary",
        description: "Who the plan is for.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 300,
        inlineEditable: true,
      },
      price: {
        kind: "element",
        label: "Price",
        description: "The plan's price and billing context.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-price"],
      },
      body: {
        kind: "text",
        label: "Inclusions",
        description: "What the plan includes, as lists and paragraphs.",
        format: "rte-document-v1",
        minCharacters: 0,
        maxCharacters: null,
        inlineEditable: true,
      },
      actions: {
        kind: "element",
        label: "Actions",
        description: "Links to choose or ask about this plan.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-action-group"],
      },
      footnote: {
        kind: "text",
        label: "Terms",
        description: "Limits, conditions, or other terms.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 500,
        inlineEditable: true,
      },
    },
  },
});
