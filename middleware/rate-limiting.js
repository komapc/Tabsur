const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

/**
 * General API rate limiting
 * 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: 15 * 60
    });
  }
});

/**
 * Authentication rate limiting
 * 5 attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Too many authentication attempts',
    message: 'Too many login attempts. Please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Too many login attempts. Please try again later.',
      retryAfter: 15 * 60
    });
  }
});

/**
 * File upload rate limiting
 * 10 uploads per hour per user (when authenticated)
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error: 'Too many file uploads',
    message: 'Upload limit exceeded. Please try again later.',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user ? req.user.id : ipKeyGenerator(req),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many file uploads',
      message: 'Upload limit exceeded. Please try again later.',
      retryAfter: 60 * 60
    });
  }
});

/**
 * Meal creation rate limiting
 * 20 meals per day per user
 */
const mealCreationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 20,
  message: {
    error: 'Too many meal creations',
    message: 'Daily meal creation limit exceeded. Please try again tomorrow.',
    retryAfter: 24 * 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user ? req.user.id : ipKeyGenerator(req),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many meal creations',
      message: 'Daily meal creation limit exceeded. Please try again tomorrow.',
      retryAfter: 24 * 60 * 60
    });
  }
});

/**
 * Search rate limiting
 * 50 searches per hour per IP
 */
const searchLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: {
    error: 'Too many searches',
    message: 'Search limit exceeded. Please try again later.',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many searches',
      message: 'Search limit exceeded. Please try again later.',
      retryAfter: 60 * 60
    });
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  mealCreationLimiter,
  searchLimiter
};
