import { createImportVisitors } from "../utils/import-visitors.js";
import {
  clientActionsDir,
  clientComponentsDir,
  getRelativePathSegments,
  isInside,
  resolveImportPath,
} from "../utils/paths.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "client/actions の参照は同一ページ・同一コンポーネントの client/components からのみに制限する",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;

    if (!isInside(clientComponentsDir, filename)) {
      return {};
    }

    const importerSegments = getRelativePathSegments(
      clientComponentsDir,
      filename,
    );
    const importerPage = importerSegments[0];
    const importerComponent = importerSegments[1];

    const checkImport = (node, importSource) => {
      if (typeof importSource !== "string") {
        return;
      }

      const resolvedPath = resolveImportPath(importSource, filename);
      if (!resolvedPath || !isInside(clientActionsDir, resolvedPath)) {
        return;
      }

      const targetSegments = getRelativePathSegments(clientActionsDir, resolvedPath);
      const targetPage = targetSegments[0];
      const targetComponent = targetSegments[1];

      if (!importerPage || !importerComponent || !targetPage || !targetComponent) {
        return;
      }

      if (importerPage !== targetPage || importerComponent !== targetComponent) {
        context.report({
          node,
          message:
            "client/actions は同一ページ・同一コンポーネントの client/components からのみ参照できます。",
        });
      }
    };

    return createImportVisitors(checkImport);
  },
};