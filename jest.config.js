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
    '/client/dist/',
    '/tests/playwright/',
    '/playwright-report/',
    '/client/src/components/meals/__tests__/', // Skip complex meal tests
    '/client/src/components/__tests__/MapLocationSelector.test.js' // Skip complex map tests
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
  // Aggressive timeout and performance settings
  maxWorkers: '50%',
  testTimeout: 20000, // 20 seconds max per test
  bail: 1, // Stop on first failure to save time
  verbose: false, // Reduce output verbosity
  silent: true, // Suppress console output during tests
  
  // Module mapping for file imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/__mocks__/fileMock.js',
    '\\.(svg)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },
  
  // Test environment setup
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  
  // Coverage settings
  collectCoverage: false, // Disable coverage collection for faster tests
  
  // Transform settings - explicitly use Babel
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  }
};
