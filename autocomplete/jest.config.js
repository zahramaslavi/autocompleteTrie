module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testMatch: ['<rootDir>/tests/**/*.(test|spec).[jt]s?(x)'], // Find all test files in 'tests' folder
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
    collectCoverage: true,
};