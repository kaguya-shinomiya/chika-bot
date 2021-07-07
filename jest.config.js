module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['./**/*.{test,spec}.ts'],
  collectCoverageFrom: ['src/**/*.{ts,js,tsx,jsx}', '!**/generated/**'],
};
