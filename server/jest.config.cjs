/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
    preset: 'ts-jest',
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
      "^.+\\.(t|j)s$": "ts-jest"
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
