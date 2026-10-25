/**
 * Build an owned HTML node without parsing markup.
 * @param {string} tag
 * @param {Record<string, string>} attributes
 * @param {(Node | string)[]} children
 * @returns {HTMLElement}
 */
export function node(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  element.append(...children);
  return element;
}

/**
 * Build an inert native layout from owned DOM nodes.
 * @param {...Node} children
 * @returns {HTMLTemplateElement}
 */
export function layoutTemplate(...children) {
  const template = document.createElement("template");
  template.content.append(...children);
  return template;
}

/**
 * Build an owned SVG node.
 * @param {string} tag
 * @param {Record<string, string>} attributes
 * @param {Node[]} children
 * @returns {SVGElement}
 */
export function svgNode(tag, attributes = {}, children = []) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  element.append(...children);
  return element;
}
