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

// @route GET api/meals/
// @desc get a meal list
// @access Public
router.get("/:id", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get meals for user ${req.params.id}`);

  const SQLquery = `
  SELECT 
    (SELECT images.path
      FROM meal_images as mi, images 
      WHERE mi.meal_id=m.id and images.id=image_id and images.status>=0 limit 1), 
    (((SELECT status AS attend_status FROM attends 
       WHERE  meal_id=m.id AND attends.user_id=$1) UNION 
      (SELECT -1 AS attend_status) ORDER BY attend_status DESC) LIMIT 1),
      (SELECT count (user_id) AS "Atendee_count" FROM attends 
      WHERE meal_id=m.id), 
    m.*, u.name AS host_name, u.id AS host_id FROM meals  AS m JOIN users AS u ON m.host_id = u.id
  WHERE m.date>now()`;
  console.log(`get, SQLquery: [${SQLquery}]`);
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

// @route GET api/meals/my
// @desc get a list of meals created by me
// @access Public
router.get("/my/:id", async (req, response) => {
  const client = new Client(currentConfig);
  console.log("get my meals by user id: " + JSON.stringify(req.params));
  if (req.params.id == "undefined") {
    console.log("error, empty id");
    response.status(400).json("Error in geting my meals: empty");
    return;
  }
  const SQLquery = `SELECT 
    (SELECT images.path
      FROM meal_images as mi, images 
      WHERE mi.meal_id=m.id and images.id=image_id and images.status>=0 limit 1),
    (SELECT count (user_id) AS "Atendee_count" FROM attends 
      WHERE meal_id=m.id), 
    0 as attend_status, m.*, u.name  AS host_name FROM meals  AS m JOIN users AS u on m.host_id = u.id 
    WHERE m.date>now() AND host_id=$1`;
  await client.connect();
  client.query(SQLquery, [req.params.id])
    .then(resp => {
      client.end();
      return response.json(resp.rows);
    })
    .catch(err => {
      client.end();
      console.log(err);
      return response.status(500).json(err);
    });
});

// @route GET api/meals/attends
// @desc get a list of meals created the user attends
// @access Public
router.get("/attends/:id", async (req, response) => {
  const client = new Client(currentConfig);
  console.log("get meals where user attends: " + JSON.stringify(req.params));
  if (req.params.id == "undefined") {
    console.log("error, empty id");
    response.status(400).json("Error in geting attended meals: empty");
    return;
  }
  const SQLquery = `SELECT * FROM (
    SELECT
        (SELECT count (user_id) AS "Atendee_count" from attends where meal_id=m.id),
        (SELECT status AS attend_status FROM attends
           WHERE  meal_id=m.id AND attends.user_id=$1),
        m.*, u.name AS host_name, u.id AS host_id FROM meals  AS m JOIN users AS u ON m.host_id = u.id
      ) AS sel WHERE attend_status > 0`;
  await client.connect();
  client.query(SQLquery, [req.params.id])
    .then(resp => {
      client.end();
      return response.json(resp.rows);
    })
    .catch(err => {
      client.end();
      console.log(err);
      return response.status(500).json(err);
    });
});

// @route GET api/meals/guests
// @desc get a list of users attending a meal
// @access Public
router.get("/guests/:meal_id", async (req, response) => {
  const client = new Client(currentConfig);
  console.log("get users by meal_id: " + JSON.stringify(req.params));
  const meal_id = req.params.meal_id;
  if (isNaN(meal_id)) {
    console.log("error, empty id");
    response.status(400).json("Error in getting my meal: empty id");
    return;
  }

  const SQLquery = `SELECT a.user_id, u.name FROM attends as a  
   INNER JOIN users as u ON a.user_id=u.id WHERE meal_id=$1`;
  console.log(SQLquery);
  await client.connect().catch(err => { console.log("get guest for a meal: failed to connect.") });
  client.query(SQLquery, [meal_id])
    .then(resp => {
      client.end();
      return response.json(resp.rows);
    })
    .catch(err => {
      client.end();
      console.log(err);
      return response.status(500).json(err);
    }
    )
});

// @route POST api/meals/image
router.post("/image", async (req, response) => {
  console.log(`query: ${JSON.stringify(req.body)}`);
  if (!req.body.meal_id) {
    return response.status(500).json(`Empty input.`);
  }
  const meal_id = req.body.meal_id;
  let image_path = req.body.image_path;
  let image_id = req.body.image_id;
  const client = new Client(currentConfig);
  await client.connect();
  if (image_path === "#RANDOM") {
    console.log(`selecting random image`);

    const query = `select id, path, status from images  offset (
                select floor(random() * (select count(1) from images))::int) limit 1`
    await client.query(query)
      .then((res) => {
        console.log(`random image query done: ${JSON.stringify(res.rows)}`);
        image_path = res.rows[0].path;
        image_id = res.rows[0].id;
      })
      .catch(err => {
        console.log(err);
        client.end();
        return response.status(500).json("failed to select random image: " + err);
      })
  }
  if (isNaN(image_id) || isNaN(meal_id)) {
    return response.status(500).json("Bad params");
  }
  const query = `insert into meal_images (meal_id, image_id) values ($1, $2) returning id`
  client.query(query, [meal_id, image_id])
    .then((res) => {
      client.end();
      console.log(`insert query done: ${JSON.stringify(res.rows)}`);
      image_path = res.rows[0].path;
      return response.status(200).json(res.rows);
    })
    .catch(err => {
      console.log(err);
      client.end();
      return response.status(500).json("failed to select random image: " + err);
    })
});
// @route POST api/meals/
router.post("/", async (req, response) => {
  // Form validation
  const meal = req.body;
  const { errors, isValid } = validateMealInput(meal);

  // Check validation
  if (!isValid) {
    return response.status(400).json(errors);
  }
  const client = new Client(currentConfig);

  console.log(`add meal - start, ${JSON.stringify(req.body)}`);
  await client.connect();
  //todo: insert image
  const query = `INSERT INTO meals (name, type, location, address, guest_count, host_id, date, visibility)
  VALUES($1, $2, $3, $4, $5, $6, (to_timestamp($7/ 1000.0)), $8) RETURNING id`;
  console.log(`connected running [${query}]`);

  client.query(query,
    [meal.name, meal.type, `(${meal.location.lng}, ${meal.location.lat})`,
    meal.address, meal.guestCount, meal.host_id, meal.date, meal.visibility])
    .then((res) => {

      console.log(`query done.`);
      const notificationQuery = `
      INSERT INTO notifications 
        (meal_id, message_text, user_id, status, note_type) 
        (SELECT 0, 'New meal in your area.', users.id, 3, 6 FROM users )`;
      console.log(`Notifications: [${notificationQuery}]`);
      client.query(notificationQuery)
        .catch(err => {
          console.log(err);
          client.end();
          return response.status(500).json("failed to add notification: " + err);
        })
        .then(answer => {
          client.end();
          return response.status(201).json(res.rows);
        }
        )
    }
    )
    .catch((e) => {
      client.end();
      console.log("exception catched: " + e);
      response.status(500).json(e);
    });
});


// @route DELETE api/meals/id
// @desc delete a meal
// @access Public (?)
router.delete("/:meal_id", async (req, response) => {
  const meal = req.body;
  const mealId = req.params.meal_id;
  if (isNaN(mealId)) {
    return response.status(400).json(`mealId: wrong meal id format: ${mealId}.`);
  }
  const client = new Client(currentConfig);

  console.log(`delete ${mealId}`);
  await client.connect();

  client.query('DELETE FROM meals WHERE id=$1',
    [mealId])
    .then(() => {
      client.end();
      console.log("deleted.");
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
