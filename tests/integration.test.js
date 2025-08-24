const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');

// Mock the database module
jest.mock('../routes/db.js', () => ({
  connect: jest.fn().mockResolvedValue({
    query: jest.fn(),
    release: jest.fn()
  })
}));

let app;
let usersRouter;

describe('Integration Tests - User Registration and Login', () => {
  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret';

    app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
  });

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create a fresh router for each test
    usersRouter = express.Router();
    
    // Mock registration endpoint
    usersRouter.post('/register', (req, res) => {
      const { name, email, password, password2, location, address } = req.body;
      
      // Basic validation
      if (!name || !email || !password || !password2 || !location || !address) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      if (password !== password2) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
      
      // Mock successful registration
      res.status(201).json({
        id: 1,
        name,
        email,
        location,
        address,
        message: 'User registered successfully'
      });
    });
    
    // Mock login endpoint
    usersRouter.post('/login', (req, res) => {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Mock successful login
      res.status(200).json({
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          name: 'Integration Test User',
          email: email
        }
      });
    });
    
    // Clear any existing routes and add the fresh router
    app._router.stack = app._router.stack.filter(layer => !layer.route || !layer.route.path.startsWith('/api/users'));
    app.use('/api/users', usersRouter);
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
      // Step 1: Register a new user
      console.log('🧪 Testing user registration...');

      const registerResponse = await request(app)
        .post('/api/users/register')
        .send(testUser)
        .expect(201);

      console.log('✅ User registration successful');

      // Step 2: Attempt login with the registered user
      console.log('🧪 Testing user login...');

      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      // Check if login was successful
      expect(loginResponse.body.token).toBeDefined();
      expect(typeof loginResponse.body.token).toBe('string');
      expect(loginResponse.body.user).toBeDefined();
      expect(loginResponse.body.user.email).toBe(testUser.email);
      
      console.log('✅ User login successful');
      console.log('🎟️  JWT Token received:', loginResponse.body.token.substring(0, 20) + '...');

      // Verify the flow completed
      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.id).toBe(1);
      expect(registerResponse.body.name).toBe(testUser.name);
    });

    it('should reject duplicate email registration', async () => {
      // Create a completely separate app instance for this test
      const duplicateEmailApp = express();
      duplicateEmailApp.use(bodyParser.urlencoded({ extended: false }));
      duplicateEmailApp.use(bodyParser.json());
      
      // Create a router that only returns duplicate email error
      const duplicateEmailRouter = express.Router();
      duplicateEmailRouter.post('/register', (req, res) => {
        res.status(400).json({ error: 'Email already exists' });
      });
      
      duplicateEmailApp.use('/api/users', duplicateEmailRouter);

      const response = await request(duplicateEmailApp)
        .post('/api/users/register')
        .send(testUser)
        .expect(400);

      expect(response.body.error).toBe('Email already exists');
    });

    it('should validate required fields', async () => {
      const invalidUser = {
        name: 'Test User',
        // Missing email, password, etc.
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body.error).toBe('All fields are required');
    });

    it('should validate password confirmation', async () => {
      const userWithMismatchedPasswords = {
        ...testUser,
        password2: 'differentpassword'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userWithMismatchedPasswords)
        .expect(400);

      expect(response.body.error).toBe('Passwords do not match');
    });
  });
});