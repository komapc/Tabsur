require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const sslRedirect = require('heroku-ssl-redirect');

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

// Security middleware
app.use(sslRedirect());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));

// Health check endpoint (before other routes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/users', users);
app.use('/api/meals', meals);
app.use('/api/hungry', hungry);
app.use('/api/attends', attends);
app.use('/api/follow', follow);
app.use('/api/notifications', notifications);
app.use('/api/chat', chat);
app.use('/api/images', images);
app.use('/api/system', system);

// Serve static assets in production
console.log('server.js, env =', process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'debug') {
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
  console.log(`CORS Origin: ${corsOptions.origin}`);
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