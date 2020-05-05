const pgConfig = require("./../dbConfig.js");
let currentConfig = pgConfig.pgConfigProduction;

if (process.env.NODE_ENV === "debug") {
  currentConfig = pgConfig.pgConfigLocal;
}
const { Client } = require("pg");
const express = require("express");
const router = express.Router();

// Load input validation
const validateMealInput = require("../../validation/meal");

// @route GET api/meals/get
// @desc get a meal list
// @access Public
router.get("/get/:id", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get meals for user ${req.params.id}`);
  const meal = req.body;

  const SQLquery = `SELECT (SELECT count (user_id) AS "Atendee_count" from attends where meal_id=m.id), 
  (((SELECT status AS attend_status FROM attends WHERE meal_id=m.id AND attends.user_id=$1) UNION 
  (SELECT -1 AS attend_status) ORDER BY attend_status DESC)  LIMIT 1),
	m.*, u.name AS host_name, u.id AS host_id FROM meals  AS m JOIN users AS u on m.host_id = u.id`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  client.query(SQLquery, [req.params.id])
    .then(resp => {
      response.json(resp.rows);
      client.end();
    })
    .catch(err => {
      client.end();
      console.log(err);
      return response.status(500).json(err);
    });
})

// @route GET api/meals/get_my
// @desc get a list of meals created by me
// @access Public
router.get("/get_my/:id", async (req, response) => {
  const client = new Client(currentConfig);
  console.log("get meals by name: " + JSON.stringify(req.params));
  if (req.params.id == "undefined") {
    client.end();
    console.log("error, empty id");
    response.status(400).json("Error in get_my: empty");
    return;
  }
  const meal = req.body;
  const SQLquery = `SELECT (SELECT count (user_id) AS "Atendee_count" from attends where meal_id=m.id), 
  0 as attend_status, m.*, u.name  AS host_name FROM meals  AS m JOIN users AS u on m.host_id = u.id 
  WHERE host_id=$1`;
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

// @route GET api/meals/get_users
// @desc get a list of users attending a meal
// @access Public
router.get("/get_users/:meal_id", async (req, response) => {
  const client = new Client(currentConfig);
  console.log("get users by meal_id: " + JSON.stringify(req.params));
  if (req.params.meal_id == "undefined") {
    console.log("error, empty id");
    response.status(400).json("Error in get_my: empty");
    return;
  }

  const meal_id = req.params.meal_id;
  const SQLquery = `SELECT a.user_id, u.name FROM attends as a  
   INNER JOIN users as u ON a.user_id=u.id WHERE meal_id=$1`;
  console.log(SQLquery);
  await client.connect().catch(err => { console.log("get_users: failed to connect.") });
  client.query(SQLquery, [meal_id])
    .then(resp => {
      response.json(resp.rows);
      client.end();
    })
    .catch(err => {
      console.log(err);
      return response.status(500).json(err);
    }
    )
});

// @route POST api/meals/addMeal
router.post("/addMeal", async (req, response) => {
  // Form validation
  const meal = req.body;
  const { errors, isValid } = validateMealInput(meal);

  // Check validation
  if (!isValid) {
    return response.status(400).json(errors);
  }
  const client = new Client(currentConfig);

  console.log(`addMeal - start, ${JSON.stringify(req.body)}`);
  await client.connect();

  console.log("connected");
  client.query('INSERT INTO meals (name, type, location, address, guest_count, host_id)' +
    'VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
    [meal.name, meal.type, `(${meal.location.lng}, ${meal.location.lat})`,
    meal.address, meal.guestCount, meal.host_id])
    .then((res) => {
      console.log(`query done: ${JSON.stringify(res).rows}`);
      client.end();
      return response.status(201).json(res.rows[0]);
    }
    )
    .catch((e) => {
      client.end();
      console.log("exception catched: " + e);
      response.status(500).json(e);
    });
});


// @route DELETE api/meals/delete:id
// @desc delete a meal
// @access Public (?)
router.delete("/:id", async (req, res) => {
  const meal = req.body;
  const { errors, isValid } = validateMealInput(meal);

  // Check validation
  if (!isValid) {
    return response.status(400).json(errors);
  }
  const client = new Client(currentConfig);

  console.log(`delete - start, ${JSON.stringify(req.body)}`);
  await client.connect();

  console.log("connected");
  client.query('DELETE FROM meals WHERE id=$1',
    [req.params.meal_id])
    .then(() => {
      console.log("deleted.");
      client.end();
      return response.status(201).json(req.body);
    }
    )
    .catch((e) => {
      client.end();
      console.log("exception catched: " + e);
      response.status(500).json(e);
    });
});

module.exports = router;
