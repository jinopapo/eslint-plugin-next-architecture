import { createImportVisitors } from "../utils/import-visitors.js";
import {
  clientDir,
  isInside,
  resolveImportPath,
  serverDir,
} from "../utils/paths.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "client 配下と server 配下は互いに依存関係を持たず独立させる",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    const inClient = isInside(clientDir, filename);
    const inServer = isInside(serverDir, filename);

    if (!inClient && !inServer) {
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

      if (inClient && isInside(serverDir, resolvedPath)) {
        context.report({
          node,
          message: "client 配下から server 配下への依存は禁止です。",
        });
      }

      if (inServer && isInside(clientDir, resolvedPath)) {
        context.report({
          node,
          message: "server 配下から client 配下への依存は禁止です。",
        });
      }
    };

    return createImportVisitors(checkImport);
  },
};