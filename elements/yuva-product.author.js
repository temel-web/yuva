import { YuvaProduct } from "./yuva-product.js";
import {
  createAuthorContract,
  productSlots,
  textSlot,
  elementSlot,
  listSlot,
} from "./shared/store-schema.author.js";
import "./yuva-spin-viewer.author.js";
import "./yuva-add-to-cart.author.js";
import "./shared/store-preferences.author.js";
const productSlotsByName = productSlots();
const productAuthor = createAuthorContract({
  tag: "yuva-product",
  label: "Product",
  logicVersion: 23,
  description: "The shared product source and its gallery, facts, prices, and cart action.",
  attributes: {
    "data-item-id": {
      type: "text",
      presence: "optional",
      label: "Source item ID",
      description: "Original dataset item used to rebuild the product's media.",
    },
    "data-product-type": {
      type: "text",
      presence: "optional",
      label: "Source product type",
      description: "Original dataset classification for this product.",
    },
    "data-image-ids": {
      type: "text",
      presence: "optional",
      label: "Source image IDs",
      description: "Space-separated dataset image IDs in photo asset number order.",
    },
    "data-spin-id": {
      type: "text",
      presence: "optional",
      label: "Source spin ID",
      description: "Original dataset turntable used to rebuild the spin atlas.",
    },
  },
  slots: {
    brand: productSlotsByName.brand,
    category: productSlotsByName.category,
    title: productSlotsByName.title,
    "display-name": textSlot("Display name"),
    image: productSlotsByName.image,
    ...productSlotsByName,
    summary: textSlot("Summary", "rte-document-v1"),
    description: textSlot("Details", "rte-document-v1"),
    color: listSlot("Color"),
    material: listSlot("Material"),
    dimensions: textSlot("Dimensions", "rte-document-v1"),
    gallery: elementSlot("Other photos", ["img", "temel-picture"], 3),
    spin: elementSlot("360° viewer", ["yuva-spin-viewer"]),
    "spin-label": textSlot("360° view label"),
    "photos-label": textSlot("Photos label"),
    action: elementSlot("Cart action", ["yuva-add-to-cart"]),
    notice: textSlot("Demonstration notice", "rte-document-v1"),
  },
});
YuvaProduct.temel = {
  ...productAuthor,
  /** Hidden gallery photos load when selected; their web image owns responsive delivery. */
  sanitize(element) {
    for (const image of element.querySelectorAll(':scope > temel-picture[slot="gallery"]')) {
      image.setAttribute("loading", "lazy");
    }
  },
  /** @param {YuvaProduct} element @param {Element} target */
  getSelectionTarget(element, target) {
    const button = target.closest(".thumbnails > button");
    if (!button || button.getRootNode() !== element.shadowRoot) return null;
    return productImages(element)[Number(button.getAttribute("value"))] ?? null;
  },
  /** @param {YuvaProduct} element @param {string} slotName */
  getSlotSelectionTarget(element, slotName) {
    return slotName === "gallery" ? element.shadowRoot.querySelector(".thumbnails") : null;
  },
  /** @param {YuvaProduct} element @param {Element} item */
  getItemSelectionTarget(element, item) {
    const index = productImages(element).indexOf(item);
    if (index < 0) return null;
    return element.shadowRoot.querySelector(`.thumbnails > button[value="${index}"]`);
  },
};

/** @param {YuvaProduct} element */
function productImages(element) {
  return Array.from(
    element.querySelectorAll(
      ":scope > :is(img, temel-picture)[slot=image], :scope > :is(img, temel-picture)[slot=gallery]",
    ),
  );
}
export { YuvaProduct };
