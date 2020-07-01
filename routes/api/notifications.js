const express = require("express");
const router = express.Router();
const pgConfig = require("../dbConfig.js");
const { Client } = require("pg");

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
  const query=`UPDATE notifications SET "status"=${note.status} WHERE "id"=${id}`;
  console.log(query); 
  await client.connect();
  client.query(query)
    .then(resp => {
      console.log("notification status done");
      response.json("Done.");
      client.end();
    })
    .catch(err => 
      {
       console.log(err); 
       client.end();
       return response.status(500).json(err); 
      });
});

router.post("/set-token/:id", async (req, response)=> {
  const id = req.params.id;
  const token = req.body.token;

  console.log(`Insert Google Firebase Token ID: ${token} for ${id}`); 
  const client = new Client(currentConfig);
  const query = `INSERT INTO user_tokens (user_id, token_type, token) VALUES (${id}, 0, \'${token}\')`;
  console.log(query); 
  await client.connect();
  client.query(query)
    .then(resp => {
      console.log("Google Firebase Token ID saved");
      response.json("Done.");
      client.end();
    })
    .catch(err => {
      console.log(err); 
      client.end();
      return response.status(500).json(err); 
    });
});

module.exports = router;
