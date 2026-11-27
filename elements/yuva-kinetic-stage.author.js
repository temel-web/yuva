import { YuvaKineticStage } from "./yuva-kinetic-stage.js";
import {
  createAuthorContract,
  elementSlot,
  enumAttribute,
} from "./shared/store-schema.author.js";

/** @param {string} label @param {string} description @param {number | null} maxCharacters @param {string} [format] */
function stageTextSlot(label, description, maxCharacters, format = "plain") {
  return {
    kind: "text",
    label,
    description,
    format,
    minCharacters: 0,
    maxCharacters,
    inlineEditable: true,
  };
}

YuvaKineticStage.temel = createAuthorContract({
  tag: "yuva-kinetic-stage",
  label: "Kinetic Swiss stage",
  description:
    "Full-width Swiss Brutalist hero pairing monumental display copy with an animated geometric artwork driven by AnimationController.",
  attributes: {
    tempo: enumAttribute("Motion tempo", ["measured", "brisk", "hyper"], "brisk"),
    grid: enumAttribute("Grid density", ["dense", "sparse"], "dense"),
  },
  slots: {
    meta: stageTextSlot(
      "Index strip",
      "Short Swiss issue or date line above the display heading.",
      120,
    ),
    heading: stageTextSlot(
      "Heading",
      "Primary campaign display headline.",
      120,
    ),
    summary: stageTextSlot(
      "Summary",
      "Supporting copy below the headline.",
      null,
      "rte-document-v1",
    ),
    actions: elementSlot("Actions", ["temel-action-group"], 1),
  },
});

export { YuvaKineticStage };
