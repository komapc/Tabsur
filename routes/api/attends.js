var addNotification = require('./notificationsPush');
var express = require('express');
var router = express.Router();
const { Client } = require("pg");


const pgConfig = require("./../dbConfig.js");
let currentConfig = pgConfig.pgConfigProduction;
const fcm = require('../firebaseCloudMessages');
if (process.env.NODE_ENV === "debug") {
  currentConfig = pgConfig.pgConfigLocal;
}

/* GET attend by meal */
router.get('/meal/:meal_id', function (req, res, next) {
  attend.find({ meal_id: req.params.meal_id }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE attend */
router.post('/:id', async (req, response) => {
  const attend = req.body;
  console.log("Attend, request: " + JSON.stringify(attend));

  const client = new Client(currentConfig);
  const meal_id = attend.meal_id;
  const user_id = attend.user_id;
  const status = attend.status;


  try {
    
  if (isNaN(meal_id) || isNaN(user_id) || isNaN(status)) {
    return response.status(500).json("Bad input, one of the parameters is not numeric.");
  }

  await client.connect();
  let ans = await client.query(`
    INSERT INTO attends (meal_id, user_id, status)
    VALUES ($1, $2, $3) 
    ON CONFLICT (meal_id, user_id) DO UPDATE 
    SET status = $4
    WHERE attends.meal_id=$5
    AND attends.user_id = $6
    RETURNING (SELECT host_id FROM meals WHERE id=$7)
  `, [meal_id, user_id, status, status, meal_id, user_id, meal_id])
  // .then((ans) => {
    if(status) {
      const message =
      {
        title: 'Attend', 
        body:  'A user wants to join your meal', 
        icon: 'resources/Message-Bubble-icon.png', 
        click_action: '/Meals/',
        receiver: attend.user_id,//(SELECT host_id FROM meals WHERE id=$1)
        meal_id:  attend.meal_id,
        sender: -1,
        type: 5
      }
      addNotification(message);

      return response.status(201).json(ans.rows);
      // client.query(`
      //   INSERT INTO notifications (meal_id, receiver, message_text, sender, note_type, 
      //     click_action, icon, title) 
      //   VALUES (
      //     $1, 
      //     (SELECT host_id FROM meals WHERE id=$1), 
      //     CONCAT((SELECT name FROM users WHERE id=$2),' wants to join your meal.'),
      //     0, 
      //     5,
      //     $3, $4, $5
      //     )  
      //   RETURNING (
      //     SELECT array_to_string(array_agg(token),';') 
      //     AS tokens 
      //     FROM user_tokens
      //     WHERE user_id=(SELECT host_id FROM meals WHERE id=$1)
      //   ),
      //   CONCAT((SELECT name FROM users WHERE id=$2), ' wants to join your meal.') AS body
      // `,[attend.meal_id, attend.user_id,'/Meals/', 'resources/Message-Bubble-icon.png', Attend])
      // .catch(err => {
      //   console.log(err);
      //   client.end();
      //   return response.status(500).json("failed to add notification: " + err);
      // })
      // .then(answer => {
      //   fcm.sendNotification(JSON.stringify({
      //     data: {
      //         title: 'Attend', 
      //         body:  answer.rows[0].body, 
      //         icon: 'resources/Message-Bubble-icon.png', 
      //         click_action: '/Meals/'
      //     },
      //     "registration_ids": answer.rows[0].tokens.split(';')
      //   }),
      //   answer.rows[0].tokens.split(';'))
      //   .then(function(response) {
      //     console.log(JSON.stringify(response));
      //   }).catch(function(error) {
      //       console.error(error);
      //   });
      //   return response.status(201).json(answer.rows);
      // })
    } else { // no notification on unnattend
      return response.status(201).json(ans.rows);
    }
  } catch (error) {
    console.error(err);
    return response.status(500).json(err);
  } finally {
    client.end();
  }
});

/* UPDATE attend */
router.put('/:id', function (req, res, next) {
  return response.status(500).json("failed to update - not implemented");
});

/* DELETE attend */
router.delete('/:id', async (req, res, next) => {
  console.log("Attend, " + currentConfig.user);
  const attend = req.body;
  const client = new Client(currentConfig);
  await client.connect();

  console.log("connected");
  client.query('DELETE FROM attends WHERE ' +
    'meal_id = $1 AND user_id=$2',
    [attend.meal_id, attend.user_id])
    .catch(err => { console.log(err); return response.status(500).json("failed to delete"); })
    .then(answer => { return response.status(201).json(answer); });
});

module.exports = router;