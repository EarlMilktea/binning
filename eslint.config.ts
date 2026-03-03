import path from "node:path";

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import jsDoc from "eslint-plugin-jsdoc";
import node from "eslint-plugin-n";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";
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
      parserOptions: {
        project: "./tsconfig.json",
        tsConfigRootDir: path.dirname(import.meta.url),
      },
    },
  },
  js.configs.recommended,
  // eslint-disable-next-line import-x/no-named-as-default-member
  tseslint.configs.strictTypeChecked,
  node.configs["flat/recommended"],
  // @ts-expect-error - broken types
  importX.flatConfigs.recommended,
  // @ts-expect-error - broken types
  importX.flatConfigs.typescript,
  unicorn.configs.recommended,
  {
    ignores: ["**/*.test.ts"],
    ...jsDoc.configs["flat/recommended-typescript-error"],
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
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
      "n/hashbang": [
        "error",
        {
          additionalExecutables: ["src/bin.ts"],
        },
      ],
    },
  },
]);
