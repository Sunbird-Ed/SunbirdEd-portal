const { defaults } = require('jest-config');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: "jest-preset-angular",
  "verbose": true,
  "testEnvironment": "jsdom",
  roots: [
    "<rootDir>"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/setup-jest.ts"
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
  // "modulePaths": [
  //   "<rootDir>",
  // ],
  // preset is optional, you don't need it in case you use babel preset typescript
  preset: 'ts-jest',
  // note this prefix option
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    ".data.spec.ts",
    ".spec.data.ts",
    "sb-form-location-selection.delegate.spec.ts"
  ]
  // transform: {
  //   "lodash-es": "<rootDir>/node_modules/lodash-es"
  // }
}

function setModuleNameMapper () {
  console.log('_______________MODULE_MAPPER________________')
  let _moduleMaps = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' });
  console.log(_moduleMaps); // TODO: log!
  console.log('_______________MODULE_MAPPER________________')
  // return _moduleMaps;
}
setModuleNameMapper()