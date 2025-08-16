const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock the middleware
const { sanitizeInput, validateInput } = require('../../middleware/sanitization');

describe('Input Sanitization Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Test endpoint
    app.post('/test', sanitizeInput, validateInput, (req, res) => {
      res.json({
        body: req.body,
        query: req.query,
        params: req.params
      });
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize XSS attempts in body', async () => {
      const maliciousInput = {
        name: '<script>alert("xss")</script>',
        description: '<img src="x" onerror="alert(1)">',
        email: 'test@example.com<script>alert("xss")</script>'
      };

      const response = await request(app)
        .post('/test')
        .send(maliciousInput)
        .expect(200);

      expect(response.body.body.name).not.toContain('<script>');
      expect(response.body.body.description).not.toContain('<img');
      expect(response.body.body.email).not.toContain('<script>');
    });

    it('should sanitize XSS attempts in query parameters', async () => {
      const response = await request(app)
        .post('/test?name=<script>alert("xss")</script>&desc=<img src="x" onerror="alert(1)">')
        .expect(200);

      expect(response.body.query.name).not.toContain('<script>');
      expect(response.body.query.desc).not.toContain('<img');
    });

    it('should handle non-string inputs gracefully', async () => {
      const mixedInput = {
        name: '<script>alert("xss")</script>',
        count: 42,
        active: true,
        tags: ['tag1', 'tag2']
      };

      const response = await request(app)
        .post('/test')
        .send(mixedInput)
        .expect(200);

      expect(response.body.body.name).not.toContain('<script>');
      expect(response.body.body.count).toBe(42);
      expect(response.body.body.active).toBe(true);
      expect(response.body.body.tags).toEqual(['tag1', 'tag2']);
    });

    it('should handle empty inputs', async () => {
      const response = await request(app)
        .post('/test')
        .send({})
        .expect(200);

      expect(response.body.body).toEqual({});
    });
  });

  describe('validateInput', () => {
    it('should reject inputs that are too long', async () => {
      const longInput = {
        name: 'a'.repeat(1001) // Exceeds maxLength of 1000
      };

      const response = await request(app)
        .post('/test')
        .send(longInput)
        .expect(400);

      expect(response.body.error).toBe('Input too long');
      expect(response.body.message).toContain('name exceeds maximum length');
    });

    it('should reject arrays that are too large', async () => {
      const largeArray = {
        tags: Array(101).fill('tag') // Exceeds maxArrayLength of 100
      };

      const response = await request(app)
        .post('/test')
        .send(largeArray)
        .expect(400);

      expect(response.body.error).toBe('Array too large');
      expect(response.body.message).toContain('tags exceeds maximum array size');
    });

    it('should accept valid inputs within limits', async () => {
      const validInput = {
        name: 'a'.repeat(500), // Within limit
        tags: Array(50).fill('tag'), // Within limit
        description: 'Valid description'
      };

      const response = await request(app)
        .post('/test')
        .send(validInput)
        .expect(200);

      expect(response.body.body).toEqual(validInput);
    });

    it('should handle query parameters that are too long', async () => {
      const longQuery = 'a'.repeat(1001);

      const response = await request(app)
        .post(`/test?param=${longQuery}`)
        .expect(400);

      expect(response.body.error).toBe('Query parameter too long');
      expect(response.body.message).toContain('param exceeds maximum length');
    });
  });

  describe('Integration', () => {
    it('should sanitize and validate inputs together', async () => {
      // Create input that will still be too long even after XSS sanitization
      const maliciousInput = {
        name: '<script>alert("xss")</script>' + 'a'.repeat(1001), // XSS + exceeds 1000 limit
        description: '<img src="x" onerror="alert(1)">'
      };

      const response = await request(app)
        .post('/test')
        .send(maliciousInput)
        .expect(400); // Should fail validation after sanitization

      expect(response.body.error).toBe('Input too long');
      expect(response.body.message).toContain('name exceeds maximum length');
    });

    it('should handle complex nested objects', async () => {
      const complexInput = {
        user: {
          name: '<script>alert("xss")</script>',
          profile: {
            bio: '<img src="x" onerror="alert(1)">'
          }
        },
        settings: {
          theme: 'dark',
          notifications: true
        }
      };

      const response = await request(app)
        .post('/test')
        .send(complexInput)
        .expect(200);

      // Should sanitize nested strings - DOMPurify removes all HTML tags
      expect(response.body.body.user.name).toBe('alert("xss")'); // Only text content remains
      expect(response.body.body.user.profile.bio).toBe(''); // Empty string after sanitization

      // Should preserve non-string values
      expect(response.body.body.settings.theme).toBe('dark');
      expect(response.body.body.settings.notifications).toBe(true);
    });
  });
});
