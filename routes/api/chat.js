const pool = require("../db.js");
const {authenticateJWT} = require('../authenticateJWT.js');
const express = require("express");
const router = express.Router();

// @route GET api/chat/
// @desc get a chat info for the user
// @access Public
router.get("/:id", authenticateJWT, async (req, response) => {
  var userId = req.params.id;
  console.log(`get chat messages for user ${userId}`);
  if (isNaN(userId)) {
    return response.status(400).json("Error in geting  meals: wrong ID");
    // userId = -1;
  }
  //todo: get messages with  reveiver OR sender, top 1 for every user // name1 - receiverName, name2 - senderName
  const SQLquery = `
  SELECT 
    (select name FROM users where id=receiver) as name1, 
    (select name FROM users where id=sender) as name2, 
    id, 
    receiver, 
    sender, 
    message_text, 
    created_at 
  FROM notifications
  WHERE id IN
  (
    SELECT MAX(id) as id
    FROM
      (SELECT 
        ( 
          CASE 
            WHEN (receiver=$1) 
            THEN (select id FROM users where id=sender) 
            ELSE (select id FROM users where id=receiver) 
          END
        ) as interlocutor_id, 
        MAX(id) as id, 
        receiver, 
        sender
      FROM  notifications 
      WHERE note_type=0 AND (sender=$1 OR receiver=$1)
      GROUP BY 
        receiver, 
        sender
      ORDER BY 
        interlocutor_id) AS pona 
    GROUP BY interlocutor_id
  ) 
  `;
  console.log(`get, SQLquery: [${SQLquery}]`);
  const client = await pool.connect();

  return client.query(SQLquery, [userId])
    .then(resp => {
      return response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => client.release());
})

// @route GET api/user/
// @desc get a chat messages for a specific user
// @access Public
router.get("/user/:me/:user", authenticateJWT, async (req, response) => {
  console.log(`here`);
  var meId = req.params.me;
  var userId = req.params.user
  console.log(`Get chat messages between ${meId} and ${userId}.`);
  if (isNaN(userId)) {
    return response.status(400).json("Error in geting meals: wrong ID");
  }
  //todo: get messages between two users
  const SQLquery = `SELECT 
  (select "name" as name1 FROM "users" where id=n.receiver), 
  (select "name" as name2 FROM "users" where id=n.sender),
  id, receiver, sender, message_text, created_at FROM  notifications  as n
  WHERE n.note_type=0  AND  ( (n.sender=$1 AND n.receiver=$2)  OR (n.sender=$2 AND n.receiver=$1))
    `;
  console.log(`get, SQLquery: [${SQLquery}], me: ${meId}, her: ${userId}`);
  const client = await pool.connect();

  return client.query(SQLquery, [userId, meId]
    )
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      return response.json(resp.rows);
    })
    .catch(err => {
      console.error(`Query failed: ${JSON.stringify(err)}`);
      return response.status(500).json(err);
    })
    .finally(() => client.release());
})

module.exports = router;  
