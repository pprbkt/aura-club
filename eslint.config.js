const nextPlugin = require("@next/eslint-plugin-next");
const typescriptEslintParser = require("@typescript-eslint/parser");
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...typescriptEslintPlugin.configs.recommended.rules,
    },
  },
];