module.exports = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',
  
  // Use jsdom environment for React/DOM testing
  testEnvironment: 'jsdom',
  
  // Run setup file before tests (imports @testing-library/jest-dom)
  setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.ts'],
  
  // Tell Jest how to handle TypeScript and JSX files
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  
  // Mock static assets and CSS modules
  moduleNameMapper: {
    // Mock CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // Mock image imports
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/mocks/fileMock.js',
    
    // Handle path aliases (if you use @/ imports in your code)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Collect coverage from these files (optional, but useful)
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  
  // Which file extensions Jest should look for
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};