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
  skipNgcc: false,
  tsconfig: 'tsconfig.spec.json',
};

/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: 'jest-preset-angular',
  globalSetup: 'jest-preset-angular/global-setup',
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/src' }),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
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
          moduleDirectories: ['node_modules', 'src']
,//   testPathIgnorePatterns: [
//     '/node_modules/',
//     '.data.spec.ts',
//     '.spec.data.ts'
//   ],
};



// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// module.exports = {
  
//   preset: 'ts-jest',
//   verbose: true,
//   testEnvironment: 'jsdom',
//   moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/src' }),
//   setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
//   // globals: {
//   //   'ts-jest': {
//   //     tsconfig: '<rootDir>/tsconfig.spec.json',
//   //     stringifyContentPathRegex: '\\.(html|svg)$',
//   //   },
//   // },
//   globalSetup: 'jest-preset-angular/global-setup',

//   transform: { '^.+.(ts|mjs|js|html)$': 'jest-preset-angular' },
//   transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@project-sunbird|@sunbird)'],
//   snapshotSerializers: [
//     'jest-preset-angular/build/serializers/no-ng-attributes',
//     'jest-preset-angular/build/serializers/ng-snapshot',
//     'jest-preset-angular/build/serializers/html-comment',
//   ],
//   collectCoverage: true,
//   coverageReporters: ['text', 'html'],
//   coverageDirectory: '<rootDir>/coverage/',
//   testMatch: [
//     '**/?(*.)(spec).ts'
//   ],
//   moduleFileExtensions: [
//     'js',
//     'jsx',
//     'json',
//     'ts',
//     'tsx',
//     'html',
//     'mjs',
//     'd.ts'
//   ],

//   testPathIgnorePatterns: [
//     '/node_modules/',
//     '.data.spec.ts',
//     '.spec.data.ts'
//   ],
//   moduleDirectories: ['node_modules', 'src']
//   // transform: {
//   //   'lodash-es': '<rootDir>/node_modules/lodash-es'
  
// };

// /**
//  * @description
//  * Function to log all module mapped under src folder
//  * - Use mode - DEBUG ONLY
//  */
// function setModuleNameMapper() {
//   console.log('_______________MODULE_MAPPER________________')
//   let _moduleMaps = pathsToModuleNameMapper(paths, { prefix: '<rootDir>/src' });
//   console.log(_moduleMaps); // TODO: log!
//   console.log('_______________MODULE_MAPPER________________')
// }
// // }
// {
//   forceExit: true
// }
// setModuleNameMapper()
