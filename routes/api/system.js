const express = require('express');
const AWS = require('aws-sdk');
const keys = require("../../config/keys");
const router = express.Router();

const pgConfig = require("./../dbConfig.js");
let currentConfig = pgConfig.pgConfigProduction;

if (process.env.NODE_ENV === "debug") {
  currentConfig = pgConfig.pgConfigLocal;
}
const { Client } = require("pg");

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: keys.AWS_KEY,//process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


// @route GET api/system/
// @desc get a hungry list
// @access Public
router.get("/users", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get hungry for user ${req.params.id}`);

  const SQLquery = `
  SELECT * from users`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  client.query(SQLquery, [req.params.id])
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      response.json(resp.rows);
      client.end();
    })
    .catch(err => {
      client.end();
      console.log(err);
      return response.status(500).json(err);
    });
})
module.exports = router;