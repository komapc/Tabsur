const addNotification = require('./notificationsPush');
const pool = require("../db.js");
const authenticateJWT = require('../authenticateJWT.js');
const express = require("express");
const router = express.Router();

// @route GET api/follow
// @desc get list of followers
// @access Public
router.get("/:id", async (req, response) => {
  console.log(`get followers for user ${req.params.id}`);
  const meal = req.body;

  const SQLquery =
    `SELECT DISTINCT follower as user_id, status, name  
    FROM follow 
    INNER JOIN
    users ON follow.follower = users.id
    WHERE follow.followie = $1`;
  console.log(`SQLquery: [${SQLquery}]`);
  const client = await pool.connect();

  client.query(SQLquery, [req.params.id])
    .then(resp => {
      response.json(resp.rows);
    })
    .catch(err => {
      console.error("Failed to get followers: " + err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.release();
    });
})

// @route GET api/followies
// @desc get a list of users I fllow
// @access Public
router.get("/followies/:id", async (req, response) => {
  console.log("get followies by user id: " + JSON.stringify(req.params));
  if (req.params.id == "undefined") {
    client.end();
    console.log("error, empty id");
    return response.status(400).json("Error in get followies: empty");
  }
  const SQLquery = `SELECT DISTINCT followie as user_id, status, name  
  FROM follow 
  INNER JOIN
  users ON follow.followie = users.id
  WHERE follow.follower = $1`;
  const client = await pool.connect();
  client.query(SQLquery, [req.params.id])
    .then(resp => {
      response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(()=> client.release())
});

// @route POST follow/unfollow
router.post("/:id", authenticateJWT, async (req, response) => {
  const follower = req.params.id;
  const followie = req.body.followie;
  const status = req.body.status;

  if (isNaN(follower) || isNaN(followie) || isNaN(status)) {
    return response.status(500).json("Bad input, some input parameter are not null.");
  }
  const SQLquery = `
    INSERT INTO follow (follower, followie, status)
    VALUES ($1, $2, $3) 
    ON CONFLICT (follower, followie) 
    DO UPDATE SET 
    status = $3 WHERE follow.follower=$2 AND follow.followie = $1`;
  console.log(JSON.stringify(SQLquery));
  const client = await pool.connect();
  client.query(SQLquery, [follower, followie, status])
    .then(resp => {
      console.log(`Query response: ${JSON.stringify(resp)}`);
      const message =
      {
        title: 'Follower',
        body: `${followie}, you have one new follower (${follower})!`,
        icon: 'resources/Message-Bubble-icon.png',
        click_action: '/Meals/',
        receiver: followie,
        meal_id: -1,
        sender: -1,
        type: 6
      }
      const answer = addNotification(message);

      return answer
        .then(answer => {
          console.log(`notification result: ${JSON.stringify(answer)}`);
          response.json(answer);
        })
        .catch(err=>
        {
          console.error(`notification failed: ${JSON.stringify(err)}`);
          response.status(500).json(err);
        });
    })
    .catch(err => {
      console.error(`Failed to add a follower,  ${err}`);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.release();
    })
});

module.exports = router;