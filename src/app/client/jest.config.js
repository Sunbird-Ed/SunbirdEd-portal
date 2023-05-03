/**
 * @file jest.config.js
 * @description
 * Jest test suite configuration
 * @since - release-4.9.0
 * @Reference_Docs
 * - https://jestjs.io/docs/configuration
 */

const { defaults } = require('jest-config');
const { pathsToModuleNameMapper } = require('ts-jest');
const { paths } = require('./tsconfig.json').compilerOptions;

// eslint-disable-next-line no-undef
globalThis.ngJest = {
  skipNgcc: true,
  tsconfig: 'tsconfig.spec.json',
};

/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  // globalSetup: 'jest-preset-angular/global-setup',
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/src' }),
  transform: { '^.+.(ts|mjs|js|html)$': 'jest-preset-angular' },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@project-sunbird)'],
  moduleFileExtensions: [
          'js',
          'jsx',
          'json',
          'ts',
          'tsx',
          'html',
          'mjs',
          'd.ts'
        ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '.data.spec.ts',
    '.spec.data.ts'
  ],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageDirectory: '<rootDir>/coverage/',
  testMatch: [
      '**/?(*.)(spec).ts'
    ],
};