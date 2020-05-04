const express = require("express");
const router = express.Router();
const pgConfig = require("../dbConfig.js");
const { Client } = require("pg");

let currentConfig = pgConfig.pgConfigProduction;
if (process.env.NODE_ENV === "debug")
{
  currentConfig = pgConfig.pgConfigLocal;
}

// @route GET api/notifications/get
// @desc get list og user's notifications
// @access Public
router.get("/get/:id", async (req, response)=> {
  console.log("get notifications " + req.params.id);
  const client = new Client(currentConfig);
  await client.connect();
  await client.query(`SELECT * FROM  notifications WHERE `+
      `user_id=${req.params.id} AND status<3`)
    .then(resp => {
      console.log("got results " + JSON.stringify(resp.rows));
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
  const note=req.body;
  console.log(`change notification's status ${req.params.id} for ${JSON.stringify(note)}`); 
  const client = new Client(currentConfig);
  const query=`UPDATE notifications SET "status"=${note.status} WHERE "id"=${req.params.id}`;
  console.log(query); 
  await client.connect();
  await client.query(query)
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

module.exports = router;
