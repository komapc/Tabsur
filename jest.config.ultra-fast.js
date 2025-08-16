module.exports = {
  testEnvironment: 'node',
  testTimeout: 2000,
  maxWorkers: 8,
  verbose: false,
  collectCoverage: false,
  testPathIgnorePatterns: [
    'node_modules',
    'integration',
    'e2e',
    '__tests__',
    'client',
    'auth.test.js'  // Skip auth tests (they need database)
  ],
  testMatch: [
    '**/tests/unit/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ultra-fast.js'],
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', {
          targets: { node: 'current' },
          modules: 'commonjs'
        }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios|react|redux)/)'
  ]
  // Mock all external modules
  // moduleNameMapping: {
  //   '^../routes/db$': '<rootDir>/tests/__mocks__/dbMock.js',
  //   '^../middleware/(.*)$': '<rootDir>/tests/__mocks__/middlewareMock.js'
  // }
};
