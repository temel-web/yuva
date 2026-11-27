import { YuvaKineticMarquee } from "./yuva-kinetic-marquee.js";
import {
  createAuthorContract,
  enumAttribute,
} from "./shared/store-schema.author.js";

YuvaKineticMarquee.temel = createAuthorContract({
  tag: "yuva-kinetic-marquee",
  label: "Kinetic Swiss marquee",
  description:
    "Continuous Swiss Brutalist kinetic ticker band powered by AnimationController with hover deceleration and reduced-motion freeze.",
  attributes: {
    emphasis: enumAttribute("Surface emphasis", ["signal", "ink", "paper"], "signal"),
    speed: enumAttribute("Scroll speed", ["slow", "normal", "fast"], "normal"),
    direction: enumAttribute("Scroll direction", ["left", "right"], "left"),
  },
  slots: {
    default: {
      kind: "text",
      label: "Ticker phrase",
      description: "Repeating Swiss headline phrase carried across the band.",
      format: "plain",
      minCharacters: 0,
      maxCharacters: 200,
      inlineEditable: true,
    },
  },
});

export { YuvaKineticMarquee };
