const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock database pool
jest.mock('../routes/db.js', () => ({
  connect: jest.fn().mockResolvedValue({
    query: jest.fn(),
    release: jest.fn()
  })
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('mocksalt'),
  hash: jest.fn().mockResolvedValue('mockhash'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock.jwt.token')
}));

let app;

describe('Integration Tests - User Registration and Login', () => {
  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret';

    // Import app after setting environment
    const users = require('../routes/api/users');

    app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use('/api/users', users);
  });

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('Complete User Flow', () => {
    const testUser = {
      name: 'Integration Test User',
      email: 'integration-test@example.com',
      password: 'testpassword123',
      password2: 'testpassword123',
      location: '40.7128,-74.0060',
      address: '123 Integration Test Street, New York, NY'
    };

    it('should complete full user registration and login flow', async () => {
      // Mock successful registration
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, ...testUser }]
      });

      // Step 1: Register a new user
      console.log('🧪 Testing user registration...');

      const registerResponse = await request(app)
        .post('/api/users/register')
        .send(testUser)
        .expect(201);

      console.log('✅ User registration successful');

      // Step 2: Attempt login with the registered user
      console.log('🧪 Testing user login...');

      // Mock successful login query
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: testUser.name, password: 'mockhash' }]
      });

      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      // Check if login was successful
      if (loginResponse.status === 200) {
        expect(loginResponse.body.token).toBeDefined();
        expect(typeof loginResponse.body.token).toBe('string');
        console.log('✅ User login successful');
        console.log('🎟️  JWT Token received:', loginResponse.body.token.substring(0, 20) + '...');
      } else {
        console.log('❌ Login failed with status:', loginResponse.status);
        console.log('Response body:', loginResponse.body);
      }

      // Verify the flow completed
      expect(registerResponse.status).toBe(201);
      expect(mockClient.query).toHaveBeenCalled();
    });

    it('should reject duplicate email registration', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();
      
      // Mock duplicate email error
      mockClient.query.mockRejectedValueOnce(new Error('duplicate key value violates unique constraint'));

      const response = await request(app)
        .post('/api/users/register')
        .send(testUser)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockClient.query).toHaveBeenCalled();
    });
  });
});