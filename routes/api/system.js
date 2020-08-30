const express = require('express');
const AWS = require('aws-sdk');
const keys = require("../../config/keys");
const router = express.Router();

const pgConfig = require("./../dbConfig.js");
let currentConfig = pgConfig.pgConfigProduction;

if (process.env.NODE_ENV === "debug") {
  currentConfig = pgConfig.pgConfigLocal;
}
const { Client } = require("pg");

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: keys.AWS_KEY,//process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


// @route GET api/system
// @desc system informaion
// @access Public
router.get("/stats/:id", async (req, response) => {
  if (req.params.id != 12345) {
    return response.status(500).json("access denied.");
  }
  // Find the user
  const client = new Client(currentConfig);
  await client.connect();
  client.query(`select id, name,
	(select count (1) from follow where followie=u.id) as followers,
	(select count (1) from follow where follower=u.id) as followies, 
	(select count (1) from meals where host_id=u.id) as meals_hosted,
	(select count (1) from attends where user_id=u.id) as attends
from users as u;
`)
    .then(res => {
      var payload = res.rows;
      console.log("Sending stats");
      response.json(payload);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json("Failed to get stats");
    })
    .finally(() => {
      client.end();
    })
});


// @route GET api/system/
// @desc get a user list
// @access Public
router.get("/users", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get users`);

  const SQLquery = `
  SELECT * from users`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  client.query(SQLquery)
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
})


// @route GET api/system/
// @desc get a meal list
// @access Public
router.get("/meals", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get meals`);

  const SQLquery = `
  SELECT meals.id, meals.name, meals.created_at, meals.location, 
    meals.address, meals.guest_count, meals.date, 
    users.name as owner_name, users.id as user_id
  FROM meals INNER JOIN users  ON meals.host_id = users.id`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  client.query(SQLquery)
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
})





/////////////////
const  getMealsStat = async ()=>
{
  const client = new Client(currentConfig);
  console.log(`get meals today`);

  const SQLquery = `
  SELECT TRUNC(extract(epoch FROM now()-created_at)/(60*60*24)) days_before, 
  COUNT (0) as meal_count
  FROM meals  
  GROUP BY TRUNC(extract(epoch from now()-created_at)/(60*60*24))
  ORDER BY TRUNC(extract(epoch from now()-created_at)/(60*60*24))
`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  return client.query(SQLquery)
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      return resp.rows;
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
}


// @route GET api/stats/
// @desc get meal/users stats
// @access  
router.get("/stats", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get system stats`);
  const stats = await getMealsStat();
  console.log(`Stats: ${JSON.stringify(stats)}`);
  const resp=
  {
    mealStats: stats
  }

  return response.json(resp);
   
})


/////////////////
const  getMealsToday = async ()=>
{
  const client = new Client(currentConfig);
  console.log(`get meals today`);

  const SQLquery = `
  SELECT extract(days from (now()-created_at)) AS meals_today FROM meals   
    WHERE extract(days from (now()-created_at)) < 2 `;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  return client.query(SQLquery)
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      return resp.rows;
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
}


// @route GET api/health/
// @desc get system health status
// @access  
router.get("/health", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get system health`);
  const meals = await getMealsToday();
  const mealsToday = (meals && meals[0])?meals[0].meals_today:-1;
  console.log(`meals: ${JSON.stringify(mealsToday)}`);
  const resp=
  {
    DB:true,
    server:true,
    mealsCreatedToday: mealsToday
  }

  return response.json(resp);
   
})
module.exports = router;