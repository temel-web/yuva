import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelTestimonial } from "./temel-testimonial.js";

/**
 * Create one testimonial. Starter copy asks for a real person's words; it names nobody.
 * @param {{statement: string, name: string, role: string}} [copy]
 */
export function createTestimonial(
  copy = {
    statement: "Quote a customer in their own words, with their permission.",
    name: "Their name",
    role: "Their role and organization",
  },
) {
  return createAuthorElement("temel-testimonial", [
    createAuthorElement("p", [copy.statement], { slot: "statement" }),
    createAuthorElement("cite", [copy.name], { slot: "name" }),
    createAuthorElement("span", [copy.role], { slot: "role" }),
  ]);
}

/** @type {typeof TemelTestimonial & {temel: Record<string, any>}} */ (TemelTestimonial).temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return createTestimonial();
  },
  getElementIcon() {
    return pageEssentialIcon("message-square");
  },
};

export { TemelTestimonial };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 3,
    label: "Testimonial",
    description:
      "One person's statement in a Testimonials block, with their name, role, and portrait.",
    category: "features-storytelling",
    allowBlank: true,
  },
  attributes: {
    surface: {
      type: "enum",
      presence: "optional",
      label: "Surface",
      description: "Keep the testimonial unframed, or fill, outline, raise, or tint it.",
      options: ["plain", "muted", "outlined", "raised", "accent"],
      default: "plain",
    },
    layout: {
      type: "enum",
      presence: "optional",
      label: "Layout",
      description: "Align the statement with the content edge or center it.",
      options: ["stacked", "centered"],
      default: "stacked",
    },
  },
  slots: {
    order: ["statement", "portrait", "name", "role"],
    configs: {
      statement: {
        kind: "text",
        label: "Statement",
        description: "The person's own words, used with their permission.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 600,
        inlineEditable: true,
      },
      portrait: {
        kind: "element",
        label: "Portrait",
        description: "An optional photo of the person.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["img", "temel-picture"],
      },
      name: {
        kind: "text",
        label: "Name",
        description: "The person's name.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 120,
        inlineEditable: true,
      },
      role: {
        kind: "text",
        label: "Role",
        description: "The person's role and organization.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 200,
        inlineEditable: true,
      },
    },
  },
});
