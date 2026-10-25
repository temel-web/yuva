import { authoringHtmlSafetyIssue } from "/@/runtime/authoring-html-values.js";
import { languagePath } from "/@/runtime/language-paths.js";
import "/@/runtime/temel-picture.js";
import { getReferences } from "../yuva-cart-line.js";

const PRODUCT_TIMEOUT_MS = 15_000;
const MAX_PRODUCT_SIZE_BYTES = 262_144;

/** Read a saved product's HTML without executing its page or loading its modules.
 * @param {string} path @param {Document} ownerDocument @param {AbortSignal} signal
 * @returns {Promise<HTMLElement>} */
export async function fetchCartLine(path, ownerDocument, signal) {
  // The cart keeps the product's identity; its page is read in the cart page's language.
  const productDocument = await readProductDocument(languagePath(path, ownerDocument), signal);
  const content = productCartContent(productDocument, path);
  await resolveProductImage(content, signal);
  signal.throwIfAborted();
  inspectProductContent(content);
  const line = ownerDocument.createElement("yuva-cart-line");
  line.append(
    ...Array.from(content.childNodes, (child) =>
      ownerDocument.importNode(child, true),
    ),
  );
  return line;
}

/** @param {string} path @param {AbortSignal} signal */
async function readProductDocument(path, signal) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { accept: "text/html" },
    redirect: "error",
    signal: AbortSignal.any([signal, AbortSignal.timeout(PRODUCT_TIMEOUT_MS)]),
  });
  if ([404, 410].includes(response.status)) {
    throw productError(
      "cart_product_missing",
      "The saved product is unavailable.",
    );
  }
  if (!response.ok) {
    throw productError(
      "cart_request_failed",
      `Product request returned HTTP ${response.status}.`,
    );
  }
  if (!response.headers.get("content-type")?.includes("text/html")) {
    throw productError(
      "cart_product_invalid",
      "Product documents must return text/html.",
    );
  }
  const html = await response.text();
  if (new TextEncoder().encode(html).byteLength > MAX_PRODUCT_SIZE_BYTES) {
    throw productError(
      "cart_product_invalid",
      "Product document exceeds its response-size limit.",
    );
  }
  signal.throwIfAborted();
  const productDocument = new DOMParser().parseFromString(html, "text/html");
  // Read delivered content in this inert document without running the page loader.
  for (const template of /** @type {NodeListOf<HTMLTemplateElement>} */ (
    productDocument.body.querySelectorAll("template[data-deferred-content]")
  )) {
    template.replaceWith(template.content);
  }
  return productDocument;
}

/** Copy direct product fields from an authored fragment or a delivered page.
 * @param {Document} productDocument @param {string} path */
function productCartContent(productDocument, path) {
  const products = productDocument.querySelectorAll(
    "body > temel-elements > yuva-product, body > main > yuva-product",
  );
  const product = products[0];
  if (
    products.length !== 1 ||
    product
      .querySelector(':scope > data[slot="path"]')
      ?.getAttribute("value") !== path
  ) {
    throw productError(
      "cart_product_invalid",
      "Product document has no matching product.",
    );
  }
  const fields = getReferences().source.fields;
  // Keep selected content inert until the transport checks pass.
  const content = productDocument.createElement("yuva-cart-line");
  for (const child of product.children) {
    const field = child.getAttribute("slot") ?? "";
    const sourceField = field.replace(/^provenance:/u, "").split("@")[0];
    if (fields.includes(sourceField)) {
      content.append(child.cloneNode(true));
    }
  }
  inspectProductContent(content);
  return content;
}

/** Resolve the canonical web-image asset when reading an unexpanded authored product.
 * @param {Element} content @param {AbortSignal} signal */
async function resolveProductImage(content, signal) {
  const image = content.querySelector(':scope > temel-picture[slot="image"]');
  const src = image?.getAttribute("src");
  if (!src || image.querySelector(":scope > picture")) return;
  const imageDocument = await readProductDocument(src, signal);
  const picture = imageDocument.querySelector("body > picture");
  if (!picture) {
    throw productError(
      "cart_product_invalid",
      "The product web image has no picture.",
    );
  }
  const clone = picture.cloneNode(true);
  image.append(clone);
  const img = image.querySelector("picture > img");
  for (const name of ["alt", "loading"]) {
    if (img && image.hasAttribute(name))
      img.setAttribute(name, image.getAttribute(name));
  }
}

/** Validate selected product fields before importing them into the live document.
 * @param {Element} content */
function inspectProductContent(content) {
  if (
    authoringHtmlSafetyIssue(content.outerHTML) ||
    content.querySelector(
      "script, iframe, style, link, meta, base, template, temel-reference",
    )
  ) {
    throw productError(
      "cart_product_invalid",
      "Product fields contain executable content.",
    );
  }
  for (const element of [content, ...content.querySelectorAll("*")]) {
    for (const attribute of element.attributes) {
      if (/^on/iu.test(attribute.name)) {
        throw productError(
          "cart_product_invalid",
          "Product fields contain an event handler.",
        );
      }
      if (["src", "href", "poster"].includes(attribute.name)) {
        inspectResourceUrl(attribute.value);
      }
      if (attribute.name === "srcset") {
        for (const candidate of attribute.value.split(",")) {
          inspectResourceUrl(candidate.trim().split(/\s+/u)[0]);
        }
      }
    }
  }
}

/** @param {string} value */
function inspectResourceUrl(value) {
  if (!/^\/(?!\/)[a-z0-9/-]+(?:\.[a-z0-9]+)*$/u.test(value)) {
    throw productError(
      "cart_product_invalid",
      "Product fields have an invalid resource URL.",
    );
  }
}

/** @param {string} code @param {string} message */
function productError(code, message) {
  return Object.assign(new Error(message), { code });
}
