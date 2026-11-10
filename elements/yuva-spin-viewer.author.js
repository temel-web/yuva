import { YuvaSpinViewer } from "./yuva-spin-viewer.js";
import {
  createAuthorContract,
  textSlot,
} from "./shared/store-schema.author.js";
YuvaSpinViewer.temel = createAuthorContract({
  tag: "yuva-spin-viewer",
  logicVersion: 2,
  label: "360° viewer",
  description:
    "A lazy product turntable supporting drag, arrows, and reduced motion.",
  attributes: {
    src: {
      type: "text",
      presence: "optional",
      label: "Spin atlas",
      description: "Root-relative WebP atlas with 36 frames.",
      semantic: "resource",
    },
  },
  slots: {
    default: textSlot("Description and instructions"),
    previous: textSlot("Previous frame"),
    next: textSlot("Next frame"),
    pause: textSlot("Pause"),
    play: textSlot("Play"),
    loading: textSlot("Loading"),
    error: textSlot("Load error"),
  },
});
export { YuvaSpinViewer };
