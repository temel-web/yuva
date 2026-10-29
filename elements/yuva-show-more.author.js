import { YuvaShowMore } from "./yuva-show-more.js";
import {
  createAuthorContract,
  textSlot,
} from "./shared/store-schema.author.js";
YuvaShowMore.temel = createAuthorContract({
  tag: "yuva-show-more",
  logicVersion: 1,
  label: "Show more",
  description:
    "A button that shows the next products of the query that contains it.",
  attributes: {},
  slots: {
    default: textSlot("Button label"),
    error: textSlot("Error"),
  },
});
export { YuvaShowMore };
