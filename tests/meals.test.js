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
      description: 'A delicious test meal',
      location: '40.7128,-74.0060',
      address: '123 Test Street, New York, NY',
      meal_time: new Date().toISOString(),
      max_guests: 4,
      image_url: 'https://example.com/meal.jpg'
    };
  });

  describe('POST /api/meals', () => {
    it('should create a new meal with valid data', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock successful meal creation
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, ...testMeal, host_id: 1 }]
      });

      const response = await request(app)
        .post('/api/meals')
        .send(testMeal);

      expect(response.status).toBe(201);
      expect(response.body.meal).toMatchObject({
        id: expect.any(Number),
        name: testMeal.name,
        description: testMeal.description
      });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO meals'),
        expect.arrayContaining([
          testMeal.name,
          testMeal.description,
          expect.any(Number), // host_id
          testMeal.location,
          testMeal.address,
          expect.any(String), // meal_time
          testMeal.max_guests,
          testMeal.image_url
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

    it('should reject meal creation with invalid max_guests', async () => {
      testMeal.max_guests = -1;

      const response = await request(app)
        .post('/api/meals')
        .send(testMeal);

      expect(response.status).toBe(400);
      expect(response.body.max_guests).toBeDefined();
    });
  });

  describe('GET /api/meals', () => {
    it('should return list of meals', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      const mockMeals = [
        { id: 1, name: 'Meal 1', host_id: 1 },
        { id: 2, name: 'Meal 2', host_id: 2 }
      ];

      mockClient.query.mockResolvedValueOnce({
        rows: mockMeals
      });

      const response = await request(app)
        .get('/api/meals');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it('should filter meals by location when provided', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Local Meal' }]
      });

      const response = await request(app)
        .get('/api/meals')
        .query({ location: '40.7128,-74.0060', radius: '10' });

      expect(response.status).toBe(200);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('ST_DWithin'),
        expect.any(Array)
      );
    });
  });

  describe('GET /api/meals/:id', () => {
    it('should return a specific meal by id', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      const mockMeal = {
        id: 1,
        name: 'Test Meal',
        host_id: 1,
        host_name: 'Test User'
      };

      mockClient.query.mockResolvedValueOnce({
        rows: [mockMeal]
      });

      const response = await request(app)
        .get('/api/meals/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Test Meal');
    });

    it('should return 404 for non-existent meal', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      mockClient.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .get('/api/meals/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PUT /api/meals/:id', () => {
    it('should update a meal owned by the authenticated user', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock finding the meal (owned by user)
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, host_id: 1 }]
      });

      // Mock successful update
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, ...testMeal, host_id: 1 }]
      });

      const response = await request(app)
        .put('/api/meals/1')
        .send({ name: 'Updated Meal Name' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Meal Name');
    });

    it('should reject update of meal not owned by user', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock finding meal owned by different user
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, host_id: 2 }] // Different user owns this meal
      });

      const response = await request(app)
        .put('/api/meals/1')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('authorized');
    });
  });

  describe('DELETE /api/meals/:id', () => {
    it('should delete a meal owned by the authenticated user', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock finding the meal (owned by user)
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, host_id: 1 }]
      });

      // Mock successful deletion
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1 }]
      });

      const response = await request(app)
        .delete('/api/meals/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted');
    });

    it('should reject deletion of meal not owned by user', async () => {
      const pool = require('../routes/db.js');
      const mockClient = await pool.connect();

      // Mock finding meal owned by different user
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, host_id: 2 }]
      });

      const response = await request(app)
        .delete('/api/meals/1');

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('authorized');
    });
  });
});