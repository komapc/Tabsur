const DOMPurify = require('isomorphic-dompurify');

/**
 * Recursively sanitize nested objects and arrays
 */
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: []  // No attributes allowed
    });
  } else if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  } else if (value && typeof value === 'object') {
    const sanitized = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }
  return value;
};

/**
 * Input sanitization middleware
 * Prevents XSS attacks and sanitizes user inputs
 */
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize body parameters
    if (req.body) {
      req.body = sanitizeValue(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
      req.query = sanitizeValue(req.query);
    }

    // Sanitize URL parameters
    if (req.params) {
      req.params = sanitizeValue(req.params);
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
