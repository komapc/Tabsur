const addNotification = require('./notificationsPush');
const pgConfig = require("./../dbConfig.js");
let currentConfig = pgConfig.pgConfigProduction;

if (process.env.NODE_ENV === "debug") {
  currentConfig = pgConfig.pgConfigLocal;
}
const { Client } = require("pg");
const express = require("express");
const router = express.Router();

// @route GET api/follow/get
// @desc get list of followers
// @access Public
router.get("/:id", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get followers for user ${req.params.id}`);
  const meal = req.body;

  const SQLquery = `SELECT follower, status FROM follow WHERE followie = ${req.params.id}`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  client.query(SQLquery)
    .then(resp => {
      response.json(resp.rows);
    })
    .catch(err => {
      console.log("Failed to get followers: " + err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
})

// @route GET api/followies
// @desc get a list of users I fllow
// @access Public
router.get("/followies/:id", async (req, response) => {
  const client = new Client(currentConfig);
  console.log("get followies by user id: " + JSON.stringify(req.params));
  if (req.params.id == "undefined") {
    client.end();
    console.log("error, empty id");
    response.status(400).json("Error in get followies: empty");
    return;
  }
  const SQLquery = `SELECT followie, status FROM follow WHERE followie = $1`;
  await client.connect();
  client.query(SQLquery, [req.params.id])
    .then(resp => {
      response.json(resp.rows);
      client.end();
    })
    .catch(err => {
      console.log(err);
      client.end();
      return response.status(500).json(err);
    });
});

// @route POST follow/unfollow
router.post("/:id", async (req, response) => {
  const client = new Client(currentConfig);
  const follower = req.params.id;
  const followie = req.body.followie;
  const status = req.body.status;

  if (isNaN(follower) || isNaN(followie) || isNaN(status)) {
    return response.status(500).json("Bad input, some input parameter are not null.");
  }
  const SQLquery = `
    INSERT INTO follow (follower, followie, status)
    VALUES (${follower}, ${followie}, ${status}) 
    ON CONFLICT (follower, followie) 
    DO UPDATE SET 
    status = ${status} WHERE follow.follower=${follower} AND follow.followie = ${followie}`;
  console.log(JSON.stringify(SQLquery));
  await client.connect();
  client.query(SQLquery)
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
      client.end();
    })
});

module.exports = router;