import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelSiteNav } from "./temel-site-nav.js";

/** Create a named navigation with starter destinations the author points at real pages. */
export function createSiteNav() {
  return createAuthorElement("temel-site-nav", [
    createAuthorElement("a", ["Home"], { href: "/" }),
    createAuthorElement("a", ["About"], { href: "/" }),
    createAuthorElement("a", ["Contact"], { href: "/" }),
  ]);
}

/** @type {typeof TemelSiteNav & {temel: Record<string, any>}} */ (TemelSiteNav).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createSiteNav,
  getElementIcon() {
    return pageEssentialIcon("navigation");
  },
};

export { TemelSiteNav };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 6,
    label: "Site Navigation",
    description: "A navigation landmark named by its label, with a row or column of native links.",
    category: "site-navigation",
    allowBlank: true,
  },
  attributes: {
    "label-display": {
      type: "enum",
      presence: "optional",
      label: "Label display",
      description: "Show the navigation's name, or keep it for assistive technology only.",
      options: ["visible", "hidden"],
      default: "visible",
    },
    direction: {
      type: "enum",
      presence: "optional",
      label: "Direction",
      description: "Arrange the links in a row or a column.",
      options: ["horizontal", "vertical"],
      default: "horizontal",
    },
  },
  slots: {
    order: ["label", "default"],
    configs: {
      label: {
        isTemplatable: true,
        kind: "text",
        label: "Label",
        description: "The name that distinguishes this navigation from others on the page.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 100,
        inlineEditable: true,
      },
      default: {
        kind: "element",
        label: "Links",
        description: "Navigation destinations.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["a"],
      },
    },
  },
});
