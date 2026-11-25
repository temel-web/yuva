import { YuvaAddToCart } from "./yuva-add-to-cart.js";
import {
  createAuthorContract,
  textSlot,
  enumAttribute,
} from "./shared/store-schema.author.js";
YuvaAddToCart.temel = createAuthorContract({
  tag: "yuva-add-to-cart",
  logicVersion: 9,
  label: "Add to cart",
  description:
    "A cart command with saving feedback and a dismissible product confirmation.",
  attributes: {
    size: enumAttribute("Size", ["s", "m", "l", "xl", "xxl"], "l"),
    variant: enumAttribute("Variant", ["accent", "outline", "quiet"], "accent"),
    "label-display": enumAttribute("Label", ["visible", "hidden"], "visible"),
    disabled: {
      type: "boolean",
      presence: "optional",
      label: "Disabled",
      description: "Prevent activation of the cart command.",
      default: false,
    },
  },
  slots: {
    default: textSlot("Button label"),
    pending: textSlot("Saving label"),
    added: textSlot("Confirmation"),
    quantity: textSlot("Product quantity label"),
    "view-cart": textSlot("Cart link label"),
    dismiss: textSlot("Continue browsing label"),
    error: textSlot("Error"),
  },
  states: {
    order: ["default", "pending", "added", "error"],
    configs: {
      default: { label: "Ready" },
      pending: { label: "Adding", slots: ["pending"] },
      added: {
        label: "Confirmation",
        slots: ["added", "dismiss", "quantity", "view-cart"],
      },
      error: { label: "Error", slots: ["error"] },
    },
  },
  presentState(element, state) {
    element.status = state === "default" ? "ready" : state;
  },
});
export { YuvaAddToCart };
