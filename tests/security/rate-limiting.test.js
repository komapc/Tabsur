const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

// Create fresh rate limiter instances for each test
const createApiLimiter = () => rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Handle forwarded IP headers for testing
    return req.headers['x-forwarded-for'] || req.ip || 'test-ip';
  },
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: Math.ceil(15 * 60 / 1000)
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil(15 * 60 / 1000)
    });
  }
});

const createAuthLimiter = () => rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'test-ip',
  message: {
    error: 'Too many authentication attempts',
    message: 'Too many login attempts. Please try again later.',
    retryAfter: Math.ceil(15 * 60 / 1000)
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Too many login attempts. Please try again later.',
      retryAfter: Math.ceil(15 * 60 / 1000)
    });
  }
});

const createUploadLimiter = () => rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'test-ip',
  message: {
    error: 'Too many file uploads',
    message: 'Upload limit exceeded. Please try again later.',
    retryAfter: Math.ceil(60 * 60 / 1000)
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many file uploads',
      message: 'Upload limit exceeded. Please try again later.',
      retryAfter: Math.ceil(60 * 60 / 1000)
    });
  }
});

const createMealCreationLimiter = () => rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'test-ip',
  message: {
    error: 'Too many meal creations',
    message: 'Daily meal creation limit exceeded. Please try again tomorrow.',
    retryAfter: Math.ceil(24 * 60 * 60 / 1000)
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many meal creations',
      message: 'Daily meal creation limit exceeded. Please try again tomorrow.',
      retryAfter: Math.ceil(24 * 60 * 60 / 1000)
    });
  }
});

const createSearchLimiter = () => rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'test-ip',
  message: {
    error: 'Too many searches',
    message: 'Search limit exceeded. Please try again later.',
    retryAfter: Math.ceil(60 * 60 / 1000)
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many searches',
      message: 'Search limit exceeded. Please try again later.',
      retryAfter: Math.ceil(60 * 60 / 1000)
    });
  }
});


