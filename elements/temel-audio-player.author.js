import {
  createAuthorElement,
  pageEssentialIcon,
} from "./page-essentials/page-essentials-author-support.author.js";
import { TemelAudioPlayer } from "./temel-audio-player.js";

/** Create a titled player with listening notes; the author chooses the recording. */
export function createAudioPlayer() {
  return createAuthorElement("temel-audio-player", [
    createAuthorElement("h3", ["Listen to the story"], { slot: "heading" }),
    createAuthorElement("div", [
      createAuthorElement("p", [
        "Add a recording, then describe it here with a transcript, credits, or a download link.",
      ]),
    ]),
  ]);
}

/** @type {typeof TemelAudioPlayer & {temel: Record<string, any>}} */ (
  TemelAudioPlayer
).temel = {
  getSchema() {
    return authorSchema;
  },
  create: createAudioPlayer,
  getElementIcon() {
    return pageEssentialIcon("play");
  },
};

export { TemelAudioPlayer };

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 4,
    label: "Audio Player",
    description:
      "Browser-native audio playback with an authored title and listening notes.",
    category: "features-storytelling",
    allowBlank: true,
  },
  attributes: {
    src: {
      type: "text",
      presence: "optional",
      semantic: "resource",
      label: "Audio source",
      description:
        "The URL of the recording. Native controls provide playback, seeking, and volume.",
    },
  },
  slots: {
    order: ["heading", "default"],
    configs: {
      heading: {
        kind: "text",
        label: "Title",
        description:
          "The visible name of the recording, which also names the player.",
        format: "plain",
        minCharacters: 0,
        maxCharacters: 300,
        inlineEditable: true,
      },
      default: {
        kind: "text",
        label: "Listening notes",
        description:
          "A description or transcript, credits, and download links.",
        format: "rte-document-v1",
        minCharacters: 0,
        maxCharacters: null,
        inlineEditable: true,
      },
    },
  },
});
