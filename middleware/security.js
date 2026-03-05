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
      scriptSrc: ['\'self\'', 'https://maps.googleapis.com', 'https://accounts.google.com'],
      connectSrc: ['\'self\'', 'https://maps.googleapis.com', 'https://accounts.google.com'],
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
 * (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection are already set by helmet above)
 */
const additionalSecurityHeaders = (req, res, next) => {
  // Prevent caching of API responses
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

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
    for (const [_key, value] of Object.entries(req.body)) {
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
    for (const [_key, value] of Object.entries(req.query)) {
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
    for (const [_key, value] of Object.entries(req.params)) {
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