describe('Rate Limiting Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    
    // Set trust proxy to handle X-Forwarded-For headers in tests
    app.set('trust proxy', true);
    

    
    // Test endpoints for different rate limiters
    app.post('/api/test', createApiLimiter(), (req, res) => {
      res.json({ message: 'API endpoint' });
    });

    app.post('/auth/login', createAuthLimiter(), (req, res) => {
      res.json({ message: 'Login endpoint' });
    });

    app.post('/upload', createUploadLimiter(), (req, res) => {
      res.json({ message: 'Upload endpoint' });
    });

    app.post('/meals', createMealCreationLimiter(), (req, res) => {
      res.json({ message: 'Meal creation endpoint' });
    });

    app.get('/search', createSearchLimiter(), (req, res) => {
      res.json({ message: 'Search endpoint' });
    });
  });

  describe('API Rate Limiter', () => {
    it('should allow requests within limit', async () => {
      // Make 100 requests (within limit)
      for (let i = 0; i < 100; i++) {
        await request(app)
          .post('/api/test')
          .expect(200);
      }
    });

    it('should block requests after limit exceeded', async () => {
      // Make 99 requests (just under limit)
      for (let i = 0; i < 99; i++) {
        await request(app)
          .post('/api/test')
          .expect(200);
      }

      // 100th request should succeed (at limit)
      await request(app)
        .post('/api/test')
        .expect(200);

      // 101st request should be blocked
      const response = await request(app)
        .post('/api/test')
        .expect(429);

      expect(response.body.error).toBe('Too many requests');
      expect(response.body.message).toContain('Rate limit exceeded');
    });

    it('should include rate limit headers', async () => {
      const response = await request(app)
        .post('/api/test')
        .expect(200);

      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
      expect(response.headers['ratelimit-reset']).toBeDefined();
    });
  });

  describe('Authentication Rate Limiter', () => {
    it('should allow 5 login attempts within 15 minutes', async () => {
      // Make 5 requests (within limit)
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/auth/login')
          .expect(200);
      }
    });

    it('should block login attempts after limit exceeded', async () => {
      // Make 4 requests (just under limit)
      for (let i = 0; i < 4; i++) {
        await request(app)
          .post('/auth/login')
          .expect(200);
      }

      // 5th request should succeed (at limit)
      await request(app)
        .post('/auth/login')
        .expect(200);

      // 6th request should be blocked
      const response = await request(app)
        .post('/auth/login')
        .expect(429);

      expect(response.body.error).toBe('Too many authentication attempts');
      expect(response.body.message).toContain('Too many login attempts');
    });
  });

  describe('Upload Rate Limiter', () => {
    it('should allow uploads within limit', async () => {
      // Make 10 requests (within limit)
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/upload')
          .expect(200);
      }
    });

    it('should block uploads after limit exceeded', async () => {
      // Make 9 requests (just under limit)
      for (let i = 0; i < 9; i++) {
        await request(app)
          .post('/upload')
          .expect(200);
      }

      // 10th request should succeed (at limit)
      await request(app)
        .post('/upload')
        .expect(200);

      // 11th request should be blocked
      const response = await request(app)
        .post('/upload')
        .expect(429);

      expect(response.body.error).toBe('Too many file uploads');
      expect(response.body.message).toContain('Upload limit exceeded');
    });
  });

  describe('Meal Creation Rate Limiter', () => {
    it('should allow meal creations within daily limit', async () => {
      // Make 20 requests (within limit)
      for (let i = 0; i < 20; i++) {
        await request(app)
          .post('/meals')
          .expect(200);
      }
    });

    it('should block meal creations after daily limit exceeded', async () => {
      // Make 19 requests (just under limit)
      for (let i = 0; i < 19; i++) {
        await request(app)
          .post('/meals')
          .expect(200);
      }

      // 20th request should succeed (at limit)
      await request(app)
        .post('/meals')
        .expect(200);

      // 21st request should be blocked
      const response = await request(app)
        .post('/meals')
        .expect(429);

      expect(response.body.error).toBe('Too many meal creations');
      expect(response.body.message).toContain('Daily meal creation limit exceeded');
    });
  });

  describe('Search Rate Limiter', () => {
    it('should allow searches within hourly limit', async () => {
      // Make 50 requests (within limit)
      for (let i = 0; i < 50; i++) {
        await request(app)
          .get('/search')
          .expect(200);
      }
    });

    it('should block searches after hourly limit exceeded', async () => {
      // Make 49 requests (just under limit)
      for (let i = 0; i < 49; i++) {
        await request(app)
          .get('/search')
          .expect(200);
      }

      // 50th request should succeed (at limit)
      await request(app)
        .get('/search')
        .expect(200);

      // 51st request should be blocked
      const response = await request(app)
        .get('/search')
        .expect(429);

      expect(response.body.error).toBe('Too many searches');
      expect(response.body.message).toContain('Search limit exceeded');
    });
  });

  describe('Rate Limit Headers', () => {
    it('should include retry-after header in rate limit responses', async () => {
      // Exceed rate limit first
      for (let i = 0; i < 101; i++) {
        await request(app)
          .post('/api/test');
      }

      const response = await request(app)
        .post('/api/test')
        .expect(429);

      expect(response.body.retryAfter).toBeDefined();
      expect(typeof response.body.retryAfter).toBe('number');
    });
  });

  describe('Different IP Addresses', () => {
    it('should track rate limits per IP address', async () => {
      // Simulate different IPs by setting X-Forwarded-For header
      const ip1 = '192.168.1.1';
      const ip2 = '192.168.1.2';

      // IP1 makes 99 requests (just under limit)
      for (let i = 0; i < 99; i++) {
        await request(app)
          .post('/api/test')
          .set('X-Forwarded-For', ip1)
          .expect(200);
      }

      // IP1 makes 100th request (at limit)
      await request(app)
        .post('/api/test')
        .set('X-Forwarded-For', ip1)
        .expect(200);

      // IP2 should still be able to make requests
      await request(app)
        .post('/api/test')
        .set('X-Forwarded-For', ip2)
        .expect(200);

      // IP1 should be blocked
      const response = await request(app)
        .post('/api/test')
        .set('X-Forwarded-For', ip1)
        .expect(429);

      expect(response.body.error).toBe('Too many requests');
    });
  });
});
