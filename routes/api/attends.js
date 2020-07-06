var express = require('express');
var router = express.Router();
const { Client } = require("pg");
const pgConfig = require("./../dbConfig.js");
const fetch = require('node-fetch');
let currentConfig = pgConfig.pgConfigProduction;
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
  if (isNaN(meal_id) || isNaN(user_id) || isNaN(status)) {
    return response.status(500).json("Bad input, one of the parameters is not numeric.");
  }

  await client.connect();
  client.query(`
    INSERT INTO attends (meal_id, user_id, status)
    VALUES (${meal_id}, ${user_id}, ${status}) 
    ON CONFLICT (meal_id, user_id) DO UPDATE 
    SET status = ${status} 
    WHERE attends.meal_id=${meal_id} 
    AND attends.user_id = ${user_id}
  `)
  .then((ans) => {
    if(status) {
      client.query(`
        INSERT into notifications (meal_id, user_id, message_text, sender, note_type) 
        VALUES (
          $1, 
          (SELECT host_id FROM meals WHERE id=$1), 
          CONCAT((SELECT name FROM users WHERE id=$2),' wants to join your meal.'),
          0, 
          5)  
        RETURNING (
          SELECT array_to_string(array_agg(token),';') 
          AS tokens 
          FROM user_tokens
          WHERE user_id=user_id
        ),
        CONCAT((SELECT name FROM users WHERE id=$3), ' wants to join your meal.') AS body
      `,[attend.meal_id, attend.user_id, attend.user_id])
      .catch(err => {
        console.log(err);
        client.end();
        return response.status(500).json("failed to add notification: " + err);
      })
      .then(answer => {
        fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
              'Authorization': 'key=' + process.env.GOOGLE_FIREBASE_CLOUD_MESSAGING_SERVER_KEY,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              data: {
                  title: 'Attend', 
                  body:  answer.rows[0].body, 
                  icon: 'https://icons.iconarchive.com/icons/pelfusion/long-shadow-media/128/Message-Bubble-icon.png', 
                  click_action: 'http://info.cern.ch/hypertext/WWW/TheProject.html'
              },
              "registration_ids": answer.rows[0].tokens.split(';')
          })
        }).then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log(JSON.stringify(json));
        }).catch(function(error) {
            console.error(error);
        });
        client.end();
        return response.status(201).json(answer.rows);
      })
    } else { // no notification on unnattend
      client.end();
      return response.status(201).json(ans.rows);
    }
  })
  .catch(err => {
    console.error(err);
    client.end();
    return response.status(500).json(err);
  });
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