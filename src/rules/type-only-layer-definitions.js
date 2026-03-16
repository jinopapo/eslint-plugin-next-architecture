import { clientModelDir, isInside, sharedEntityDir } from "../utils/paths.js";

const restrictedLayers = [
  { dir: sharedEntityDir, label: "shared/entity" },
  { dir: clientModelDir, label: "client/model" },
];

const isTypeOnlyImport = (node) => {
  if (node.importKind === "type") {
    return true;
  }

  if (!node.specifiers || node.specifiers.length === 0) {
    return false;
  }

  return node.specifiers.every((specifier) => specifier.importKind === "type");
};

const isAllowedStatement = (node) => {
  switch (node.type) {
    case "ImportDeclaration":
      return isTypeOnlyImport(node);
    case "TSTypeAliasDeclaration":
    case "TSInterfaceDeclaration":
      return true;
    case "ExportNamedDeclaration":
      if (node.declaration) {
        return isAllowedStatement(node.declaration);
      }

      return node.exportKind === "type";
    case "ExportAllDeclaration":
      return node.exportKind === "type";
    case "EmptyStatement":
      return true;
    default:
      return false;
  }
};

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "shared/entity と client/model では型定義以外の runtime 定義を禁止する",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    const currentLayer = restrictedLayers.find((layer) => isInside(layer.dir, filename));

    if (!currentLayer) {
      return {};
    }

    return {
      Program(node) {
        for (const statement of node.body) {
          if (isAllowedStatement(statement)) {
            continue;
          }

          context.report({
            node: statement,
            message: `${currentLayer.label} 配下では type / interface / type-only import・export のみ定義できます。`,
          });
        }
      },
    };
  },
};