import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript + React files
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
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
      // Minimal enterprise safety
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      // TypeScript correctness
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

    },
  },

  // Disable formatting rules (let Prettier handle formatting)
  prettier,
];