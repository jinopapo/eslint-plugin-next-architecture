import { createImportVisitors } from "../utils/import-visitors.js";
import {
  clientPartsDir,
  isInside,
  resolveImportPath,
} from "../utils/paths.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "client/parts 配下からは client/parts 配下への依存のみ許可する",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;

    if (!isInside(clientPartsDir, filename)) {
      return {};
    }

    const checkImport = (node, importSource) => {
      if (typeof importSource !== "string") {
        return;
      }

      const resolvedPath = resolveImportPath(importSource, filename);
      if (!resolvedPath) {
        return;
      }

      if (!isInside(clientPartsDir, resolvedPath)) {
        context.report({
          node,
          message: "client/parts 配下からは client/parts 配下のみ参照できます。",
        });
      }
    };

    return createImportVisitors(checkImport);
  },
};