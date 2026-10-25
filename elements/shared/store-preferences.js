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

/** Current visitor preference, independent of an audience. @returns {string} */
export function readCurrency() {
  const stored = localStorage.getItem(CURRENCY_KEY);
  if (stored !== null && CURRENCIES.includes(stored)) return stored;
  if (stored !== null) localStorage.removeItem(CURRENCY_KEY);
  const region = new Intl.Locale(navigator.language).region;
  if (region === "US") return "usd";
  if (region === "CH") return "chf";
  return "eur";
}

/** @param {string} currency */
export function setCurrency(currency) {
  if (!CURRENCIES.includes(currency)) throw new Error("Select EUR, USD, or CHF.");
  localStorage.setItem(CURRENCY_KEY, currency);
  document.dispatchEvent(new CustomEvent("currency-change"));
}

/** @param {number} amount @param {string} currency */
export function money(amount, currency) {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);
}
