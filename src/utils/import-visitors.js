export const createImportVisitors = (checkImport) => ({
  ImportDeclaration(node) {
    checkImport(node.source, node.source.value);
  },
  ExportNamedDeclaration(node) {
    if (!node.source) {
      return;
    }

    checkImport(node.source, node.source.value);
  },
  ExportAllDeclaration(node) {
    checkImport(node.source, node.source.value);
  },
  CallExpression(node) {
    if (
      node.callee.type === "Identifier" &&
      node.callee.name === "require" &&
      node.arguments.length > 0 &&
      node.arguments[0].type === "Literal"
    ) {
      checkImport(node.arguments[0], node.arguments[0].value);
    }
  },
});