// Test data fixtures for consistent testing across all test suites

const testUsers = {
  valid: {
    name: 'Test User',
    email: 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'test_password_placeholder',
    password2: process.env.TEST_USER_PASSWORD || 'test_password_placeholder',
    location: { lng: 34.808, lat: 32.09 }, // Tel Aviv
    address: '123 Test Street, Tel Aviv, Israel'
  },
  invalid: {
    name: '',
    email: 'invalid-email',
    password: '123',
    password2: 'different-password',
    location: '',
    address: ''
  }
};

const testMeals = {
  valid: {
    name: 'Test Meal',
    description: 'A delicious test meal for testing',
    date: Date.now() + 86400000, // Tomorrow
    address: '456 Test Avenue, Tel Aviv, Israel',
    location: { lng: 34.808, lat: 32.09 },
    host_id: 1,
    guest_count: 3,
    image_id: -1,
    type: 1,
    visibility: 1
  },
  invalid: {
    name: '',
    description: '',
    date: Date.now() - 86400000, // Yesterday
    address: '',
    location: null,
    host_id: null,
    guest_count: -1,
    image_id: null,
    type: null,
    visibility: null
  }
};

const testDatabase = {
  host: process.env.TEST_DB_HOST || 'localhost',
  port: process.env.TEST_DB_PORT || 5433,
  database: process.env.TEST_DB_NAME || 'test_database',
  user: process.env.TEST_DB_USER || 'test_user',
  password: process.env.TEST_DB_PASSWORD || 'test_password_placeholder'
};

const testEnvironment = {
  test: {
    NODE_ENV: 'test',
    DB_HOST: process.env.TEST_DB_HOST || 'localhost',
    DB_PORT: process.env.TEST_DB_PORT || 5433,
    DB_NAME: process.env.TEST_DB_NAME || 'test_database',
    DB_USER: process.env.TEST_DB_USER || 'test_user',
    DB_PASSWORD: process.env.TEST_DB_PASSWORD || 'test_password_placeholder',
    JWT_SECRET: process.env.TEST_JWT_SECRET || 'test_jwt_secret_placeholder'
  },
  debug: {
    NODE_ENV: 'debug',
    DB_HOST: process.env.DEBUG_DB_HOST || 'database',
    DB_PORT: process.env.DEBUG_DB_PORT || 5432,
    DB_NAME: process.env.DEBUG_DB_NAME || 'debug_database',
    DB_USER: process.env.DEBUG_DB_USER || 'debug_user',
    DB_PASSWORD: process.env.DEBUG_DB_PASSWORD || 'debug_password_placeholder'
  },
  release: {
    NODE_ENV: 'production',
    DB_HOST: process.env.PROD_DB_HOST || 'production_host',
    DB_PORT: process.env.PROD_DB_PORT || 5432,
    DB_NAME: process.env.PROD_DB_NAME || 'production_database',
    DB_USER: process.env.PROD_DB_USER || 'production_user',
    DB_PASSWORD: process.env.PROD_DB_PASSWORD || 'production_password_placeholder',
    JWT_SECRET: process.env.PROD_JWT_SECRET || 'production_jwt_secret_placeholder'
  }
};

module.exports = {
  testUsers,
  testMeals,
  testDatabase,
  testEnvironment
};
