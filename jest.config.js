module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', {
          targets: { node: 'current' },
          modules: 'commonjs'
        }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-swipeable-views-react-18-fix|react-swipeable-views|react-swipeable-views-utils)/)',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.test.jsx',
    '**/client/src/**/*.test.js',
    '**/client/src/**/*.test.jsx',
  ],
  collectCoverageFrom: [
    'client/src/**/*.{js,jsx}',
    '!client/src/index.js',
    '!client/src/serviceWorker.js',
    '!client/src/reportWebVitals.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000,
  moduleDirectories: ['node_modules', 'client/src'],
  roots: ['<rootDir>', '<rootDir>/client'],
};
