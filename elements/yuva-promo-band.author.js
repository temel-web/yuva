import { YuvaPromoBand } from "./yuva-promo-band.js";
import {
  createAuthorContract,
  textSlot,
  enumAttribute,
} from "./shared/store-schema.author.js";
YuvaPromoBand.temel = createAuthorContract({
  tag: "yuva-promo-band",
  label: "Promo band",
  description: "A short message with audience-specific content.",
  attributes: {
    visibility: enumAttribute("Visibility", ["all", "returning"], "all"),
  },
  slots: {
    heading: textSlot("Heading", "rte-document-v1"),
    summary: textSlot("Message", "rte-document-v1"),
    action: textSlot("Action", "rte-inline-v1"),
  },
});
export { YuvaPromoBand };
