import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      prettier: pluginJs.configs.recommended.plugins.prettier
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "prettier/prettier": "error"
    }
  }
];
