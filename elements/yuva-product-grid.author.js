import { YuvaProductGrid } from "./yuva-product-grid.js";
import { createAuthorContract, textSlot, elementSlot } from "./shared/store-schema.author.js";
import "./yuva-product-card.author.js";
YuvaProductGrid.temel = createAuthorContract({
  tag: "yuva-product-grid",
  logicVersion: 8,
  label: "Product grid",
  description: "A responsive collection of product cards.",
  attributes: {
    columns: {
      type: "enum",
      presence: "optional",
      label: "Maximum columns",
      description: "The most products side by side; narrower spaces show fewer columns.",
      options: ["3", "4"],
      default: "4",
    },
  },
  slots: {
    default: elementSlot("Products", ["yuva-product-card", "temel-query"], null),
    heading: textSlot("Heading", "rte-document-v1"),
    summary: textSlot("Introduction", "rte-document-v1"),
  },
});
export { YuvaProductGrid };
