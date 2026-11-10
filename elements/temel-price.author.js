import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelPrice } from "./temel-price.js";

/**
 * Create one price.
 * @param {{prefix: string, amount: string, period: string, note: string}} [copy]
 */
export function createPrice(
  copy = {
    prefix: "From",
    amount: "$29",
    period: "per month",
    note: "Billed monthly. Cancel any time.",
  },
) {
  return createAuthorElement("temel-price", [
    createAuthorElement("span", [copy.prefix], { slot: "prefix" }),
    createAuthorElement("strong", [copy.amount]),
    createAuthorElement("span", [copy.period], { slot: "period" }),
    createAuthorElement("p", [copy.note], { slot: "note" }),
  ]);
}

/** @type {typeof TemelPrice & {temel: Record<string, any>}} */ (TemelPrice).temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return createPrice();
  },
  getElementIcon() {
    return pageEssentialIcon("tag");
  },
};

export { TemelPrice };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 3,
    label: "Price",
    description: "An authored static amount with its currency context, billing period, and notes.",
    category: "pricing",
    allowBlank: true,
  },
  attributes: {
    size: {
      type: "enum",
      presence: "optional",
      label: "Size",
      description: "Set the amount at its standard or a compact size.",
      options: ["standard", "compact"],
      default: "standard",
    },
  },
  slots: {
    order: ["prefix", "default", "period", "note"],
    configs: {
      prefix: {
        kind: "text",
        label: "Price context",
        description: "A currency or qualifier above the amount, such as CHF or From.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 60,
        inlineEditable: true,
      },
      default: {
        kind: "text",
        label: "Amount",
        description: "The amount exactly as it should read, such as $29, Free, or On request.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 60,
        inlineEditable: true,
      },
      period: {
        kind: "text",
        label: "Billing period",
        description: "The period or unit, such as per month or one-time.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 60,
        inlineEditable: true,
      },
      note: {
        kind: "text",
        label: "Pricing note",
        description: "Tax, billing, renewal, or other terms of the price.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 300,
        inlineEditable: true,
      },
    },
  },
});
