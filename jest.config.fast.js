module.exports = {
  testEnvironment: 'node',
  testTimeout: 3000,
  maxWorkers: 8,
  verbose: false,
  collectCoverage: false,
  testPathIgnorePatterns: [
    'node_modules',
    'integration',
    'e2e',
    '__tests__',
    'client'
  ],
  testNamePattern: '(auth|basic|unit)',
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/auth.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.fast.js'],
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
};
