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

function pushNotification(notification, registration_ids)
{
  fcm.sendNotification(JSON.stringify({
    data: notification,
    "registration_ids": registration_ids //resp.rows[0].tokens.split(';')
  })) 
  .then(function(response) {
    console.log(JSON.stringify(response.body()));
    return response.json(response);
  })
  .catch(error)
  {
    console.log(`Error: ${JSON.stringify(error)}`);
  }
}

const addNotificationToDB = async (message) =>
{

//example of param:
// const message =
// {
//   title: 'Attend', 
//   body:  'A user wants to join your meal', 
//   icon: 'resources/Message-Bubble-icon.png', 
//   click_action: '/Meals/',
//   receiver: attend.user_id,
//   meal_id:  attend.meal_id,
//   sender: -1,
//   type: 5
// }



  // const query = `
  //   INSERT INTO messages (sender, receiver, status, message) 
  //   VALUES ($1, $2, $3, $4) 
  //   RETURNING 
  //   id AS message_id,
  //   (
  //     SELECT array_to_string(array_agg(token),';') 
  //     AS tokens 
  //     FROM user_tokens
  //     WHERE user_id=$5
  //   )`;

  // const query = `
  // INSERT INTO notifications (meal_id, receiver, message_text, sender, note_type, 
  //       click_action, icon, title) 
  //     VALUES (
  //       $1, 
  //       (SELECT host_id FROM meals WHERE id=$1), 
  //       CONCAT((SELECT name FROM users WHERE id=$2),' wants to join your meal.'),
  //       0, 
  //       5,
  //       $3, $4, $5
  //       )  
  //     RETURNING (
  //       SELECT array_to_string(array_agg(token),';') 
  //       AS tokens 
  //       FROM user_tokens
  //       WHERE user_id=(SELECT host_id FROM meals WHERE id=$1)
  //     ),
  //     CONCAT((SELECT name FROM users WHERE id=$2), ' wants to join your meal.') AS body
  //   `;

   const query = `
  INSERT INTO notifications (meal_id, receiver, message_text, sender, note_type, 
        click_action, icon, title) 
      VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8)

      RETURNING (
              SELECT array_to_string(array_agg(token),';') 
              AS tokens 
              FROM user_tokens
              WHERE user_id=$2 
            )
    `;
  const client = new Client(currentConfig);
  await client.connect();
  client.query(query,     
    [message.meal_id, 
      message.receiver,
      message.body, 
      message.sender, 
      message.type,
      message.click_action, 
      message.icon,
      message.title, 
     ]
      )
  .then(resp => {
    console.log(`Message id: ${resp.rows[0].message_id} inserted sucssesfuly`);
    return resp;
  })
  .catch(error => {
    console.error(error); 
    return response.status(500).json(error); 
  })
  .finally(() => {
    client.end();
  });
}
//add notificatin/message to the DB + push 
function addNotification(notification)
{
  const  resp =  addNotificationToDB(notification);
  pushNotification(notification, resp);
}


// @route GET api/notifications
// @desc get list og user's notifications
// @access Public
router.get("/:id", async (req, response)=> {
  const id = req.params.id;
  if (isNaN(id)) {
    console.log("error, empty id");
    return response.status(400).json("Error in getting notifications: empty id");
  }
  console.log("get notifications " + id);
  const client = new Client(currentConfig);
  await client.connect();
  client.query(`SELECT * FROM  notifications WHERE user_id=$1 AND status<3`, [id])
  .then(resp => {
    return response.json(resp.rows);
  })
  .catch(err => {
    console.log(err); 
    return response.status(500).json(err); 
  })
  .finally(() => {
    client.end();
  });
});


// @route PUT api/notifications
// @desc sets notification's status
// @access Public!??
router.put("/:id", async (req, response)=> {
  const id = req.params.id;
  if (isNaN(id)) {
    console.log("error, empty id");
    return response.status(400).json("Error in getting notifications: empty id");
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
    return response.json(resp.rows);
  })
  .catch(err => {
    console.error(err); 
    return response.status(500).json(err); 
  })
  .finally(() => {
    client.end();
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
    return response.json(resp.rows);
  })
  .catch(err => {
    console.log(err); 
    return response.status(500).json(err); 
  })
  .finally(() => {
    client.end();
  });
});

router.post("/send-message", async (req, response)=> {
  console.log(`Message: ${req.body.message} from ${req.body.sender} to ${req.body.receiver}`);

  const client = new Client(currentConfig);

  const message =
  {
    title: 'Message', 
    body: req.body.message, 
    icon: 'resources/Message-Bubble-icon.png', 
    click_action: '/User/req.body.receiver',
    receiver: req.body.receiver,
    meal_id:  -1,
    sender: req.body.sender,
    type: 0
  }


  addNotification(message);
});

module.exports = router;

exports.addNotification = addNotification;
