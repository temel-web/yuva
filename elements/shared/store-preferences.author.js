import { ignoreStoredCurrency } from "./store-preferences.js";

// The Editor loads authoring modules and delivered pages never do: on the canvas, a price shows the
// currency of its page's region, not a currency the author chose while browsing as a visitor.
ignoreStoredCurrency();
