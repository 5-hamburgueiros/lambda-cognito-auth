import type { Config } from 'jest';

const config: Config = {
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
  },
};

export default config;
