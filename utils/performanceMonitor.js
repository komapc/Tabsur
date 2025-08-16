/**
 * Performance Monitoring Utility
 * Tracks key performance metrics for the Tabsur application
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        byEndpoint: {},
        responseTimes: [],
        errors: 0
      },
      database: {
        queries: 0,
        slowQueries: 0,
        connectionPool: {
          total: 0,
          idle: 0,
          waiting: 0
        }
      },
      memory: {
        heapUsed: 0,
        heapTotal: 0,
        external: 0
      },
      uptime: 0
    };

    this.startTime = Date.now();
    this.startMonitoring();
  }

  /**
   * Start performance monitoring
   */
  startMonitoring() {
    // Update uptime every minute
    setInterval(() => {
      this.metrics.uptime = Date.now() - this.startTime;
    }, 60000);

    // Update memory usage every 30 seconds
    setInterval(() => {
      const memUsage = process.memoryUsage();
      this.metrics.memory = {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024) // MB
      };
    }, 30000);
  }

  /**
   * Track API request
   */
  trackRequest(endpoint, method, responseTime, statusCode) {
    this.metrics.requests.total++;

    // Track by endpoint
    const key = `${method} ${endpoint}`;
    if (!this.metrics.requests.byEndpoint[key]) {
      this.metrics.requests.byEndpoint[key] = {
        count: 0,
        totalTime: 0,
        avgTime: 0,
        errors: 0
      };
    }

    const endpointStats = this.metrics.requests.byEndpoint[key];
    endpointStats.count++;
    endpointStats.totalTime += responseTime;
    endpointStats.avgTime = endpointStats.totalTime / endpointStats.count;

    if (statusCode >= 400) {
      endpointStats.errors++;
      this.metrics.requests.errors++;
    }

    // Track response times for percentile calculations
    this.metrics.requests.responseTimes.push(responseTime);
    if (this.metrics.requests.responseTimes.length > 1000) {
      this.metrics.requests.responseTimes.shift(); // Keep only last 1000
    }
  }

  /**
   * Track database query
   */
  trackDatabaseQuery(queryTime, isSlow = false) {
    this.metrics.database.queries++;
    if (isSlow) {
      this.metrics.database.slowQueries++;
    }
  }

  /**
   * Update connection pool status
   */
  updateConnectionPoolStatus(total, idle, waiting) {
    this.metrics.database.connectionPool = { total, idle, waiting };
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const responseTimes = this.metrics.requests.responseTimes;
    const sortedTimes = responseTimes.slice().sort((a, b) => a - b);

    return {
      ...this.metrics,
      performance: {
        avgResponseTime: responseTimes.length > 0
          ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
          : 0,
        p95ResponseTime: responseTimes.length > 0
          ? sortedTimes[Math.floor(responseTimes.length * 0.95)]
          : 0,
        p99ResponseTime: responseTimes.length > 0
          ? sortedTimes[Math.floor(responseTimes.length * 0.99)]
          : 0,
        requestsPerMinute: this.calculateRequestsPerMinute(),
        errorRate: this.metrics.requests.total > 0
          ? (this.metrics.requests.errors / this.metrics.requests.total * 100).toFixed(2)
          : 0
      }
    };
  }

  /**
   * Calculate requests per minute
   */
  calculateRequestsPerMinute() {
    const uptimeMinutes = this.metrics.uptime / 60000;
    return uptimeMinutes > 0 ? Math.round(this.metrics.requests.total / uptimeMinutes) : 0;
  }

  /**
   * Reset metrics (useful for testing)
   */
  reset() {
    this.metrics = {
      requests: { total: 0, byEndpoint: {}, responseTimes: [], errors: 0 },
      database: { queries: 0, slowQueries: 0, connectionPool: { total: 0, idle: 0, waiting: 0 } },
      memory: { heapUsed: 0, heapTotal: 0, external: 0 },
      uptime: 0
    };
    this.startTime = Date.now();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

module.exports = performanceMonitor;
