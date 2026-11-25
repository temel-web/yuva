import { YuvaDataLists } from "./yuva-data-lists.js";

function getSchema() {
  return {
    schemaVersion: 1,
    element: {
      logicVersion: 1,
      label: "Product lists",
      description:
        "A dedicated app for editing shared product list entries through direct controls.",
      category: "structure",
      allowBlank: true,
      isCommentable: false,
      isNewFileTemplate: false,
    },
    editor: { interaction: "interact", authoring: "none" },
    attributes: {},
    slots: {
      order: ["default"],
      configs: {
        default: {
          kind: "element",
          label: "Lists",
          allowedTags: ["temel-data-list"],
          minItems: 0,
          maxItems: null,
        },
      },
    },
  };
}

YuvaDataLists.temel = { getSchema };

export { YuvaDataLists };
