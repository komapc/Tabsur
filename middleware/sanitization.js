const DOMPurify = require('isomorphic-dompurify');

/**
 * Input sanitization middleware
 * Prevents XSS attacks and sanitizes user inputs
 */
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize body parameters
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = DOMPurify.sanitize(req.body[key], {
            ALLOWED_TAGS: [], // No HTML tags allowed
            ALLOWED_ATTR: []  // No attributes allowed
          });
        }
      });
    }

    // Sanitize query parameters
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = DOMPurify.sanitize(req.query[key], {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
          });
        }
      });
    }

    // Sanitize URL parameters
    if (req.params) {
      Object.keys(req.params).forEach(key => {
        if (typeof req.params[key] === 'string') {
          req.params[key] = DOMPurify.sanitize(req.params[key], {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
          });
        }
      });
    }

    next();
  } catch (error) {
    console.error('Sanitization error:', error);
    res.status(400).json({ 
      error: 'Invalid input detected',
      message: 'Input contains potentially harmful content'
    });
  }
};

/**
 * Enhanced input validation middleware
 * Validates input length and format
 */
const validateInput = (req, res, next) => {
  try {
    const maxLength = 1000; // Maximum input length
    const maxArrayLength = 100; // Maximum array length

    // Validate body
    if (req.body) {
      for (const [key, value] of Object.entries(req.body)) {
        if (typeof value === 'string' && value.length > maxLength) {
          return res.status(400).json({
            error: 'Input too long',
            message: `${key} exceeds maximum length of ${maxLength} characters`
          });
        }
        
        if (Array.isArray(value) && value.length > maxArrayLength) {
          return res.status(400).json({
            error: 'Array too large',
            message: `${key} exceeds maximum array size of ${maxArrayLength} items`
          });
        }
      }
    }

    // Validate query parameters
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string' && value.length > maxLength) {
          return res.status(400).json({
            error: 'Query parameter too long',
            message: `${key} exceeds maximum length of ${maxLength} characters`
          });
        }
      }
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ 
      error: 'Input validation failed',
      message: 'Invalid input format detected'
    });
  }
};

module.exports = {
  sanitizeInput,
  validateInput
};
