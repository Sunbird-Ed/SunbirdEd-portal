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

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'jsdom',
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/src' }),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  transform: { '^.+.(ts|mjs|js|html)$': 'jest-preset-angular' },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@project-sunbird)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageDirectory: '<rootDir>/coverage/',
  testMatch: [
    '**/?(*.)(spec).ts'
  ],
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
  // transform: {
  //   'lodash-es': '<rootDir>/node_modules/lodash-es'
  
};

/**
 * @description
 * Function to log all module mapped under src folder
 * - Use mode - DEBUG ONLY
 */
function setModuleNameMapper() {
  console.log('_______________MODULE_MAPPER________________')
  let _moduleMaps = pathsToModuleNameMapper(paths, { prefix: '<rootDir>/src' });
  console.log(_moduleMaps); // TODO: log!
  console.log('_______________MODULE_MAPPER________________')
}
// }
{
  forceExit: true
}
// setModuleNameMapper()
