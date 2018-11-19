// @ts-check

const { defaults } = require('jest-config')

/**
 * @type {import('./types').TsJestConfig}
 */
const tsJestConfig = {
  babelConfig: false,
}

/**
 * @type {Partial<jest.InitialOptions>}
 */
const config = {
  rootDir: '..',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/lib/**/__tests__/**/*.ts?(x)',
    '<rootDir>/(lib|test)/**/?(*.)+(spec|test).ts?(x)',
  ],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  globals: {
    'ts-jest': tsJestConfig,
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    "**/lib/**/*.ts",
    "!**/lib/index.ts",
    "!**/node_modules/**",
  ],
  setupFiles: ['<rootDir>/config/setup-tests.js'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}

module.exports = config