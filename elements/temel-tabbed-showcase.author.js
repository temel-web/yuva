import {
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelTabbedShowcase } from "./temel-tabbed-showcase.js";

import { createShowcasePanel } from "./temel-showcase-panel.author.js";

/** Create a showcase with its introduction, a tabs label, and two tabs. */
export function createTabbedShowcase() {
  const element = document.createElement("temel-tabbed-showcase");
  element.append(
    ...createIntroduction({
      eyebrow: "Take a tour",
      heading: "See each part in turn.",
      summary: ["Choose a tab to show one part of the story at a time."],
    }),

    createShowcasePanel("Overview"),
    createShowcasePanel("Details"),
  );
  return element;
}

/**
 * Save the tab relationships of the initial view: the first visible panel of each panel group
 * is selected, whichever tab a visitor or the editor showed last.
 * @param {HTMLElement} element
 */
export function sanitizeTabbedShowcase(element) {
  const panelsByGroup = new Map();
  for (const child of element.children) {
    if ((child.getAttribute("slot") ?? "").split("@")[0] === "tabs-label")
      removeTabListSemantics(child);
    if (child.localName !== "temel-showcase-panel") continue;
    const group = child.getAttribute("slot") ?? "";
    panelsByGroup.set(group, [...(panelsByGroup.get(group) ?? []), child]);
  }
  for (const panels of panelsByGroup.values()) {
    const selected = panels.find((panel) => !panel.hidden) ?? null;
    for (const panel of panels) normalizeTabPair(panel, panel === selected);
  }
}

/**
 * The runtime gives the tabs label its tab list role, orientation, name, and owned tabs; none of
 * them are authored, so a save never keeps them.
 * @param {Element} list
 */
function removeTabListSemantics(list) {
  for (const name of ["role", "aria-orientation", "aria-label", "aria-owns"])
    list.removeAttribute(name);
}

/**
 * Rewrite the selection-dependent attributes in one fixed order, so the saved markup does not
 * depend on which tab the runtime selected before saving.
 * @param {Element} panel @param {boolean} isSelected
 */
function normalizeTabPair(panel, isSelected) {
  const tabs = [...panel.children].filter(
    (child) =>
      child.localName === "button" && (child.getAttribute("slot") ?? "").split("@")[0] === "label",
  );
  const tabIds = tabs.map((tab) => tab.id).filter(Boolean);
  for (const tab of tabs) {
    tab.removeAttribute("tabindex");
    tab.removeAttribute("aria-selected");
    tab.setAttribute("aria-selected", String(isSelected));
  }
  const labelledBy = panel.getAttribute("aria-labelledby");
  panel.removeAttribute("data-state");
  panel.removeAttribute("role");
  panel.removeAttribute("aria-labelledby");
  const isRuntimeLabel = labelledBy === null || tabIds.includes(labelledBy);
  if (isSelected) panel.setAttribute("role", "tabpanel");
  if (!isRuntimeLabel) panel.setAttribute("aria-labelledby", labelledBy);
  else if (isSelected && tabIds.length > 0) panel.setAttribute("aria-labelledby", tabIds[0]);
}

/** @type {typeof TemelTabbedShowcase & {temel: Record<string, any>}} */ (
  TemelTabbedShowcase
).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createTabbedShowcase,
  getElementIcon() {
    return pageEssentialIcon("panels-top-left");
  },
  presentItem(element, item) {
    element.selectedPanel = item;
  },
  sanitize: sanitizeTabbedShowcase,
};

export { TemelTabbedShowcase };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 10,
    label: "Tabbed Showcase",
    description:
      "A band of keyboard-operated tabs, each showing its own feature, cards, figure, or text.",
    category: "interaction",
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
  },
  slots: {
    order: ["eyebrow", "heading", "summary", "tabs-label", "default", "actions"],
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
      "tabs-label": {
        isTemplatable: true,
        kind: "text",
        label: "Tabs label",
        description:
          "A short visible name for the row of tabs; the heading names the tabs when this is empty.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 100,
        inlineEditable: true,
      },
      default: {
        kind: "element",
        label: "Tabs",
        description: "Add, move, or remove a complete tab with its label and content.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["temel-showcase-panel"],
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
  states: {
    itemSlots: ["default"],
  },
});
