const pgConfig = require('./dbConfig.js');
const pg = require('pg');

let config;
if (process.env.NODE_ENV === 'test') {
  config = pgConfig.pgConfigTest;
} else if (process.env.NODE_ENV === 'debug') {
  config = pgConfig.pgConfigLocal;
} else {
  config = pgConfig.pgConfigProduction;
}

const pool = new pg.Pool(config);

module.exports = pool;