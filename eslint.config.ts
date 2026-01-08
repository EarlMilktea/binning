import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import node from "eslint-plugin-n";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.ts"],
  },
  globalIgnores(["**/*.test.ts", "./*.ts", "dist"]),
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { project: "./tsconfig.json" },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  node.configs["flat/recommended"],
  pluginImport.flatConfigs.recommended,
  {
    ignores: ["**/*.test.ts"],
    ...jsdoc.configs["flat/recommended-typescript-error"],
  },
  prettier,
  {
    rules: {
      "import/extensions": ["error", "always"],
      "import/no-relative-packages": "error",
      "import/no-relative-parent-imports": "error",
      "import/no-unresolved": "off",
      "n/no-missing-import": "off",
      "n/no-unpublished-import": "off",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
        },
      ],
    },
  },
]);
