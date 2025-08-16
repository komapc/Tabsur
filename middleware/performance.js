/**
 * Performance Monitoring Middleware
 * Tracks request performance and integrates with the performance monitor
 */

const performanceMonitor = require('../utils/performanceMonitor');

/**
 * Middleware to track request performance
 */
const performanceTracking = (req, res, next) => {
  const startTime = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;

    // Track the request
    performanceMonitor.trackRequest(
      req.path,
      req.method,
      responseTime,
      res.statusCode
    );

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

/**
 * Middleware to track database query performance
 */
const databasePerformanceTracking = (req, res, next) => {
  // Store original query function if it exists
  if (req.db && req.db.query) {
    const originalQuery = req.db.query;
    req.db.query = function(text, params, callback) {
      const startTime = Date.now();

      // Call original query
      const result = originalQuery.call(this, text, params, (err, res) => {
        const queryTime = Date.now() - startTime;
        const isSlow = queryTime > 1000; // Consider queries over 1 second as slow

        // Track the query
        performanceMonitor.trackDatabaseQuery(queryTime, isSlow);

        // Call original callback
        if (callback) callback(err, res);
      });

      return result;
    };
  }

  next();
};

/**
 * Middleware to add performance headers
 */
const performanceHeaders = (req, res, next) => {
  // Add performance-related headers
  res.set('X-Response-Time', '0ms');
  res.set('X-Performance-Monitor', 'enabled');

  next();
};

/**
 * Middleware to get performance metrics endpoint
 */
const getPerformanceMetrics = (req, res) => {
  // Only allow access in development or with proper authentication
  if (process.env.NODE_ENV === 'production' && !req.user?.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const metrics = performanceMonitor.getSummary();
  res.json(metrics);
};

module.exports = {
  performanceTracking,
  databasePerformanceTracking,
  performanceHeaders,
  getPerformanceMetrics
};
