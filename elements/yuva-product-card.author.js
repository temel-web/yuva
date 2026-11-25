import { YuvaProductCard, getReferences } from "./yuva-product-card.js";
import {
  createAuthorContract,
  productSlots,
  referenceSlot,
  elementSlot,
  textSlot,
} from "./shared/store-schema.author.js";
import "./yuva-add-to-cart.author.js";
import "./shared/store-preferences.author.js";
const productSlotsByName = productSlots();
YuvaProductCard.temel = createAuthorContract({
  tag: "yuva-product-card",
  logicVersion: 18,
  label: "Product card",
  description: "A reference to one product, displayed as a shopping card.",
  getReferences,
  slots: {
    source: referenceSlot("Product source"),
    brand: productSlotsByName.brand,
    category: productSlotsByName.category,
    title: productSlotsByName.title,
    image: productSlotsByName.image,
    ...productSlotsByName,
    "display-name": textSlot("Display name"),
    action: elementSlot("Cart action", ["yuva-add-to-cart"]),
  },
});
export { YuvaProductCard, getReferences };
