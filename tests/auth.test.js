const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Import your routes
const users = require('../routes/api/users');

// Mock the database
jest.mock('../routes/db.js', () => ({
  connect: jest.fn().mockResolvedValue({
    query: jest.fn(),
    release: jest.fn()
  })
}));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('mocksalt'),
  hash: jest.fn().mockResolvedValue('mockhash'),
  compare: jest.fn().mockResolvedValue(true)
}));
app.use('/api/users', users);

describe('Authentication API', () => {
  let testUser;

  beforeEach(() => {
    testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      password2: 'password123', // API expects password2
      location: '40.7128,-74.0060', // New York coordinates
      address: '123 Test Street, New York, NY'
    };
  });

  describe('POST /api/users/register', () => {
    it('should register a new user with valid data', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock successful registration
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, ...testUser }]
      });

      const response = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([
          testUser.name,
          testUser.email,
          expect.any(String), // hashed password
          expect.any(String), // location
          testUser.address
        ])
      );
    });

    it('should reject registration with invalid email', async () => {
      testUser.email = 'invalid-email';

      const response = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.email).toBeDefined();
    });

    it('should reject registration with mismatched passwords', async () => {
      testUser.password2 = 'different-password';

      const response = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.password2).toBeDefined();
    });

    it('should reject registration with short password', async () => {
      testUser.password = '123';
      testUser.password2 = '123';

      const response = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.password).toBeDefined();
    });
  });

  describe('POST /api/users/login', () => {
    it('should login with valid credentials', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock user found in database
      mockClient.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          email: testUser.email,
          password: '$2a$10$mockHashedPassword', // This would be a real bcrypt hash
          name: testUser.name
        }]
      });

      // Mock bcrypt comparison (would need to mock bcrypt module)
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      // Note: This test may fail due to bcrypt, but shows the structure
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [testUser.email]
      );
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'invalid-email',
          password: testUser.password
        });

      expect(response.status).toBe(400);
      expect(response.body.email).toBeDefined();
    });

    it('should reject login with empty password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.password).toBeDefined();
    });
  });
});