import { createImportVisitors } from "../utils/import-visitors.js";
import {
  clientActionsDir,
  clientComponentsDir,
  clientModelDir,
  clientRepositorysDir,
  clientServicesDir,
  clientStoreAppDir,
  clientStorePagesDir,
  isInside,
  resolveImportPath,
  sharedEntityDir,
  serverRepositoryDir,
  serverServiceDir,
} from "../utils/paths.js";

const layers = [
  { dir: clientComponentsDir, label: "client/components" },
  { dir: clientActionsDir, label: "client/actions" },
  { dir: clientModelDir, label: "client/model" },
  { dir: clientServicesDir, label: "client/services" },
  { dir: clientRepositorysDir, label: "client/repositorys" },
  { dir: clientStoreAppDir, label: "client/store/app" },
  { dir: clientStorePagesDir, label: "client/store/pages" },
  { dir: sharedEntityDir, label: "shared/entity" },
  { dir: serverServiceDir, label: "server/service" },
  { dir: serverRepositoryDir, label: "server/repository" },
];

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "client/components|actions|model|services|repositorys|store/app|store/pages, shared/entity, server/service|repository で同レイヤー依存を禁止する",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    const currentLayer = layers.find((layer) => isInside(layer.dir, filename));

    if (!currentLayer) {
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

      if (isInside(currentLayer.dir, resolvedPath)) {
        context.report({
          node,
          message: `${currentLayer.label} 内の同階層依存は禁止です。`,
        });
      }
    };

    return createImportVisitors(checkImport);
  },
};