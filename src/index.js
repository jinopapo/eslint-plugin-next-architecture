import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import actionsComponentsComponentBoundary from "./rules/actions-components-component-boundary.js";
import allowedTopLevelDirectories from "./rules/allowed-top-level-directories.js";
import layerFileNaming from "./rules/layer-file-naming.js";
import noAppImports from "./rules/no-app-imports.js";
import noClientServerCrossDependency from "./rules/no-client-server-cross-dependency.js";
import noClientStoreAppPagesCrossDependency from "./rules/no-client-store-app-pages-cross-dependency.js";
import noSameLayerDependency from "./rules/no-same-layer-dependency.js";
import partsOnlyPartsDependency from "./rules/parts-only-parts-dependency.js";
import restrictedClientLayerCallers from "./rules/restricted-client-layer-callers.js";
import storePagesActionPageBoundary from "./rules/store-pages-action-page-boundary.js";
import typeOnlyLayerDefinitions from "./rules/type-only-layer-definitions.js";

const pluginName = "next-architecture";

const rules = {
  "actions-components-component-boundary": actionsComponentsComponentBoundary,
  "allowed-top-level-directories": allowedTopLevelDirectories,
  "layer-file-naming": layerFileNaming,
  "no-app-imports": noAppImports,
  "no-client-server-cross-dependency": noClientServerCrossDependency,
  "no-client-store-app-pages-cross-dependency":
    noClientStoreAppPagesCrossDependency,
  "no-same-layer-dependency": noSameLayerDependency,
  "parts-only-parts-dependency": partsOnlyPartsDependency,
  "restricted-client-layer-callers": restrictedClientLayerCallers,
  "store-pages-action-page-boundary": storePagesActionPageBoundary,
  "type-only-layer-definitions": typeOnlyLayerDefinitions,
};

const recommendedRules = Object.fromEntries(
  Object.keys(rules).map((ruleName) => [`${pluginName}/${ruleName}`, "error"]),
);

const plugin = {
  meta: {
    name: "eslint-plugin-next-architecture",
    version: "0.1.0",
  },
  rules,
  configs: {
    recommended: [
      ...nextVitals,
      ...nextTs,
      {
        name: "next-architecture/recommended",
        files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"],
        plugins: {
          [pluginName]: null,
        },
        rules: recommendedRules,
      },
      {
        name: "next-architecture/tests",
        files: ["**/*.spec.{ts,tsx}"],
        rules: Object.fromEntries(
          Object.keys(rules).map((ruleName) => [`${pluginName}/${ruleName}`, "off"]),
        ),
      },
    ],
  },
};

plugin.configs.recommended[2].plugins[pluginName] = plugin;

export default plugin;