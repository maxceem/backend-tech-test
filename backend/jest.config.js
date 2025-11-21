const path = require('path');

// register ts-node so we can run `global-setup.ts` as typescript in multiproject setup
require('ts-node').register({
  transpileOnly: true,
  project: path.resolve(__dirname, 'tsconfig.json'),
});

module.exports = {
  globalSetup: '<rootDir>/src/__tests__/global-setup.ts',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/__tests__/**',
    '!src/utils/logger.ts',
    '!src/utils/typeorm-logger.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 10000,
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/__tests__/unit/**/*.unit.spec.ts'],
      setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup-unit.ts'],
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/__tests__/integration/**/*.int.spec.ts'],
      setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup-intergarion.ts'],
    },
  ],
};
