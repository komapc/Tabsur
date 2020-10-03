const pool = require("../db.js");
const authenticateJWT = require('../authenticateJWT.js');
var addNotification = require('./notificationsPush');
var express = require('express');
var router = express.Router();

/* GET attend by meal */
router.get('/meal/:meal_id', authenticateJWT, function (req, res, next) {
  attend.find({ meal_id: req.params.meal_id }, function (err, post) {
    if (err) return next(err); // Why only here using next?
    res.json(post);
  });
});

/* SAVE attend */
router.post('/:id', authenticateJWT, async (req, response) => {
  const attend = req.body;
  console.log("Attend, request: " + JSON.stringify(attend));

  const meal_id = attend.meal_id;
  const user_id = attend.user_id;
  const status = attend.status;

  if (isNaN(meal_id) || isNaN(user_id) || isNaN(status)) {
    return response.status(500).json("Bad input, one of the parameters is not numeric.");
  }

  const client = await pool.connect();
  return client.query(`
    INSERT INTO attends (meal_id, user_id, status)
    VALUES ($1, $2, $3) 
    ON CONFLICT (meal_id, user_id) DO UPDATE 
    SET status = $4
    WHERE attends.meal_id=$5
    AND attends.user_id = $6
    RETURNING (SELECT host_id FROM meals WHERE id=$7)
  `, [meal_id, user_id, status, status, meal_id, user_id, meal_id])
    .then(ans => {
      if (status) {
        console.log(`Answer: ${JSON.stringify(ans.rows[0])}`);
        const host=ans.rows[0].host_id;
        const message =
        {
          title: 'Attend',
          body: 'A user wants to join your meal',
          icon: 'resources/Message-Bubble-icon.png',
          click_action: '/',
          receiver: host,
          meal_id: attend.meal_id,
          sender: -1,
          type: 5
        }
        addNotification(message);

        return response.status(201).json(ans.rows);

      } else { // no notification on unnattend
        return response.status(201).json(ans.rows);
      }
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json(error);
    })
    .finally(() => {
      client.release();
    });
});

/* UPDATE attend */
router.put('/:id', authenticateJWT, function (req, res, next) {
  return response.status(500).json("failed to update - not implemented");
});

/* DELETE attend */
router.delete('/:id', authenticateJWT, async (req, response, next) => {
  console.log("Attend, " + currentConfig.user);
  const attend = req.body;
  const client = await pool.connect();

  console.log("connected");
  client.query('DELETE FROM attends WHERE ' +
    'meal_id = $1 AND user_id=$2',
    [attend.meal_id, attend.user_id])
    .catch(err => { console.error(err); return response.status(500).json("failed to delete"); })
    .then(answer => { return response.status(201).json(answer); })
    .finally(()=>client.release())
});

module.exports = router;