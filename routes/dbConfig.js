module.exports = {
  pgConfigLocal : {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'coolanu',
    user: process.env.DB_USER || 'coolanu',
    password: process.env.DB_PASSWORD || '',
    ssl: false,
    // Connection pooling optimization
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    maxUses: 7500 // Close (and replace) a connection after it has been used 7500 times
  },
  pgConfigTest : {
    host: '127.0.0.1',
    port: process.env.DB_PORT || 5433,
    database: process.env.DB_NAME || 'coolanu_test',
    user: 'coolanu',
    password: process.env.DB_PASSWORD || 'coolanu',
    ssl: false,
    // Test environment pooling (smaller pool)
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 1000,
    maxUses: 1000
  },
  pgConfigProduction : {
    host: process.env.DB_HOST || process.env.PG_HOST || '3.249.94.227',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || process.env.PG_DATABASE || 'coolanu',
    user: process.env.DB_USER || process.env.PG_USER || 'coolanu_user',
    password: process.env.DB_PASSWORD || process.env.PG_PASSWORD || '',
    // Disable SSL for self-managed PostgreSQL servers
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false, // For self-signed certificates
      ca: process.env.PG_SSL_CA,
      cert: process.env.PG_SSL_CERT,
      key: process.env.PG_SSL_KEY
    } : false,
    // Production pooling optimization
    max: 25, // Larger pool for production load
    idleTimeoutMillis: 60000, // Keep connections alive longer in production
    connectionTimeoutMillis: 5000, // More generous timeout for production
    maxUses: 10000, // Higher usage limit for production
    // Statement timeout to prevent long-running queries
    statement_timeout: 30000, // 30 seconds
    query_timeout: 30000
  },
  pgConfigSelfManaged : {
    host: process.env.DB_HOST || '3.249.94.227',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'coolanu',
    user: process.env.DB_USER || 'coolanu_user',
    password: process.env.DB_PASSWORD || process.env.PG_PASSWORD || '',
    ssl: false, // Self-managed PostgreSQL servers typically don't support SSL
    // Self-managed pooling settings
    max: 20,
    idleTimeoutMillis: 45000,
    connectionTimeoutMillis: 3000,
    maxUses: 8000,
    statement_timeout: 30000,
    query_timeout: 30000
  }
};