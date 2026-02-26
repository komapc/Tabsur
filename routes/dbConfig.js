// Development configuration
const devConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'coolanu',
  user: process.env.DB_USER || 'coolanu',
  password: process.env.DB_PASSWORD || 'koolanu',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

// Test configuration
const testConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'coolanu_test',
  user: process.env.DB_USER || 'coolanu',
  password: process.env.DB_PASSWORD || 'koolanu',
  ssl: false
};

// Production configuration
const prodConfig = {
  host: process.env.DB_HOST || process.env.PG_HOST,
  port: process.env.DB_PORT || process.env.PG_PORT || 5432,
  database: process.env.DB_NAME || process.env.PG_DATABASE || 'coolanu',
  user: process.env.DB_USER || process.env.PG_USER || 'coolanu',
  password: process.env.DB_PASSWORD || process.env.PG_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? {
    ca: process.env.PG_SSL_CA,
    cert: process.env.PG_SSL_CERT,
    key: process.env.PG_SSL_KEY,
    rejectUnauthorized: false
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};

module.exports = { dev: devConfig, test: testConfig, prod: prodConfig };
