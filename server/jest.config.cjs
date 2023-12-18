/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "setupFiles": [
    "jest-plugin-context/setup"
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    'dist',
  ],
  "rootDir": ".",
  "testRegex": ".*\\.(e2e-spec|test|spec)\\.ts$",
  "transform": {
    '^.+\\.(t|j)s?$': [
      '@swc/jest',
    ],
  },
  "collectCoverageFrom": [
    "**/*.(t|j)s"
  ],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  testPathIgnorePatterns: [
    '/node_modules/',
    'dist',
  ],
};
