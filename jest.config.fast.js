// 🚀 Fast Jest Configuration for Development
// Skips coverage collection and uses minimal workers for speed

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
  
  // Skip coverage collection for speed
  collectCoverage: false,
  
  // Speed optimizations
  maxWorkers: '25%', // Use fewer workers for faster startup
  testTimeout: 10000, // 10 seconds max per test
  bail: 0, // Don't bail on first failure for better debugging
  
  // Fast test execution
  testRunner: 'jest-circus/runner',
  
  // Module name mapping for faster imports
  moduleNameMapper: {
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
  },
  
  // Only run unit tests for speed
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/tests/auth.test.js',
    '<rootDir>/tests/meals.test.js'
  ]
};
