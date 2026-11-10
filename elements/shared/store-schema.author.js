/** Authoring factories share field contracts without supplying demonstration content. */
export function textSlot(label, format = "plain") {
  return {
    kind: "text",
    label,
    format,
    minCharacters: 0,
    maxCharacters: null,
    inlineEditable: true,
    isTemplatable: true,
  };
}

export function elementSlot(label, allowedTags, maxItems = 1) {
  return {
    kind: "element",
    label,
    allowedTags: [...allowedTags].sort(),
    minItems: 0,
    maxItems,
    isTemplatable: true,
  };
}

export function listSlot(label) {
  return { ...elementSlot(label, ["data"]), list: null };
}

export function referenceSlot(label) {
  return { kind: "reference", label, minItems: 0, maxItems: 1 };
}

export function productSlots() {
  return {
    path: elementSlot("Product URL", ["data"]),
    image: elementSlot("Product photo", ["img", "temel-picture"]),
    title: textSlot("Product name", "rte-document-v1"),
    category: listSlot("Category"),
    brand: listSlot("Brand"),
    "price-error": textSlot("Price unavailable message"),
  };
}

export function enumAttribute(label, options, defaultValue) {
  return {
    type: "enum",
    presence: "optional",
    label,
    description: label,
    options,
    default: defaultValue,
  };
}

export function createAuthorContract(authorContract) {
  const schema = {
    schemaVersion: 1,
    element: {
      logicVersion: authorContract.logicVersion ?? 1,
      category: "content",
      allowBlank: true,
      label: authorContract.label,
      description: authorContract.description,
    },
    ...(authorContract.editor === undefined
      ? {}
      : { editor: authorContract.editor }),
    attributes: authorContract.attributes ?? {},
    slots: {
      order: Object.keys(authorContract.slots),
      configs: authorContract.slots,
    },
    ...(authorContract.states ? { states: authorContract.states } : {}),
  };
  return {
    getSchema() {
      return schema;
    },
    create() {
      return document.createElement(authorContract.tag);
    },
    ...(authorContract.getReferences
      ? { getReferences: authorContract.getReferences }
      : {}),
    ...(authorContract.presentState
      ? { presentState: authorContract.presentState }
      : {}),
  };
}
