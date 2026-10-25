import { YuvaCartLink } from "./yuva-cart-link.js";
import { createAuthorContract, textSlot } from "./shared/store-schema.author.js";
YuvaCartLink.temel = createAuthorContract({
  tag: "yuva-cart-link",
  logicVersion: 3,
  label: "Cart link",
  description:
    "A bag-shaped cart destination with a plain live count and full accessible quantity.",
  attributes: {
    href: {
      type: "text",
      presence: "optional",
      label: "Cart destination",
      description: "Root-relative cart page URL.",
    },
  },
  slots: { default: textSlot("Link label") },
});
export { YuvaCartLink };
