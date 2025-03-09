import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(j|t)s?$': 'ts-jest',
  },
  testRegex: '(/_spec/.*|(\\.|/)(test|spec))\\.(j|t)s?$',
  moduleFileExtensions: ['ts', 'js'],
  globalSetup: '<rootDir>/test/global-setup.ts',
  globalTeardown: '<rootDir>/test/global-teardown.ts',
};

export default config;
