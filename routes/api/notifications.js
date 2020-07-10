const express = require("express");
const router = express.Router();
const pgConfig = require("../dbConfig.js");
const { Client } = require("pg");
const fcm = require('../firebaseCloudMessages');

let currentConfig = pgConfig.pgConfigProduction;
if (process.env.NODE_ENV === "debug")
{
  currentConfig = pgConfig.pgConfigLocal;
}

// @route GET api/notifications
// @desc get list og user's notifications
// @access Public
router.get("/:id", async (req, response)=> {
  const id = req.params.id;
  if (isNaN(id)) {
    console.log("error, empty id");
    response.status(400).json("Error in getting notifications: empty id");
    return;
  }
  console.log("get notifications " + id);
  const client = new Client(currentConfig);
  await client.connect();
  client.query(`SELECT * FROM  notifications WHERE 
      user_id=${id} AND status<3`)
    .then(resp => {
      //console.log("got results " + JSON.stringify(resp.rows));
      response.json(resp.rows);
      client.end();
    })
    .catch(err => 
      {
       console.log(err); 
       client.end();
       return response.status(500).json(err); 
      });
});


// @route PUT api/notifications
// @desc sets notification's status
// @access Public!??
router.put("/:id", async (req, response)=> {
  const id = req.params.id;
  if (isNaN(id)) {
    console.log("error, empty id");
    response.status(400).json("Error in getting notifications: empty id");
    return;
  }
  const note=req.body;
  console.log(`change notification's status ${id} for ${JSON.stringify(note)}`); 
  const client = new Client(currentConfig);
  const query=`UPDATE notifications SET "status"=$1 WHERE "id"=$2 RETURNING id`;

  console.log(query); 
  await client.connect();
  client.query(query, [note.status, id])
    .then(resp => {
      console.log("notification status done.");
      response.json(resp.rows);
      client.end();
    })
    .catch(err => 
      {
       console.log(err); 
       client.end();
       return response.status(500).json(err); 
      });
});

router.post("/token/:id", async (req, response)=> {
  const id = req.params.id;
  const token = req.body.token;

  console.log(`Insert Google Firebase Token ID: ${token} for ${id}`); 
  const client = new Client(currentConfig);
  const query = `
    INSERT INTO user_tokens (user_id, token_type, token) 
    SELECT $1, 0, $2 
    WHERE NOT EXISTS (
      SELECT 1 FROM user_tokens WHERE user_id=$3 AND token=$4
    ) 
    RETURNING token`;
  await client.connect();
  client.query(query, [id, token, id, token])
    .then(resp => {
      console.log(`Google Firebase Token ID responsed`);
      response.json(resp.rows);
      client.end();
    })
    .catch(err => {
      console.log(err); 
      client.end();
      return response.status(500).json(err); 
    });
});

router.post("/send-message", async (req, response)=> {
  console.log(`Message: ${req.body.message} from ${req.body.sender} to ${req.body.receiver}`);

  const client = new Client(currentConfig);
  const query = `
    INSERT INTO messages (sender, receiver, status) 
    VALUES ($1, $2, $3) 
    RETURNING (
      SELECT array_to_string(array_agg(token),';') 
      AS tokens 
      FROM user_tokens
      WHERE user_id=(SELECT host_id FROM meals WHERE id=$4)
    )`; // TODO: save also message and return id of the message when DB ready
  await client.connect();
  client.query(query, [req.body.sender, req.body.receiver, 0, req.body.receiver])
  .then(resp => {
    console.log(`Message inserted`);
    // TODO: fcm.sendNotification("message");
    response.json(resp.rows);
  })
  .catch(err => {
    console.error(err); 
    return response.status(500).json(err); 
  })
  .finally(() => {
    client.end();
  });
});

module.exports = router;
