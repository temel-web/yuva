import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelThemeSwitcher } from "./temel-theme-switcher.js";

/** Create a switch whose visible label names it. */
export function createThemeSwitcher() {
  return createAuthorElement("temel-theme-switcher", [
    createAuthorElement("span", ["Dark mode"]),
  ]);
}

/** @type {typeof TemelThemeSwitcher & {temel: Record<string, any>}} */ (
  TemelThemeSwitcher
).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createThemeSwitcher,
  getElementIcon() {
    return pageEssentialIcon("moon");
  },
};

export { TemelThemeSwitcher };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 5,
    label: "Theme Switcher",
    description:
      "A labelled switch between the light and dark presentation of the page.",
    category: "site-navigation",
    allowBlank: true,
  },
  attributes: {
    size: {
      type: "enum",
      presence: "optional",
      label: "Size",
      description: "Override the small default button size.",
      options: ["s", "m", "l", "xl", "xxl"],
    },
    variant: {
      type: "enum",
      presence: "optional",
      label: "Variant",
      description: "Override the quiet default button treatment.",
      options: ["accent", "outline", "quiet"],
    },
    "label-display": {
      type: "enum",
      presence: "optional",
      label: "Label display",
      description:
        "Show the label beside the moon icon, or show only the icon and keep the label as the switch's accessible name.",
      options: ["visible", "hidden"],
      default: "visible",
    },
    disabled: {
      type: "boolean",
      presence: "optional",
      label: "Disabled",
      description: "Prevent activation.",
      default: false,
    },
  },
  slots: {
    order: ["default"],
    configs: {
      default: {
        kind: "text",
        label: "Label",
        description:
          "The switch's name. Keep it even when the label is hidden, so assistive technology can announce the switch.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 100,
        inlineEditable: true,
      },
    },
  },
});
