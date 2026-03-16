import { createImportVisitors } from "../utils/import-visitors.js";
import {
  clientStoreAppDir,
  clientStorePagesDir,
  isInside,
  resolveImportPath,
} from "../utils/paths.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "client/store/app と client/store/pages の相互依存を禁止する",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    const inStoreApp = isInside(clientStoreAppDir, filename);
    const inStorePages = isInside(clientStorePagesDir, filename);

    if (!inStoreApp && !inStorePages) {
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

      if (inStoreApp && isInside(clientStorePagesDir, resolvedPath)) {
        context.report({
          node,
          message: "client/store/app から client/store/pages への依存は禁止です。",
        });
      }

      if (inStorePages && isInside(clientStoreAppDir, resolvedPath)) {
        context.report({
          node,
          message: "client/store/pages から client/store/app への依存は禁止です。",
        });
      }
    };

    return createImportVisitors(checkImport);
  },
};