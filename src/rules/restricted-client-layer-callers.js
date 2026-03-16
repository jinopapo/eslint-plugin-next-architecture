import { createImportVisitors } from "../utils/import-visitors.js";
import {
  appDir,
  clientActionsDir,
  clientComponentsDir,
  clientModelDir,
  clientPartsDir,
  clientRepositorysDir,
  clientServicesDir,
  clientStoreDir,
  isInside,
  resolveImportPath,
  sharedEntityDir,
  serverRepositoryDir,
  serverServiceDir,
} from "../utils/paths.js";

const restrictions = [
  {
    targetDir: clientComponentsDir,
    allowedImporterDirs: [appDir],
    message: "client/components は app 配下からのみ参照できます。",
  },
  {
    targetDir: clientPartsDir,
    allowedImporterDirs: [clientComponentsDir, clientPartsDir],
    message:
      "client/parts は client/components または client/parts からのみ参照できます。",
  },
  {
    targetDir: clientActionsDir,
    allowedImporterDirs: [clientComponentsDir],
    message: "client/actions は client/components からのみ参照できます。",
  },
  {
    targetDir: clientModelDir,
    allowedImporterDirs: [clientServicesDir, clientActionsDir, clientComponentsDir],
    message:
      "client/model は client/services・client/actions・client/components からのみ参照できます。",
  },
  {
    targetDir: clientServicesDir,
    allowedImporterDirs: [clientActionsDir],
    message: "client/services は client/actions からのみ参照できます。",
  },
  {
    targetDir: clientRepositorysDir,
    allowedImporterDirs: [clientServicesDir],
    message: "client/repositorys は client/services からのみ参照できます。",
  },
  {
    targetDir: clientStoreDir,
    allowedImporterDirs: [clientActionsDir],
    message: "client/store 配下は client/actions からのみ参照できます。",
  },
  {
    targetDir: serverServiceDir,
    allowedImporterDirs: [appDir],
    message: "server/service は app 配下からのみ参照できます。",
  },
  {
    targetDir: serverRepositoryDir,
    allowedImporterDirs: [serverServiceDir],
    message: "server/repository は server/service からのみ参照できます。",
  },
  {
    targetDir: sharedEntityDir,
    allowedImporterDirs: [serverServiceDir, serverRepositoryDir, clientRepositorysDir],
    message:
      "shared/entity は server/service・server/repository・client/repositorys からのみ参照できます。",
  },
];

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "client/components/actions/model/services/repositorys/store、shared/entity、server/service|repository の呼び出し元レイヤーを制限する",
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

      for (const restriction of restrictions) {
        if (!isInside(restriction.targetDir, resolvedPath)) {
          continue;
        }

        const isAllowedImporter = restriction.allowedImporterDirs.some(
          (allowedDir) => isInside(allowedDir, filename),
        );

        if (!isAllowedImporter) {
          context.report({
            node,
            message: restriction.message,
          });
        }
      }
    };

    return createImportVisitors(checkImport);
  },
};