import { YuvaCartLine, getReferences } from "./yuva-cart-line.js";
import {
  createAuthorContract,
  productSlots,
  referenceSlot,
  textSlot,
} from "./shared/store-schema.author.js";
import "./shared/store-preferences.author.js";
YuvaCartLine.temel = createAuthorContract({
  tag: "yuva-cart-line",
  logicVersion: 10,
  label: "Cart line",
  description: "One product reference with quantity and removal controls.",
  getReferences,
  slots: {
    source: referenceSlot("Product source"),
    ...productSlots(),
    "display-name": textSlot("Display name"),
    quantity: textSlot("Quantity label"),
    increase: textSlot("Increase"),
    decrease: textSlot("Decrease"),
    remove: textSlot("Remove"),
    updated: textSlot("Confirmation"),
    error: textSlot("Error"),
  },
});
export { YuvaCartLine, getReferences };
