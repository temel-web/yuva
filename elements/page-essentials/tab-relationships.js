const RELATIONSHIP_ATTRIBUTES = Object.freeze([
  "id",
  "role",
  "aria-controls",
  "aria-owns",
  "aria-selected",
  "aria-labelledby",
  "aria-label",
  "aria-orientation",
  "tabindex",
  "data-state",
]);

/** Retain authored attributes while connected tabs own their accessible relationships. */
export class TabRelationships {
  /** @type {Map<Element, [string, string | null][]>} */
  #attributesByElement = new Map();

  /** @param {Element} element */
  remember(element) {
    if (this.#attributesByElement.has(element)) return;
    this.#attributesByElement.set(
      element,
      RELATIONSHIP_ATTRIBUTES.map((name) => [name, element.getAttribute(name)]),
    );
  }

  /** Restore one authored attribute before applying the current tab state. */
  restoreAttribute(element, name) {
    const [, value] = this.#attributesByElement
      .get(element)
      .find(([attributeName]) => attributeName === name);
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }

  /** Restore every remembered element that is no longer part of the tab group. */
  restoreExcept(elements) {
    const retained = new Set(elements);
    for (const [element, attributes] of this.#attributesByElement) {
      if (retained.has(element)) continue;
      for (const [name, value] of attributes) {
        if (value === null) element.removeAttribute(name);
        else element.setAttribute(name, value);
      }
      this.#attributesByElement.delete(element);
    }
  }
}
