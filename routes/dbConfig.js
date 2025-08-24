const { Pool } = require('pg');

// Development configuration
const devConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tabsur_dev',
  user: process.env.DB_USER || 'tabsur_user',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

// Test configuration
const testConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tabsur_test',
  user: process.env.DB_USER || 'tabsur_user',
  password: process.env.DB_PASSWORD || '',
  ssl: false
};

// Production configuration
const prodConfig = {
  host: process.env.DB_HOST || process.env.PG_HOST,
  port: process.env.DB_PORT || process.env.PG_PORT || 5432,
  database: process.env.DB_NAME || process.env.PG_DATABASE || 'tabsur_prod',
  user: process.env.DB_USER || process.env.PG_USER || 'tabsur_user',
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

// Staging configuration
const stagingConfig = {
  host: process.env.DB_HOST || process.env.PG_HOST,
  port: process.env.DB_PORT || process.env.PG_PORT || 5432,
  database: process.env.DB_NAME || process.env.PG_DATABASE || 'tabsur_staging',
  user: process.env.DB_USER || process.env.PG_USER || 'tabsur_user',
  password: process.env.DB_PASSWORD || process.env.PG_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};

// Default configuration
const defaultConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tabsur',
  user: process.env.DB_USER || 'tabsur_user',
  password: process.env.DB_PASSWORD || '',
  ssl: false
};

// Create pools based on environment
const createPool = (config) => {
  return new Pool(config);
};

// Export configurations
module.exports = {
  dev: createPool(devConfig),
  test: createPool(testConfig),
  prod: createPool(prodConfig),
  staging: createPool(stagingConfig),
  default: createPool(defaultConfig)
};