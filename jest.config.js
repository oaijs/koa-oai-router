module.exports = {
  bail: false,
  verbose: true,
  collectCoverage: true,
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/test/**',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
