import { getFileNameWithoutExt, isInside, clientActionsDir, clientRepositorysDir, clientServicesDir, serverRepositoryDir, serverServiceDir } from "../utils/paths.js";

const namingRules = [
  { dir: clientActionsDir, suffix: "Action", label: "client/actions" },
  { dir: clientServicesDir, suffix: "Service", label: "client/services" },
  {
    dir: clientRepositorysDir,
    suffix: "Repository",
    label: "client/repositorys",
  },
  { dir: serverServiceDir, suffix: "Service", label: "server/service" },
  {
    dir: serverRepositoryDir,
    suffix: "Repository",
    label: "server/repository",
  },
];

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "components 以外の各レイヤー配下ファイル名はレイヤー名サフィックスを必須にする",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    const targetRule = namingRules.find((rule) => isInside(rule.dir, filename));

    if (!targetRule) {
      return {};
    }

    return {
      Program(node) {
        const name = getFileNameWithoutExt(filename);

        if (name === "index") {
          return;
        }

        if (!name.endsWith(targetRule.suffix)) {
          context.report({
            node,
            message: `${targetRule.label} 配下のファイル名は ${targetRule.suffix} で終わる必要があります。`,
          });
        }
      },
    };
  },
};