const pgConfig = require("./dbConfig.js");
var pg = require('pg');
var pool = new pg.Pool(pgConfig.pgConfigProduction);

module.exports = pool;