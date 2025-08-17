const pool = require('../db.js');
const { authenticateJWT, tryAuthenticateJWT } = require('../authenticateJWT.js');
const addNotification = require('./notificationsPush');
const express = require('express');
const router = express.Router();
// Load input validation;
const validateMealInput = require('../../validation/meal');

// @route GET api/meals/public
// @desc get public meals for unauthenticated users;
// @access Public;
router.get('/public', async (req, response) => {
  console.log('get public meals for unauthenticated users');
  const SQLquery = `
  SELECT 
    m.*, 
    u.name AS host_name, 
    u.id AS host_id,
    0 AS attend_status,
    (SELECT COUNT(user_id) FROM attends WHERE meal_id=m.id AND status>0) AS Atendee_count
  FROM meals AS m 
  JOIN users AS u ON m.host_id = u.id
  WHERE m.date > now()`;
  console.log(`get public meals, SQLquery: [${SQLquery}]`);
  const client = await pool.connect();
  client.query(SQLquery, [])
    .then(resp => {
      response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json(err);
    })
    .finally(() => {
      client.release();
    });
});

// @route GET api/meals/:id
// @desc get a meal list for a specific user;
// @access Public;
router.get('/:id', async (req, response) => {
  const userId = req.params.id;
  console.log(`get meals for user ${userId}`);
  
  if (isNaN(userId)) {
    console.error('Invalid user ID provided');
    return response.status(400).json('Invalid user ID');
  }
  const SQLquery = `
  SELECT
  (SELECT images.path
    FROM meal_images AS mi, images
    WHERE mi.meal_id=m.id and images.id=image_id and images.status>=0 limit 1),
  (((SELECT status AS attend_status FROM attends
     WHERE  meal_id=m.id AND attends.user_id=$1) UNION
    (SELECT 0 AS attend_status) ORDER BY attend_status DESC) LIMIT 1),
    (SELECT count (user_id) AS Atendee_count FROM attends
    WHERE meal_id=m.id AND status>0),
  m.*, u.name AS host_name, u.id AS host_id FROM meals AS m JOIN users AS u ON m.host_id = u.id
  WHERE m.date>now()`;
  console.log(`get meals for user, SQLquery: [${SQLquery}]`);
  const client = await pool.connect();
  client.query(SQLquery, [userId])
    .then(resp => {
      response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json(err);
    })
    .finally(() => {
      client.release();
    });
});
