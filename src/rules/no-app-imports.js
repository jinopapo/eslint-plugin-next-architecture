import { createImportVisitors } from "../utils/import-visitors.js";
import { appDir, isInside, resolveImportPath } from "../utils/paths.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "app 配下のファイルへの import を禁止する",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;

    const checkImport = (node, importSource) => {
      if (typeof importSource !== "string") {
        return;
      }

      const resolvedPath = resolveImportPath(importSource, filename);
      if (!resolvedPath) {
        return;
      }

      if (isInside(appDir, resolvedPath)) {
        context.report({
          node,
          message:
            "app ディレクトリ配下のファイルを他所から参照してはいけません。",
        });
      }
    };

    return createImportVisitors(checkImport);
  },
};