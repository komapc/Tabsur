const rateLimit = require('express-rate-limit');

/**
 * General API rate limiting
 * 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: Math.ceil(15 * 60 / 1000) // seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil(15 * 60 / 1000)
    });
  }
});

/**
 * Authentication rate limiting
 * 5 attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Too many login attempts. Please try again later.',
    retryAfter: Math.ceil(15 * 60 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Too many login attempts. Please try again later.',
      retryAfter: Math.ceil(15 * 60 / 1000)
    });
  }
});

/**
 * File upload rate limiting
 * 10 uploads per hour per user (when authenticated)
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each user to 10 uploads per hour
  message: {
    error: 'Too many file uploads',
    message: 'Upload limit exceeded. Please try again later.',
    retryAfter: Math.ceil(60 * 60 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, IP if not
    return req.user ? req.user.id : req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many file uploads',
      message: 'Upload limit exceeded. Please try again later.',
      retryAfter: Math.ceil(60 * 60 / 1000)
    });
  }
});

/**
 * Meal creation rate limiting
 * 20 meals per day per user
 */
const mealCreationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 20, // limit each user to 20 meals per day
  message: {
    error: 'Too many meal creations',
    message: 'Daily meal creation limit exceeded. Please try again tomorrow.',
    retryAfter: Math.ceil(24 * 60 * 60 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many meal creations',
      message: 'Daily meal creation limit exceeded. Please try again tomorrow.',
      retryAfter: Math.ceil(24 * 60 * 60 / 1000)
    });
  }
});

/**
 * Search rate limiting
 * 50 searches per hour per IP
 */
const searchLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 searches per hour
  message: {
    error: 'Too many searches',
    message: 'Search limit exceeded. Please try again later.',
    retryAfter: Math.ceil(60 * 60 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many searches',
      message: 'Search limit exceeded. Please try again later.',
      retryAfter: Math.ceil(60 * 60 / 1000)
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
