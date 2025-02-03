import type {Config} from 'jest';

const config: Config = {
  collectCoverageFrom: [
    './src/service/**/*.ts',
    './src/rest/**/*.ts',
  ],
  coverageDirectory: '__tests__/coverage',

  coverageProvider: 'v8',

  preset: 'ts-jest',

  testMatch: [
    '**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};

export default config;
