module.exports = {
  preset: "jest-preset-angular",
  roots: [
    "<rootDir>"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/setup-jest.ts"
  ],
  moduleNameMapper: {
    '@sunbirdshared': "<rootDir>/app/modules/shared/"
  },
  transformIgnorePatterns: [
    "<rootDir>/app/modules/shared/"
  ]
}