// Test data fixtures for consistent testing across all test suites

const testUsers = {
  valid: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword123',
    password2: 'testpassword123',
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
  host: 'localhost',
  port: 5433,
  database: 'coolanu_test',
  user: 'coolanu',
  password: 'koolanu'
};

const testEnvironment = {
                test: {
                NODE_ENV: 'test',
                DB_HOST: 'localhost',
                DB_PORT: 5433,
                DB_NAME: 'coolanu_test',
                DB_USER: 'coolanu',
                DB_PASSWORD: 'koolanu',
                JWT_SECRET: 'test-jwt-secret-key'
              },
                debug: {
                NODE_ENV: 'debug',
                DB_HOST: 'database',
                DB_PORT: 5432,
                DB_NAME: 'coolanu',
                DB_USER: 'postgres',
                DB_PASSWORD: 'koolanu'
              },
                release: {
                NODE_ENV: 'production',
                DB_HOST: '3.249.94.227',
                DB_PORT: 5432,
                DB_NAME: 'coolanu',
                DB_USER: 'coolanu_user',
                DB_PASSWORD: 'koolanu',
                JWT_SECRET: 'QqjLQPGsAmE0suGWbKBqcdGuDeX237kPRJCO/aIzoaA='
              }
};

module.exports = {
  testUsers,
  testMeals,
  testDatabase,
  testEnvironment
};
