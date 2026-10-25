import { html } from "/@/vendor/lit/index.js";

/**
 * Build editable starter DOM without parsing HTML or adding runtime defaults.
 * @param {string} tagName
 * @param {(Node | string)[]} children
 * @param {Record<string, string>} [attributes]
 * @returns {HTMLElement}
 */
export function createAuthorElement(tagName, children, attributes = {}) {
  const element = document.createElement(tagName);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  element.append(...children);
  return element;
}

/**
 * Starter introduction for a block: an eyebrow, a heading, and a summary document.
 * @param {{eyebrow: string, heading: string, summary: string[], headingTag?: string}} copy
 * @returns {HTMLElement[]}
 */
export function createIntroduction({ eyebrow, heading, summary, headingTag = "h2" }) {
  return [
    createAuthorElement("span", [eyebrow], { slot: "eyebrow" }),
    createAuthorElement(headingTag, [heading], { slot: "heading" }),
    createDocument("summary", summary),
  ];
}

/**
 * One rich-text document Slot value: paragraphs inside a stable `div`.
 * @param {string} slot
 * @param {string[]} paragraphs
 */
export function createDocument(slot, paragraphs) {
  return createAuthorElement(
    "div",
    paragraphs.map((text) => createAuthorElement("p", [text])),
    { slot },
  );
}

/**
 * An Action Group of starter links; the first carries the primary emphasis.
 * @param {string[]} labels
 * @param {Record<string, string>} [attributes]
 */
export function createActions(labels, attributes = {}) {
  return createAuthorElement(
    "temel-action-group",
    labels.map((label) => createAuthorElement("a", [label], { href: "/" })),
    { emphasis: "primary-first", slot: "actions", ...attributes },
  );
}

/** @param {string} iconName */
export function pageEssentialIcon(iconName) {
  return html`<temel-icon name=${iconName}></temel-icon>`;
}
