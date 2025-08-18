const pgConfig = require('./dbConfig.js');
const pg = require('pg');

let config;
if (process.env.NODE_ENV === 'test') {
  config = pgConfig.pgConfigTest;
} else if (process.env.NODE_ENV === 'debug') {
  config = pgConfig.pgConfigLocal;
} else if (process.env.NODE_ENV === 'production' && process.env.DB_SSL === 'false') {
  // Use self-managed configuration for production with self-managed PostgreSQL
  config = pgConfig.pgConfigSelfManaged;
} else {
  // Default to production configuration (with SSL if enabled)
  config = pgConfig.pgConfigProduction;
}

const pool = new pg.Pool(config);

module.exports = pool;