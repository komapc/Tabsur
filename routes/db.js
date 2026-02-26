const pg = require('pg');
const dbConfig = require('./dbConfig.js');

let config;
if (process.env.NODE_ENV === 'test') {
  config = dbConfig.test;
} else if (process.env.NODE_ENV === 'debug') {
  config = dbConfig.dev;
} else {
  config = dbConfig.prod;
}

const pool = new pg.Pool(config);

module.exports = pool;
