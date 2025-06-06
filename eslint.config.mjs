import path from "node:path";
import { fileURLToPath } from "node:url";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/** @type {import("eslint").Linter.Config} */
const config = [
  {
    ignores: [
      "**/*.min.*",
      "**/*.map",
      "dist/**/*",
      "**/dev/**/*",
      "**/test.ts",
      "test/**/*",
      "**/*.spec.ts",
    ],
  }, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ), {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        GM: "readonly",
        unsafeWindow: "writable",
      },
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unreachable": "off",
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "eol-last": ["error", "always"],
      "no-async-promise-executor": "off",
      "no-cond-assign": "off",
      indent: ["error", 2, {
        ignoredNodes: ["VariableDeclaration[declarations.length=0]"],
      }],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        vars: "local",
        ignoreRestSiblings: true,
        args: "after-used",
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-expressions": ["error", {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      }],
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "@typescript-eslint/explicit-function-return-type": ["error", {
        allowExpressions: true,
        allowIIFEs: true,
      }],
      "comma-dangle": ["error", "only-multiline"],
      "no-misleading-character-class": "off",
    },
  }, {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "eol-last": ["error", "always"],
      "no-async-promise-executor": "off",
      indent: ["error", 2, {
        ignoredNodes: ["VariableDeclaration[declarations.length=0]"],
      }],
      "no-unused-vars": ["warn", {
        vars: "local",
        ignoreRestSiblings: true,
        args: "after-used",
        argsIgnorePattern: "^_",
      }],
      "comma-dangle": ["error", "only-multiline"],
    },
  },
];

export default config;
