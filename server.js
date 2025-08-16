require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const sslRedirect = require('heroku-ssl-redirect');

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

const app = express();

// Security middleware - only use SSL redirect in production with proper SSL setup
if (process.env.NODE_ENV === 'production' && process.env.FORCE_HTTPS === 'true') {
  app.use(sslRedirect());
}

// Security and protection middleware
app.use(securityMiddleware);
app.use(additionalSecurityHeaders);
app.use(sqlInjectionProtection);

// CORS is handled by nginx proxy

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));

// Input sanitization and validation middleware
app.use(sanitizeInput);
app.use(validateInput);

// Health check endpoint (before other routes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

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

// Serve static assets in production
console.log('server.js, env =', process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'production') {
  // Serve static files from React build
  app.use(express.static('client/build'));

  // Catch all handler: send back React's index.html file
  app.get('*', (req, res) => {
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