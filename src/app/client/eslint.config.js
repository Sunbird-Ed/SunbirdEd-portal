// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "no-empty": "warn",
      "no-var": "warn",
      "no-unused-labels": "warn",
      "prefer-const": "warn",
      "no-useless-escape": "warn",
      "no-case-declarations": "warn",
      "no-prototype-builtins": "warn",
      "no-loss-of-precision": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "no-async-promise-executor": "warn",
      "no-constant-binary-expression": "warn",
      "@typescript-eslint/array-type": "warn",
      "@typescript-eslint/ban-tslint-comment": "warn",
      "@typescript-eslint/no-namespace": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-duplicate-enum-values": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@angular-eslint/no-output-native": "warn",
      "@angular-eslint/no-empty-lifecycle-method": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/consistent-generic-constructors": "warn",
      "@typescript-eslint/consistent-type-assertions": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/consistent-indexed-object-style": "warn",
      "@angular-eslint/no-output-on-prefix": "warn",
      "@angular-eslint/directive-selector": [
        "warn",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "warn",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/no-negated-async": "warn",
      "@angular-eslint/template/elements-content": "warn",
      "@angular-eslint/template/valid-aria": "warn",
      "@angular-eslint/template/alt-text": "warn",
      "@angular-eslint/template/eqeqeq": "warn",
      "@angular-eslint/template/no-autofocus": "warn",
      "@angular-eslint/template/interactive-supports-focus": "warn",
      "@angular-eslint/template/label-has-associated-control": "warn",
      "@angular-eslint/template/click-events-have-key-events": "warn",
      "@angular-eslint/template/no-call-expression": "warn",
      "@angular-eslint/template/role-has-required-aria": "warn"
    },
  }
);
