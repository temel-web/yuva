import { YuvaCart } from "./yuva-cart.js";
import { createAuthorContract, textSlot, elementSlot } from "./shared/store-schema.author.js";
import "./yuva-cart-line.author.js";
import "./shared/store-preferences.author.js";
YuvaCart.temel = createAuthorContract({
  tag: "yuva-cart",
  logicVersion: 17,
  label: "Cart",
  description: "Saved products, quantities, and an illustrative subtotal.",
  slots: {
    default: elementSlot("Cart row template", ["yuva-cart-line"]),
    heading: textSlot("Heading", "rte-document-v1"),
    empty: textSlot("Empty message", "rte-document-v1"),
    subtotal: textSlot("Subtotal"),
    "item-label": textSlot("Item column label"),
    "price-label": textSlot("Price column label"),
    "quantity-label": textSlot("Quantity column label"),
    "total-label": textSlot("Total column label"),
    unavailable: textSlot("Unavailable product"),
    loading: textSlot("Loading message"),
    "content-error": textSlot("Product loading error"),
    retry: textSlot("Retry loading"),
    remove: textSlot("Remove unavailable product"),
    error: textSlot("Error"),
    "price-error": textSlot("Price unavailable message"),
    notice: textSlot("Demonstration notice", "rte-document-v1"),
  },
});
export { YuvaCart };
