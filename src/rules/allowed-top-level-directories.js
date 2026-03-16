import fs from "node:fs";
import {
  clientDir,
  sharedDir,
  serverDir,
} from "../utils/paths.js";

let topLevelDirectoryViolations = null;
let hasReportedTopLevelDirectoryViolations = false;

const getUnexpectedDirectories = (baseDir, allowedDirectories) => {
  if (!fs.existsSync(baseDir)) {
    return [];
  }

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((directoryName) => !allowedDirectories.includes(directoryName));
};

export default {
  meta: {
    type: "problem",
    docs: {
      description: "client/shared/server 直下の許可ディレクトリ以外の存在を禁止する",
    },
    schema: [],
  },
  create(context) {
    return {
      Program(node) {
        if (hasReportedTopLevelDirectoryViolations) {
          return;
        }

        if (!topLevelDirectoryViolations) {
          const clientUnexpectedDirectories = getUnexpectedDirectories(
            clientDir,
            [
              "components",
              "parts",
              "actions",
              "model",
              "services",
              "repositorys",
              "store",
            ],
          );
          const sharedUnexpectedDirectories = getUnexpectedDirectories(
            sharedDir,
            ["entity"],
          );
          const serverUnexpectedDirectories = getUnexpectedDirectories(
            serverDir,
            ["service", "repository"],
          );

          topLevelDirectoryViolations = [
            ...clientUnexpectedDirectories.map((directoryName) => ({
              message: `client 直下に許可されていないディレクトリがあります: ${directoryName}`,
            })),
            ...sharedUnexpectedDirectories.map((directoryName) => ({
              message: `shared 直下に許可されていないディレクトリがあります: ${directoryName}`,
            })),
            ...serverUnexpectedDirectories.map((directoryName) => ({
              message: `server 直下に許可されていないディレクトリがあります: ${directoryName}`,
            })),
          ];
        }

        if (topLevelDirectoryViolations.length === 0) {
          return;
        }

        hasReportedTopLevelDirectoryViolations = true;

        for (const violation of topLevelDirectoryViolations) {
          context.report({
            node,
            message: violation.message,
          });
        }
      },
    };
  },
};