require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const sslRedirect = require('heroku-ssl-redirect');
const compression = require('compression');

// Import security middleware
const { securityMiddleware, additionalSecurityHeaders, sqlInjectionProtection } = require('./middleware/security');
const { sanitizeInput, validateInput } = require('./middleware/sanitization');
const {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  mealCreationLimiter,
  searchLimiter
} = require('./middleware/rate-limiting');
const {
  performanceTracking,
  databasePerformanceTracking,
  performanceHeaders,
  getPerformanceMetrics
} = require('./middleware/performance');
// Import routes
const users = require('./routes/api/users');
const meals = require('./routes/api/meals');
const follow = require('./routes/api/follow');
const attends = require('./routes/api/attends');
const hungry = require('./routes/api/hungry');
const notifications = require('./routes/api/notifications');
const images = require('./routes/api/images');
const chat = require('./routes/api/chat');
const system = require('./routes/api/system');
const admin = require('./routes/api/admin');

const app = express();

// Performance optimization middleware
app.use(compression({
  level: 6, // Balanced compression level
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress responses with this request header
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression by default
    return compression.filter(req, res);
  }
}));

// Security middleware - only use SSL redirect in production with proper SSL setup
if (process.env.NODE_ENV === 'production' && process.env.FORCE_HTTPS === 'true') {
  app.use(sslRedirect());
}

// Security and protection middleware
app.use(securityMiddleware);
app.use(additionalSecurityHeaders);
app.use(sqlInjectionProtection);

// CORS middleware for local development
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN || 'https://localhost:3000'
    : ['http://localhost:3000', 'https://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// CORS is handled by nginx proxy in production

// Body parser middleware with optimized limits
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Input sanitization and validation middleware
app.use(sanitizeInput);
app.use(validateInput);

// Performance monitoring middleware
app.use(performanceTracking);
app.use(databasePerformanceTracking);
app.use(performanceHeaders);

// Health check endpoint (before other routes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Performance metrics endpoint
app.get('/performance', getPerformanceMetrics);

// Sanity check endpoint for JWT configuration
app.get('/sanity-check', (req, res) => {
  const jwtSecret = process.env.SECRET_OR_KEY;
  const hasJwtSecret = !!jwtSecret && jwtSecret !== 'your-super-secret-jwt-key-change-this';
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    jwt: {
      hasSecret: hasJwtSecret,
      secretLength: jwtSecret ? jwtSecret.length : 0,
      isDefault: !hasJwtSecret,
      environment: process.env.NODE_ENV
    },
    server: {
      port: process.env.PORT || 5000,
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    }
  });
});

// Apply general API rate limiting
app.use('/api/', apiLimiter);

// API Routes with specific rate limiting
app.use('/api/users', authLimiter, users);
app.use('/api/meals', mealCreationLimiter, meals);
app.use('/api/hungry', searchLimiter, hungry);
app.use('/api/attends', apiLimiter, attends);
app.use('/api/follow', apiLimiter, follow);
app.use('/api/notifications', apiLimiter, notifications);
app.use('/api/chat', apiLimiter, chat);
app.use('/api/images', uploadLimiter, images);
app.use('/api/system', apiLimiter, system);
app.use('/api/admin', apiLimiter, admin);

// Serve static assets in production
console.log('server.js, env =', process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'production') {
  // Serve static files from React build
  app.use(express.static('client/build'));

  // Catch all handler: send back React's index.html file (but only for non-API routes)
  app.get('*', (req, res, next) => {
    // Skip API routes - let them be handled by their respective routers
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.resolve(process.env.PWD, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'debug') {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
      stack: err.stack
    });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`CORS handled by nginx proxy`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

module.exports = app;