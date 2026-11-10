import {
  createActions,
  createAuthorElement,
  createIntroduction,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelSiteFooter } from "./temel-site-footer.js";

import { createSiteBrand } from "./temel-site-brand.author.js";
import { createSiteNav } from "./temel-site-nav.author.js";
import "./temel-action-group.author.js";

/** Create a closing invitation, one navigation group, the brand, and a colophon. */
export function createSiteFooter() {
  const links = createSiteNav();
  links.slot = "links";
  links.setAttribute("direction", "vertical");
  links.prepend(createAuthorElement("span", ["Explore"], { slot: "label" }));
  const brand = createSiteBrand();
  brand.slot = "brand";
  return createAuthorElement("temel-site-footer", [
    ...createIntroduction({
      eyebrow: "Stay in touch",
      heading: "Tell us what you are working on.",
      summary: ["We read every message and reply within two working days."],
    }),
    createActions(["Write to us"]),
    createAuthorElement("span", ["No newsletter. No tracking."], {
      slot: "note",
    }),
    links,
    brand,
    createAuthorElement("p", ["© 2026 Your site."], { slot: "colophon" }),
  ]);
}

/** @type {typeof TemelSiteFooter & {temel: Record<string, any>}} */ (TemelSiteFooter).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createSiteFooter,
  getElementIcon() {
    return pageEssentialIcon("panel-bottom");
  },
};

export { TemelSiteFooter };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 7,
    label: "Site Footer",
    description:
      "The site's closing band: an optional invitation, navigation groups, identity, and credits.",
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
    order: ["eyebrow", "heading", "summary", "actions", "note", "links", "brand", "colophon"],
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
      actions: {
        kind: "element",
        label: "Actions",
        description: "The next step for the reader.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-action-group"],
      },
      note: {
        kind: "text",
        label: "Note",
        description: "A short line of context below the action.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 300,
        inlineEditable: true,
      },
      links: {
        kind: "element",
        label: "Navigation groups",
        description: "One or more labelled groups of links, such as the site's languages.",
        minItems: 0,
        maxItems: null,
        allowedTags: ["temel-language-selector", "temel-site-nav"],
      },
      brand: {
        kind: "element",
        label: "Brand",
        description: "The site identity.",
        minItems: 0,
        maxItems: 1,
        allowedTags: ["temel-site-brand"],
      },
      colophon: {
        kind: "text",
        label: "Colophon",
        description: "Credits, copyright, or other closing information.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 500,
        inlineEditable: true,
      },
    },
  },
});
