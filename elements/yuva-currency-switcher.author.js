import { YuvaCurrencySwitcher } from "./yuva-currency-switcher.js";
import { createAuthorContract, textSlot } from "./shared/store-schema.author.js";
import "./shared/store-preferences.author.js";

YuvaCurrencySwitcher.temel = createAuthorContract({
  tag: "yuva-currency-switcher",
  logicVersion: 3,
  label: "Currency switcher",
  description: "The visitor's choice of EUR, USD, or CHF in a compact dropdown.",
  slots: {
    label: textSlot("Currency menu label"),
    eur: textSlot("EUR label"),
    usd: textSlot("USD label"),
    chf: textSlot("CHF label"),
  },
  states: {
    order: ["default", "open"],
    configs: {
      default: { label: "Closed" },
      open: { label: "Open", slots: ["chf", "eur", "label", "usd"] },
    },
  },
  presentState(element, state) {
    element.presentState(state);
  },
});
export { YuvaCurrencySwitcher };
