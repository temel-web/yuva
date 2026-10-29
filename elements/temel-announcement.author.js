import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelAnnouncement } from "./temel-announcement.js";

/** Create a one-line notice with a link and the dismiss label. */
export function createAnnouncement() {
  return createAuthorElement("temel-announcement", [
    createAuthorElement(
      "p",
      [
        "Our spring opening hours are here. ",
        createAuthorElement("a", ["See what changed"], { href: "/" }),
      ],
      { slot: "text" },
    ),
  ]);
}

/** @type {typeof TemelAnnouncement & {temel: Record<string, any>}} */ (TemelAnnouncement).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createAnnouncement,
  getElementIcon() {
    return pageEssentialIcon("bell");
  },
};

export { TemelAnnouncement };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 6,
    label: "Announcement",
    description:
      "A short site-wide notice band that visitors can dismiss for the current page view.",
    category: "site-navigation",
    allowBlank: true,
  },
  attributes: {
    "spacing-before": {
      type: "enum",
      presence: "optional",
      label: "Top spacing",
      description: "Space above the announcement, outside its background.",
      options: ["none", "compact", "comfortable", "spacious"],
      default: "none",
    },
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
    tone: {
      type: "enum",
      presence: "optional",
      label: "Tone",
      description:
        "Paint the band with the strong accent, a soft accent tint, or a quiet neutral panel.",
      options: ["accent", "subtle", "muted"],
      default: "accent",
    },
    alignment: {
      type: "enum",
      presence: "optional",
      label: "Alignment",
      description: "Align the notice with the content edge or center it.",
      options: ["start", "center"],
      default: "start",
    },
  },
  slots: {
    order: ["text", "dismiss-label"],
    configs: {
      text: {
        kind: "text",
        label: "Message",
        description: "The notice, optionally with a link.",
        format: "rte-inline-v1",
        minCharacters: 0,
        maxCharacters: 300,
        inlineEditable: true,
      },
      "dismiss-label": {
        isTemplatable: true,
        kind: "text",
        label: "Dismiss label",
        description: "The visible name of the button that hides the notice.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 40,
        inlineEditable: true,
      },
    },
  },
});
