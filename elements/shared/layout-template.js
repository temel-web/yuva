/** Native templates for the repository's authored layouts. @param {...Node} children */
export function layoutTemplate(...children) {
  const template = document.createElement("template");
  template.content.append(...children);
  return template;
}

/** Native menu icon nodes. @param {string} tag @param {Record<string, string>} attributes
 * @param {Node[]} children */
export function svgNode(tag, attributes = {}, children = []) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  element.append(...children);
  return element;
}
