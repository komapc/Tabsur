// Ultra-fast test setup - mocks everything
process.env.NODE_ENV = 'test';

// Mock all external dependencies
jest.mock('../routes/db.js');
jest.mock('../middleware/rate-limiting.js');
jest.mock('../middleware/security.js');

// Mock console to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Fast fail on unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  // Don't exit, just log
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Set very short timeouts
jest.setTimeout(2000);
