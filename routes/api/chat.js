const pgConfig = require("./../dbConfig.js");

var addNotification = require('./notifications');
let currentConfig = pgConfig.pgConfigProduction;

if (process.env.NODE_ENV === "debug") {
  currentConfig = pgConfig.pgConfigLocal;
}
const { Client } = require("pg");
const express = require("express");
const router = express.Router();

// @route GET api/chat/
// @desc get a chat info for the user
// @access Public
router.get("/:id", async (req, response) => {
  const client = new Client(currentConfig);
  var userId = req.params.id;
  console.log(`get chat messages for user ${userId}`);
  if (isNaN(userId))
  {
    return response.status(400).json("Error in geting  meals: wrong ID");
   // userId = -1;
  }
  //todo: get messages with  reveiver OR sender, top 1 for every user
  const SQLquery = `SELECT id, receiver, sender, message_text, created_at FROM  notifications 
    WHERE note_type=0  AND  sender=$1 `;
  console.log(`get, SQLquery: [${SQLquery}]`);
  await client.connect();

  return client.query(SQLquery, [userId])
    .then(resp => {
      response.json(resp.rows);
      client.end();
    })
    .catch(err => {
      console.log(err);
      response.status(500).json(err);
      client.end();
    })
    .finally(()=>client.end() );
})

// @route GET api/user/
// @desc get a chat messages for a specific user
// @access Public
router.get("user/:me/:user", async (req, response) => {
  const client = new Client(currentConfig);
  var meId = req.params.id;
  var userId = req.params.user
  console.log(`get chat messages between ${meId} and ${userId}`);
  if (isNaN(userId))
  {
    return response.status(400).json("Error in geting  meals: wrong ID");
   // userId = -1;
  }
  //todo: get messages with  reveiver OR sender, top 1 for every user
  const SQLquery = `SELECT id, receiver, sender, message_text, created_at FROM  notifications 
    WHERE note_type=0  AND  ( (sender=$1 AND receiver=$2) OR (sender=$2 AND receiver=$1)`;
  console.log(`get, SQLquery: [${SQLquery}]`);
  await client.connect();

  return client.query(SQLquery, [userId, meId])
    .then(resp => {
      response.json(resp.rows);
      client.end();
    })
    .catch(err => {
      console.log(err);
      response.status(500).json(err);
      client.end();
    })
    .finally(()=>client.end() );
})


module.exports = router;
