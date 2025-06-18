import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import node from "eslint-plugin-n";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.ts"],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { project: "./tsconfig.json" },
    },
  },
  js.configs.recommended,
  ...tseslint.config(tseslint.configs.strictTypeChecked),
  node.configs["flat/recommended"],
  prettier,
  {
    rules: {
      "n/no-missing-import": "off",
      "n/no-unpublished-import": "off",
      "tseslint/restrict-template-expressions": [
        "error",
        {
          allowNumbers: true,
        },
      ],
    },
  },
];
