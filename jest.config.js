module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/',
    '/.git/',
    '/client/build/',
    '/client/dist/'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    'client/src/**/*.{js,jsx}',
    'routes/**/*.js',
    '!**/*.test.{js,jsx}',
    '!**/__tests__/**',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  // Speed optimizations
  maxWorkers: '50%', // Use 50% of CPU cores for parallel execution
  testTimeout: 5000, // 5 seconds max per test
  bail: 0, // Don't bail on first failure
  verbose: false, // Reduce output noise
  
  // Fast test execution
  testRunner: 'jest-circus/runner',
  testSequencer: '@jest/test-sequencer',
  
  // Module name mapping for faster imports
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@client/(.*)$': '<rootDir>/client/src/$1'
  },
  
  // Transform only what's needed
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { 
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ],
      plugins: ['@babel/plugin-transform-runtime']
    }]
  },
  
  // Fast file watching
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/'
  ],
  
  // Cache for faster subsequent runs
  cache: true,
  cacheDirectory: '.jest-cache',
  
  // Environment setup
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
};
