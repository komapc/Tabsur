const pgConfig = require("./dbConfig.js");
var pg = require('pg');
let config = process.env.NODE_ENV === "debug" ? pgConfig.pgConfigLocal : pgConfig.pgConfigProduction;
var pool = new pg.Pool(config);
module.exports = pool;