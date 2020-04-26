const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//const passport = require("passport");
const pgConfig = require("../dbConfig.js");
const { Client } = require("pg");

let currentConfig = pgConfig.pgConfigProduction;
if (process.env.NODE_ENV === "debug")
{
  currentConfig = pgConfig.pgConfigLocal;
}

// @route GET api/notifications/get
// @desc get public user properties
// @access Public
router.get("/get/:id", async (req, response) => {
  // Find the user
  const client = new Client(currentConfig);
  await client.connect();
  await client.query('SELECT * FROM  notifications',
    [newReq.user_id])
    .then(user => {
      response.json(resp.rows);
      client.end();
    })
    .catch(err => { console.log(err); return response.status(500).json("No user"); });
});

module.exports = router;
