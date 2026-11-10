import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelActionGroup } from "./temel-action-group.js";

/** Create a primary and a secondary link that the author points at real destinations. */
export function createActionGroup() {
  return createAuthorElement(
    "temel-action-group",
    [
      createAuthorElement("a", ["Get started"], { href: "/" }),
      createAuthorElement("a", ["Learn more"], { href: "/" }),
    ],
    { emphasis: "primary-first" },
  );
}

/** @type {typeof TemelActionGroup & {temel: Record<string, any>}} */ (TemelActionGroup).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createActionGroup,
  getElementIcon() {
    return pageEssentialIcon("mouse-pointer-2");
  },
};

export { TemelActionGroup };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 8,
    label: "Action Group",
    description: "A wrapping group of native links and commands with a shared button treatment.",
    category: "layout-actions",
    allowBlank: true,
  },
  attributes: {
    alignment: {
      type: "enum",
      presence: "optional",
      label: "Alignment",
      description: "Align the actions with the start, center, or end.",
      options: ["start", "center", "end"],
      default: "start",
    },
    emphasis: {
      type: "enum",
      presence: "optional",
      label: "Emphasis",
      description: "Give every action equal weight, or give the first action the accent treatment.",
      options: ["equal", "primary-first"],
      default: "equal",
    },
    indicator: {
      type: "enum",
      presence: "optional",
      label: "Link indicator",
      description: "Add a diagonal arrow to links.",
      options: ["none", "arrow"],
      default: "none",
    },
    shape: {
      type: "enum",
      presence: "optional",
      label: "Shape",
      description: "Use the Design System's button corners or fully rounded pill actions.",
      options: ["rounded", "pill"],
      default: "rounded",
    },
  },
  slots: {
    order: ["default"],
    configs: {
      default: {
        kind: "element",
        label: "Actions",
        description: "Navigation links or native command buttons.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["a", "button"],
      },
    },
  },
});
