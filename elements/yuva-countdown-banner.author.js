import { YuvaCountdownBanner } from "./yuva-countdown-banner.js";
import { createAuthorContract } from "./shared/store-schema.author.js";

/** @param {string} label @param {string} description @param {number} maxCharacters */
function plainTextSlot(label, description, maxCharacters) {
  return {
    kind: "text",
    label,
    description,
    format: "plain",
    minCharacters: 0,
    maxCharacters,
    inlineEditable: true,
  };
}

YuvaCountdownBanner.temel = createAuthorContract({
  tag: "yuva-countdown-banner",
  label: "Countdown banner",
  description: "Display the time remaining until a deadline with an explicit time zone.",
  attributes: {
    deadline: {
      type: "text",
      presence: "optional",
      label: "Deadline",
      description: "ISO 8601 timestamp with seconds and an explicit time zone offset.",
      maxCharacters: 25,
    },
  },
  slots: {
    default: plainTextSlot("Heading", "Short announcement beside the countdown.", 120),
    "deadline-label": plainTextSlot("Deadline label", "Human-readable end time.", 80),
    days: plainTextSlot("Days label", "Label under the days counter.", 16),
    hours: plainTextSlot("Hours label", "Label under the hours counter.", 16),
    minutes: plainTextSlot("Minutes label", "Label under the minutes counter.", 16),
    seconds: plainTextSlot("Seconds label", "Label under the seconds counter.", 16),
  },
});

export { YuvaCountdownBanner };
