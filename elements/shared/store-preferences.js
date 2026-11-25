const CART_KEY = "yuva.cart.v1";
const CURRENCY_KEY = "yuva.currency.v1";
export const CURRENCIES = Object.freeze(["eur", "usd", "chf"]);

/** @typedef {{path: string, quantity: number}} CartItem */

/** Validate untrusted browser preferences before using them. @returns {CartItem[]} */
export function readCart() {
  const stored = localStorage.getItem(CART_KEY);
  if (stored === null) return [];
  let items;
  try {
    items = JSON.parse(stored);
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
  if (!Array.isArray(items) || !isCart(items)) {
    localStorage.removeItem(CART_KEY);
    return [];
  }
  return items;
}

/** @param {unknown[]} items */
function isCart(items) {
  const paths = new Set();
  let total = 0;
  for (const item of items) {
    if (!item || typeof item !== "object") return false;
    const { path, quantity } = item;
    if (
      typeof path !== "string" ||
      !/^\/products\/[a-z-]+\/[a-z0-9]+(?:-[a-z0-9]+)*\.html$/u.test(path)
    )
      return false;
    if (!Number.isSafeInteger(quantity) || quantity < 1 || paths.has(path)) return false;
    paths.add(path);
    total += quantity;
    if (!Number.isSafeInteger(total)) return false;
  }
  return true;
}

/** @param {(items: CartItem[]) => CartItem[]} change */
export async function changeCart(change) {
  if (!navigator.locks) {
    throw new Error("Cart updates require browser lock support (navigator.locks).");
  }
  await navigator.locks.request("yuva-cart", function writeCart() {
    const items = change(readCart());
    if (!isCart(items))
      throw new Error(
        "Cart products must use .html URLs and quantities must remain positive safe integers.",
      );
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("cart-change"));
  });
}

/** @param {string} path */
export async function addProduct(path) {
  await changeCart(function add(items) {
    const item = items.find((entry) => entry.path === path);
    if (item) item.quantity += 1;
    else items.push({ path, quantity: 1 });
    return items;
  });
}

/** @param {string} path @param {number} quantity */
export async function setQuantity(path, quantity) {
  await changeCart(function replace(items) {
    return items.flatMap(function updateItem(item) {
      if (item.path !== path) return [item];
      return quantity === 0 ? [] : [{ path, quantity }];
    });
  });
}

/** Apply a relative control change to the latest quantity while holding the shared cart lock.
 * @param {string} path @param {number} delta */
export async function changeQuantity(path, delta) {
  await changeCart(function increment(items) {
    return items.map((item) =>
      item.path === path ? { path, quantity: item.quantity + delta } : item,
    );
  });
}

/** Whether prices leave the visitor's stored choice aside, as they do in the Editor. */
let isStoredCurrencyIgnored = false;

/**
 * Show every price in the currency of its content's region, never in a stored choice. Authoring
 * modules call it, so in the Editor a page shows the currency its region's visitors first see,
 * whatever currency the author picked as a visitor.
 */
export function ignoreStoredCurrency() {
  isStoredCurrencyIgnored = true;
}

/**
 * Current visitor preference, independent of an audience: the currency they chose, otherwise that
 * of the region of the content showing `element`. A language that names no region has its default
 * locale, CLDR's likely region for it, so French and German pages show EUR, Swiss pages CHF, and
 * English pages USD.
 * @param {Element} element the element that shows the price
 * @returns {string}
 */
export function readCurrency(element) {
  try {
    const stored = isStoredCurrencyIgnored ? null : localStorage.getItem(CURRENCY_KEY);
    if (stored !== null && CURRENCIES.includes(stored)) return stored;
    if (stored !== null) localStorage.removeItem(CURRENCY_KEY);
  } catch {}
  return regionCurrency(safeLocaleRegion(contentLanguage(element)));
}

/** @param {string} language */
function safeLocaleRegion(language) {
  for (const candidate of [language, navigator.language, "en"]) {
    if (!candidate) continue;
    try {
      return new Intl.Locale(candidate).maximize().region;
    } catch {}
  }
  return undefined;
}

/**
 * The currency the store prices a region in: USD in the United States, CHF in Switzerland and
 * Liechtenstein, and EUR everywhere else.
 * @param {string | undefined} region
 */
function regionCurrency(region) {
  if (region === "US") return "usd";
  if (region === "CH" || region === "LI") return "chf";
  return "eur";
}

/**
 * The language of the content showing `element`: its nearest `lang`, through the shadow roots it
 * sits in. Delivery declares it on the page's root element, and the Editor on the content it shows,
 * because the Editor's own document is in the Editor's language.
 * @param {Element} element
 */
function contentLanguage(element) {
  /** @type {Element | null} */
  let current = element;
  while (current !== null) {
    const lang = current.closest("[lang]")?.getAttribute("lang");
    if (lang) return lang;
    const root = current.getRootNode();
    current = root instanceof ShadowRoot ? root.host : null;
  }
  return navigator.language;
}

/** @param {string} currency */
export function setCurrency(currency) {
  if (!CURRENCIES.includes(currency)) throw new Error("Select EUR, USD, or CHF.");
  localStorage.setItem(CURRENCY_KEY, currency);
  document.dispatchEvent(new CustomEvent("currency-change"));
}

/**
 * @param {number} amount @param {string} currency
 * @param {Element} element the element that shows the amount
 */
export function money(amount, currency, element) {
  const options = {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  };
  for (const candidate of [contentLanguage(element), navigator.language, "en"]) {
    if (!candidate) continue;
    try {
      return new Intl.NumberFormat(candidate, options).format(amount);
    } catch {}
  }
  return `${currency.toUpperCase()} ${amount}`;
}
