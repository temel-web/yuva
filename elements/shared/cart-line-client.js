import { authoringHtmlSafetyIssue } from "/@/runtime/authoring-html-values.js";
import { languagePath } from "/@/runtime/language-paths.js";
import "/@/runtime/temel-picture.js";
import { getReferences } from "../yuva-cart-line.js";

const PRODUCT_TIMEOUT_MS = 15_000;
const MAX_PRODUCT_SIZE_BYTES = 262_144;
const DISALLOWED_ELEMENTS =
  "script, iframe, style, link, meta, base, template, temel-reference, svg, math, form, input, button, textarea, select, video, audio, area, object, embed, portal";
const URL_ATTRIBUTES = new Set([
  "action",
  "data",
  "formaction",
  "href",
  "ping",
  "poster",
  "src",
  "xlink:href",
]);
const OBJECT_POSITION_PATTERN = /^object-position\s*:\s*[a-z0-9.%\s+-]+\s*;?$/iu;
/** The tag a product's h1 takes in a line, as in a field Temel projects into a card. */
const DEFAULT_LINE_HEADING_TAG = "h3";
const MAIN_HEADING_SELECTOR = 'h1, [role="heading"][aria-level="1"]';

/** Read a saved product's resolved elements without executing its page or loading its modules.
 * @param {string} path @param {Document} ownerDocument @param {AbortSignal} signal
 * @returns {Promise<HTMLElement>} */
export async function fetchCartLine(path, ownerDocument, signal) {
  // The cart keeps the product's identity; its page is read in the cart page's language.
  const fragmentPath = languagePath(path, ownerDocument).replace(
    /\.html$/u,
    ".e.html",
  );
  const productDocument = await readProductDocument(fragmentPath, signal);
  const content = productCartContent(productDocument, path);
  signal.throwIfAborted();
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
  return new DOMParser().parseFromString(html, "text/html");
}

/** Copy direct product fields from a resolved fragment.
 * @param {Document} productDocument @param {string} path */
function productCartContent(productDocument, path) {
  const products = productDocument.querySelectorAll(
    "body > temel-elements > yuva-product",
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
  const { fields, headingTag = DEFAULT_LINE_HEADING_TAG } =
    getReferences().source;
  // Keep selected content inert until the transport checks pass.
  const content = productDocument.createElement("yuva-cart-line");
  for (const child of product.children) {
    const field = child.getAttribute("slot") ?? "";
    const sourceField = field.replace(/^provenance:/u, "").split("@")[0];
    if (fields.includes(sourceField)) {
      content.append(child.cloneNode(true));
    }
  }
  demoteMainHeadings(content, headingTag);
  inspectProductContent(content);
  return content;
}

/** A product's main heading is not the cart page's: its copy takes the line's heading tag.
 * @param {Element} content @param {string} headingTag */
function demoteMainHeadings(content, headingTag) {
  for (const heading of content.querySelectorAll(MAIN_HEADING_SELECTOR)) {
    const copy = content.ownerDocument.createElement(headingTag);
    for (const { name, value } of heading.attributes) {
      if (name !== "role" && name !== "aria-level") {
        copy.setAttribute(name, value);
      }
    }
    copy.append(...heading.childNodes);
    heading.replaceWith(copy);
  }
}

/** Validate selected product fields before importing them into the live document.
 * @param {Element} content */
function inspectProductContent(content) {
  if (
    authoringHtmlSafetyIssue(content.outerHTML) ||
    content.querySelector(DISALLOWED_ELEMENTS)
  ) {
    throw productError(
      "cart_product_invalid",
      "Product fields contain executable content.",
    );
  }
  for (const element of [content, ...content.querySelectorAll("*")]) {
    for (const attribute of element.attributes) {
      inspectProductAttribute(attribute);
    }
  }
}

/** @param {Attr} attribute */
function inspectProductAttribute(attribute) {
  const name = attribute.name.toLowerCase();
  if (name.startsWith("on")) {
    throw productError(
      "cart_product_invalid",
      "Product fields contain an event handler.",
    );
  }
  if (name === "id" || name === "name") {
    throw productError(
      "cart_product_invalid",
      "Product fields must not declare global id or name attributes.",
    );
  }
  if (name === "style" && !OBJECT_POSITION_PATTERN.test(attribute.value.trim())) {
    throw productError(
      "cart_product_invalid",
      "Product fields contain an unsupported inline style.",
    );
  }
  if (URL_ATTRIBUTES.has(name)) {
    inspectResourceUrl(attribute.value);
  }
  if (name === "srcset" || name === "imagesrcset") {
    for (const candidate of attribute.value.split(",")) {
      inspectResourceUrl(candidate.trim().split(/\s+/u)[0]);
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
