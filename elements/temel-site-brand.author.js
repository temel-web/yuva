import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelSiteBrand } from "./temel-site-brand.js";

/** Create a linked site name that the author replaces with the real identity. */
export function createSiteBrand() {
  return createAuthorElement("temel-site-brand", [
    createAuthorElement("span", [
      createAuthorElement("a", ["Your site"], { href: "/" }),
    ]),
  ]);
}

/** @type {typeof TemelSiteBrand & {temel: Record<string, any>}} */ (
  TemelSiteBrand
).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createSiteBrand,
  getElementIcon() {
    return pageEssentialIcon("type");
  },
};

export { TemelSiteBrand };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 9,
    label: "Site Brand",
    description:
      "A site identity: an optional logo beside an editable name or home link.",
    category: "site-navigation",
    allowBlank: true,
  },
  attributes: {
    wordmark: {
      type: "text",
      presence: "optional",
      label: "Wordmark image",
      description:
        "A transparent wordmark image, shown in the current text color. The Name supplies its accessible label.",
    },
    href: {
      type: "text",
      presence: "optional",
      label: "Logo destination",
      description: "The page reached by selecting the logo.",
    },
    size: {
      type: "enum",
      presence: "optional",
      label: "Logo size",
      description: "Use a compact, standard, or display-sized logo.",
      options: ["compact", "standard", "display"],
      default: "standard",
    },
  },
  slots: {
    order: ["logo", "default"],
    configs: {
      logo: {
        kind: "element",
        label: "Logo",
        description: "An optional logo image.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["img", "temel-picture"],
      },
      default: {
        kind: "text",
        label: "Name",
        description: "The site name, optionally linked to the home page.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 200,
        inlineEditable: true,
      },
    },
  },
});
