import { createImportVisitors } from "../utils/import-visitors.js";
import {
  clientActionsDir,
  clientStorePagesDir,
  getRelativePathSegments,
  isInside,
  resolveImportPath,
} from "../utils/paths.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "client/store/pages のファイルは同一ページの client/actions からのみ参照可能にする",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;

    if (!isInside(clientActionsDir, filename)) {
      return {};
    }

    const importerSegments = getRelativePathSegments(clientActionsDir, filename);
    const importerPage = importerSegments[0];

    const checkImport = (node, importSource) => {
      if (typeof importSource !== "string") {
        return;
      }

      const resolvedPath = resolveImportPath(importSource, filename);
      if (!resolvedPath || !isInside(clientStorePagesDir, resolvedPath)) {
        return;
      }

      const targetSegments = getRelativePathSegments(
        clientStorePagesDir,
        resolvedPath,
      );
      const targetPage = targetSegments[0];

      if (!importerPage || !targetPage) {
        return;
      }

      if (importerPage !== targetPage) {
        context.report({
          node,
          message:
            "client/store/pages は同一ページの client/actions からのみ参照できます。",
        });
      }
    };

    return createImportVisitors(checkImport);
  },
};