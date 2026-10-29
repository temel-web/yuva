import { LivingPaper } from "./living-paper.js";

const authorSchema = Object.freeze({
  schemaVersion: 1,
  element: {
    logicVersion: 3,
    label: "Living Paper",
    description:
      "A gently floating paper composition with lavender ribbons, orbital lines, and editable text.",
    category: "Animated artwork",
    contentTypes: ["media"],
    allowBlank: true,
    isNewFileTemplate: false,
  },
  attributes: {},
  slots: {
    order: ["default", "eyebrow", "body", "annotation", "caption"],
    configs: {
      default: {
        kind: "text",
        label: "Heading",
        format: "rte-inline-v1",
        inlineEditable: true,
        minCharacters: 0,
        maxCharacters: null,
      },
      eyebrow: {
        kind: "text",
        label: "Eyebrow",
        format: "rte-inline-v1",
        inlineEditable: true,
        minCharacters: 0,
        maxCharacters: null,
      },
      body: {
        kind: "text",
        label: "Body",
        format: "rte-inline-v1",
        inlineEditable: true,
        minCharacters: 0,
        maxCharacters: null,
      },
      annotation: {
        kind: "text",
        label: "Annotation",
        format: "rte-inline-v1",
        inlineEditable: true,
        minCharacters: 0,
        maxCharacters: null,
      },
      caption: {
        kind: "text",
        label: "Caption",
        format: "rte-inline-v1",
        inlineEditable: true,
        minCharacters: 0,
        maxCharacters: null,
      },
    },
  },
});

function createLivingPaper() {
  const element = document.createElement("living-paper");
  for (const [slot, tag] of [
    ["", "h2"],
    ["eyebrow", "span"],
    ["body", "p"],
    ["annotation", "span"],
    ["caption", "span"],
  ]) {
    const value = document.createElement(tag);
    if (slot) value.slot = slot;
    element.append(value);
  }
  return element;
}

LivingPaper.temel = {
  getSchema() {
    return authorSchema;
  },
  create: createLivingPaper,
};

export { LivingPaper };
