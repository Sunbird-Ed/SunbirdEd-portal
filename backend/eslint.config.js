import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    files: ["**/*.jsx", "**/*.tsx"],
    rules: {
      "max-lines": ["error", {
        max: 250,
        skipBlankLines: true,
        skipComments: true
      }],

      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  prettier,
];