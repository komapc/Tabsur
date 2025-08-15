const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Import routes
const meals = require('../routes/api/meals');

// Mock the database
jest.mock('../routes/db.js', () => ({
  connect: jest.fn().mockResolvedValue({
    query: jest.fn(),
    release: jest.fn()
  })
}));

// Mock authentication middleware
jest.mock('../routes/authenticateJWT.js', () => ({
  authenticateJWT: jest.fn((req, res, next) => {
    req.user = { id: 1, name: 'Test User', email: 'test@example.com' };
    next();
  }),
  tryAuthenticateJWT: jest.fn((req, res, next) => {
    req.user = { id: 1, name: 'Test User', email: 'test@example.com' };
    next();
  })
}));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/meals', meals);

describe('Meals API', () => {
  let testMeal;

  beforeEach(() => {
    testMeal = {
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
    };
  });

  describe('POST /api/meals', () => {
    it('should create a new meal with valid data', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock successful meal creation
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, ...testMeal }]
      });

      const response = await request(app)
        .post('/api/meals')
        .send(testMeal);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO meals'),
        expect.arrayContaining([
          testMeal.name,
          testMeal.type,
          expect.any(String), // location
          testMeal.address,
          testMeal.guest_count,
          expect.any(String), // host_id (converted to string)
          expect.any(String), // date (converted to string)
          testMeal.visibility,
          testMeal.description
        ])
      );
    });

    it('should reject meal creation with missing required fields', async () => {
      delete testMeal.name;

      const response = await request(app)
        .post('/api/meals')
        .send(testMeal);

      expect(response.status).toBe(400);
      expect(response.body.name).toBeDefined();
    });

    it('should reject meal creation with invalid guest count', async () => {
      testMeal.guest_count = -1;

      const response = await request(app)
        .post('/api/meals')
        .send(testMeal);

      expect(response.status).toBe(400);
      expect(response.body.guest_count).toBeDefined();
    });
  });

  describe('GET /api/meals/:id', () => {
    it('should return meals for a specific user', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock successful query
      mockClient.query.mockResolvedValueOnce({
        rows: [
          { id: 1, name: 'Meal 1', host_name: 'User 1' },
          { id: 2, name: 'Meal 2', host_name: 'User 1' }
        ]
      });

      const response = await request(app)
        .get('/api/meals/1');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/meals/info/:id/:userId', () => {
    it('should return info about a specific meal', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock successful query
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Test Meal', host_name: 'User 1' }]
      });

      const response = await request(app)
        .get('/api/meals/info/1/1');

      expect(response.status).toBe(200);
      expect(response.body[0].id).toBe(1);
      expect(response.body[0].name).toBe('Test Meal');
    });
  });

  describe('PUT /api/meals', () => {
    it('should update a meal', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock successful update
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Updated Meal', guest_count: 5 }]
      });

      const response = await request(app)
        .put('/api/meals')
        .send({ name: 'Updated Meal', guest_count: 5, id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Meal');
    });
  });

  describe('DELETE /api/meals/:meal_id', () => {
    it('should delete a meal', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock successful deletion
      mockClient.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .delete('/api/meals/1')
        .send({ meal_id: 1 });

      expect(response.status).toBe(201);
    });

    it('should reject deletion with invalid meal ID', async () => {
      const response = await request(app)
        .delete('/api/meals/invalid')
        .send({ meal_id: 'invalid' });

      expect(response.status).toBe(400);
    });
  });
});