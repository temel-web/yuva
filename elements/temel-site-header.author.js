import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelSiteHeader } from "./temel-site-header.js";

import { createSiteBrand } from "./temel-site-brand.author.js";
import { createSiteNav } from "./temel-site-nav.author.js";
import { createThemeSwitcher } from "./temel-theme-switcher.author.js";
import "./temel-action-group.author.js";

/** Create a masthead with a brand, navigation, one action, a theme switch, and a menu label. */
export function createSiteHeader() {
  const brand = createSiteBrand();
  brand.slot = "brand";
  const navigation = createSiteNav();
  navigation.slot = "navigation";
  navigation.setAttribute("label-display", "hidden");
  const theme = createThemeSwitcher();
  theme.slot = "utilities";
  theme.setAttribute("label-display", "hidden");
  return createAuthorElement(
    "temel-site-header",
    [
      brand,
      navigation,
      createAuthorElement(
        "temel-action-group",
        [createAuthorElement("a", ["Get in touch"], { href: "/" })],
        { slot: "actions" },
      ),
      theme,
    ],
    { "navigation-mode": "collapsible" },
  );
}

/** @type {typeof TemelSiteHeader & {temel: Record<string, any>}} */ (
  TemelSiteHeader
).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createSiteHeader,
  presentState(element, state) {
    element.open = state === "open";
  },
  getElementIcon() {
    return pageEssentialIcon("panel-top");
  },
};

export { TemelSiteHeader };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 22,
    label: "Site Header",
    description:
      "A responsive masthead for the site's identity, navigation, actions, and theme switch.",
    category: "site-navigation",
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
      description:
        "Keep the page background, tint the band, or add a soft brand-colored glow.",
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
    position: {
      type: "enum",
      presence: "optional",
      label: "Position",
      description:
        "Scroll the header away with the page, or keep the page header pinned to the top while visitors scroll.",
      options: ["static", "sticky"],
      default: "static",
    },
    "navigation-mode": {
      type: "enum",
      presence: "optional",
      label: "Navigation presentation",
      description:
        "Keep links visible, or use a compact menu on small screens with visible navigation on larger screens.",
      options: ["expanded", "collapsible"],
      default: "expanded",
    },
  },
  states: {
    order: ["default", "open"],
    configs: {
      default: { label: "Menu closed" },
      open: {
        label: "Menu open",
        description:
          "Edit the navigation and visitor preferences inside the menu.",
        slots: ["navigation", "preferences"],
      },
    },
  },
  slots: {
    order: [
      "brand",
      "navigation",
      "actions",
      "preferences",
      "utilities",
      "menu-label",
    ],
    configs: {
      brand: {
        kind: "element",
        label: "Brand",
        description: "The site identity.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-site-brand"],
      },
      navigation: {
        kind: "element",
        label: "Navigation",
        description: "The primary destinations.",
        minItems: 0,
        maxItems: 1,
      },
      actions: {
        kind: "element",
        label: "Actions",
        description: "An optional primary action, such as signing in.",
        minItems: 0,
        maxItems: 1,
      },
      preferences: {
        kind: "element",
        label: "Preferences",
        description:
          "Visitor preferences grouped after the categories in collapsible navigation.",
        minItems: 0,
        maxItems: 2,
      },
      utilities: {
        kind: "element",
        label: "Utilities",
        description: "Controls that stay visible beside the primary actions.",
        minItems: 0,
        maxItems: 2,
      },
      "menu-label": {
        isTemplatable: true,
        kind: "text",
        label: "Menu label",
        description:
          "The name of the menu button that opens collapsed navigation. The button shows a menu icon, so assistive technology announces this name.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 100,
        inlineEditable: true,
      },
    },
  },
});
