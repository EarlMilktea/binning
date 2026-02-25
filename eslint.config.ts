import js from "@eslint/js";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import pluginImport from "eslint-plugin-import-x";
import jsdoc from "eslint-plugin-jsdoc";
import node from "eslint-plugin-n";
import pluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.ts"],
  },
  {
    ignores: ["dist"],
  },
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
  pluginUnicorn.configs.recommended,
  {
    ignores: ["**/*.test.ts"],
    ...jsdoc.configs["flat/recommended-typescript-error"],
  },
  {
    settings: {
      "import-x/resolver-next": [createTypeScriptImportResolver()],
    },
  },
  {
    rules: {
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "import-x/no-relative-packages": "error",
      "import-x/no-relative-parent-imports": "error",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
        },
      ],
    },
  },
]);
