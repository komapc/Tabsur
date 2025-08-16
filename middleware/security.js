const helmet = require('helmet');

/**
 * Security middleware configuration
 * Implements security best practices and headers
 */
const securityMiddleware = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
      fontSrc: ['\'self\'', 'https://fonts.gstatic.com'],
      imgSrc: ['\'self\'', 'data:', 'https:'],
      scriptSrc: ['\'self\'', 'https://maps.googleapis.com'],
      connectSrc: ['\'self\'', 'https://maps.googleapis.com'],
      frameSrc: ['\'none\''],
      objectSrc: ['\'none\''],
      upgradeInsecureRequests: []
    }
  },

  // Cross-Origin settings
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },

  // DNS prefetch control
  dnsPrefetchControl: { allow: false },

  // Expect-CT header
  expectCt: { enforce: true, maxAge: 30 },

  // Frameguard
  frameguard: { action: 'deny' },

  // Hide powered-by header
  hidePoweredBy: true,

  // HSTS
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },

  // IE No Open
  ieNoOpen: true,

  // NoSniff
  noSniff: true,

  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

  // XSS Protection
  xssFilter: true
});

/**
 * Additional security headers middleware
 */
const additionalSecurityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Prevent caching of sensitive data
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // Remove server information
  res.removeHeader('Server');

  next();
};

/**
 * SQL Injection protection middleware
 * Basic protection against common SQL injection patterns
 */
const sqlInjectionProtection = (req, res, next) => {
  const sqlPatterns = [
    /\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)\b/i,
    /\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)\s+/i,
    /\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)\s*\(/i,
    /\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)\s*=/i
  ];

  const checkValue = (value) => {
    if (typeof value === 'string') {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    return false;
  };

  // Check body
  if (req.body) {
    for (const [key, value] of Object.entries(req.body)) {
      if (checkValue(value)) {
        return res.status(400).json({
          error: 'Invalid input detected',
          message: 'Input contains potentially harmful content'
        });
      }
    }
  }

  // Check query parameters
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (checkValue(value)) {
        return res.status(400).json({
          error: 'Invalid query parameter',
          message: 'Query parameter contains potentially harmful content'
        });
      }
    }
  }

  // Check URL parameters
  if (req.params) {
    for (const [key, value] of Object.entries(req.params)) {
      if (checkValue(value)) {
        return res.status(400).json({
          error: 'Invalid URL parameter',
          message: 'URL parameter contains potentially harmful content'
        });
      }
    }
  }

  next();
};

module.exports = {
  securityMiddleware,
  additionalSecurityHeaders,
  sqlInjectionProtection
};
