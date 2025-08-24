// Global test setup - runs once before all tests
module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_NAME = 'test_db';
  process.env.DB_USER = 'test_user';
  process.env.DB_PASSWORD = 'test_password';
  
  // Suppress console output during tests
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  
  console.log('🧪 Test environment initialized');
};
