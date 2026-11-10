import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelLanguageSelector } from "./temel-language-selector.js";

/** Create a compact selector whose label names it for assistive technology. */
export function createLanguageSelector() {
  return createAuthorElement(
    "temel-language-selector",
    [createAuthorElement("span", ["Language"])],
    { "label-display": "hidden" },
  );
}

/** @type {typeof TemelLanguageSelector & {temel: Record<string, any>}} */ (
  TemelLanguageSelector
).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createLanguageSelector,
  getElementIcon() {
    return pageEssentialIcon("languages");
  },
};

export { TemelLanguageSelector };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 1,
    label: "Language Selector",
    description:
      "Links to the current page in each language of the site, named in its own language. The languages come from the site's language settings.",
    category: "site-navigation",
    allowBlank: true,
  },
  attributes: {
    layout: {
      type: "enum",
      presence: "optional",
      label: "Layout",
      description:
        "Show a compact button with the current language that opens the list, or show every language as a labelled column of links.",
      options: ["compact", "list"],
      default: "compact",
    },
    "label-display": {
      type: "enum",
      presence: "optional",
      label: "Label display",
      description:
        "Show the label, or keep it for assistive technology only. It names the button or the list either way.",
      options: ["visible", "hidden"],
      default: "visible",
    },
  },
  slots: {
    order: ["default"],
    configs: {
      default: {
        kind: "text",
        label: "Label",
        description:
          "The selector's name, such as Language, written in the page's language. Keep it even when the label is hidden, so assistive technology can announce the selector.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 100,
        inlineEditable: true,
      },
    },
  },
});
