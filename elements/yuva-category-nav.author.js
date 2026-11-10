import { YuvaCategoryNav } from "./yuva-category-nav.js";

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 5,
    label: "Category navigation",
    description:
      "Individually editable category links with current-page indication.",
    category: "site-navigation",
    allowBlank: true,
    isCommentable: true,
  },
  attributes: {
    "color-scheme": {
      type: "enum",
      presence: "optional",
      label: "Color scheme",
      description:
        "Inherit the surrounding color scheme or choose Light or Dark.",
      options: ["inherit", "light", "dark"],
      default: "inherit",
    },
  },
  slots: {
    order: ["default"],
    configs: {
      default: {
        kind: "element",
        label: "Category links",
        description:
          "Add, reorder, and edit each category's label and destination.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["a"],
      },
    },
  },
});

YuvaCategoryNav.temel = {
  getSchema() {
    return authorSchema;
  },
  create() {
    return document.createElement("yuva-category-nav");
  },
};

export { YuvaCategoryNav };
