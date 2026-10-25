import { YuvaCurrencySwitcher } from "./yuva-currency-switcher.js";
import {
  createAuthorContract,
  textSlot,
} from "./shared/store-schema.author.js";
YuvaCurrencySwitcher.temel = createAuthorContract({
  tag: "yuva-currency-switcher",
  logicVersion: 2,
  label: "Currency switcher",
  description: "The visitor's choice of EUR, USD, or CHF.",
  slots: {
    label: textSlot("Accessible group name"),
    eur: textSlot("EUR label"),
    usd: textSlot("USD label"),
    chf: textSlot("CHF label"),
  },
});
export { YuvaCurrencySwitcher };
