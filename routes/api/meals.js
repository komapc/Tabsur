const pool = require("../db.js");
const authenticateJWT = require('../authenticateJWT.js');
var addNotification = require('./notifications');
const express = require("express");
const router = express.Router();

// Load input validation
const validateMealInput = require("../../validation/meal");

// @route GET api/meals/
// @desc get a meal list
// @access Public
router.get("/:id", async (req, response) => {
  var userId = req.params.id;
  console.log(`get meals for user ${userId}`);
  if (isNaN(userId))
  {
    //return response.status(400).json("Error in geting  meals: wrong ID");
    //when user is not logged-in
    userId = -1;
  }
  const SQLquery = `
  SELECT 
    (SELECT images.path
      FROM meal_images AS mi, images 
      WHERE mi.meal_id=m.id and images.id=image_id and images.status>=0 limit 1), 
    (((SELECT status AS attend_status FROM attends 
       WHERE  meal_id=m.id AND attends.user_id=$1) UNION 
      (SELECT 0 AS attend_status) ORDER BY attend_status DESC) LIMIT 1),
      (SELECT count (user_id) AS "Atendee_count" FROM attends 
      WHERE meal_id=m.id), 
    m.*, u.name AS host_name, u.id AS host_id FROM meals  AS m JOIN users AS u ON m.host_id = u.id
  WHERE m.date>now()`;
  console.log(`get, SQLquery: [${SQLquery}]`);
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
})


// @route GET api/meals/info/id
// @desc get info about specific meal
// @access Public
router.get("/info/:id", async (req, response) => {
  var id = req.params.id;
  console.log(`get info for meal ${id}`);
  if (isNaN(id))
  {
    console.error(`Bad meal id: ${id}`);
    return response.status(500).json("Bad meal id");
  }
  const SQLquery = `
  SELECT meals.*, images.path, users.name AS host_name,
    (SELECT count (user_id) AS "Atendee_count" FROM attends 
        WHERE meal_id=$1)
  FROM meals 
  JOIN meal_images ON meal_images.meal_id = meals.id
  JOIN images ON meal_images.image_id = images.id
  JOIN users ON meals.host_id=users.id
  WHERE   meals.id=$1`;
  console.log(`get, SQLquery: [${SQLquery}]`);
  const client = await pool.connect();
  return client.query(SQLquery, [id])
    .then(resp => {
      console.log(`INFO about ${id}: ${JSON.stringify(resp.rows)}.`);
      return response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.release();
    });
})

// @route GET api/meals/my
// @desc get a list of meals created by me
// @access Public
router.get("/my/:id", authenticateJWT, async (req, response) => {
  console.log("get my meals by user id: " + JSON.stringify(req.params));
  const userId = req.params.id;
  if (isNaN(userId)){
    console.error("error, empty id");
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
  const client = await pool.connect();
  client.query(SQLquery, [userId])
    .then(resp => {
      return response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(()=>
    {
        client.release();
    });
});

// @route GET api/meals/attends
// @desc get a list of meals where the user attends
// @access Public
router.get("/attends/:id", authenticateJWT, async (req, response) => {
  console.log("get meals where user attends: " + JSON.stringify(req.params));
  if (isNaN(req.params.id)) {
    console.log("error, empty id");
    response.status(400).json("Error in geting attended meals: empty");
    return;
  }
  const SQLquery = `SELECT * FROM (
    
    SELECT
    (SELECT images.path
      FROM meal_images as mi, images 
      WHERE mi.meal_id=m.id and images.id=image_id and images.status>=0 limit 1),
        (SELECT count (user_id) AS "Atendee_count" from attends where meal_id=m.id),
        (SELECT status AS attend_status FROM attends
           WHERE  meal_id=m.id AND attends.user_id=$1),
        m.*, u.name AS host_name, u.id AS host_id FROM meals  AS m JOIN users AS u ON m.host_id = u.id
      ) AS sel WHERE attend_status > 0`;
  const client = await pool.connect();
  client.query(SQLquery, [req.params.id])
    .then(resp => {
      return response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.release();
    })
});

// @route GET api/meals/guests
// @desc get a list of users attending a meal
// @access Public
router.get("/guests/:meal_id", 
//authenticateJWT,  //Paker's request: show guests even when not logged-in
async (req, response) => {
  console.log("Get users by meal_id: " + JSON.stringify(req.params));
  const meal_id = req.params.meal_id;
  if (isNaN(meal_id)) {
    console.error("error, empty id");
    response.status(400).json("Error in getting my meal: empty id");
    return;
  }

  const SQLquery = `SELECT a.user_id, u.name FROM attends as a  
   INNER JOIN users as u ON a.user_id=u.id WHERE meal_id=$1`;
  console.log(SQLquery);
  const client = await pool.connect();
  client.query(SQLquery, [meal_id])
    .then(resp => {
      console.error(`Query result: ${JSON.stringify(resp.rows)}`);
      return response.json(resp.rows);
    })
    .catch(err => {
      console.error(`Failed query: ${err}`);
      return response.status(500).json(err);
    }
    )
    .finally(()=>{
      client.release();
    })
});

// @route POST api/meals/image
router.post("/image", authenticateJWT, async (req, response) => {
  console.log(`query: ${JSON.stringify(req.body)}`);
  if (!req.body.meal_id) {
    return response.status(500).json(`Empty input.`);
  }
  const meal_id = req.body.meal_id;
  let image_path = req.body.image_path;
  let image_id = req.body.image_id;
  const client = await pool.connect();
 
  if (isNaN(image_id) || isNaN(meal_id)) {
    return response.status(500).json("Bad params: image_id");
  }
  const query = `INSERT INTO meal_images (meal_id, image_id) VALUES ($1, $2) RETURNING id`
  client.query(query, [meal_id, image_id])
    .then((res) => {
      console.log(`insert query done: ${JSON.stringify(res.rows)}`);
      image_path = res.rows[0].path;
      return response.status(200).json(res.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json("failed to select random image: " + err);
    })
    .finally(() => {
      client.release();
    });
});
// @route POST api/meals/ - create a meal
router.post("/", authenticateJWT, async (req, response) => {
  // Form validation
  const meal = req.body;
  const { errors, isValid } = validateMealInput(meal);

  // Check validation
  if (!isValid) {
    return response.status(400).json(errors);
  }

  console.log(`add meal - start, ${JSON.stringify(req.body)}`);
  const client = await pool.connect();
  //todo: insert image
  const query = `INSERT INTO meals (
    name, type, location, address, guest_count, host_id, date, visibility, description)
  VALUES($1, $2, $3, $4, $5, $6, (to_timestamp($7/ 1000.0)), $8, $9) RETURNING id`;
  console.log(`connected running [${query}]`);

  return client.query(query,
    [meal.name, meal.type, `(${meal.location.lng}, ${meal.location.lat})`,
    meal.address, meal.guest_count, meal.host_id, meal.date, meal.visibility, meal.description])
    .then(res => {
      
      console.log(`query done.`);
      const message =
      {
        title: 'New meal', 
        body:  'A new meal in your areas', 
        icon: 'resources/Message-Bubble-icon.png', 
        click_action: '/Meals/',
        sender: -1,
        type: 5
      }
      return response.json(res.rows[0]);
     //TODO: add notification to all followers + people in the area
    }
    )
    .catch(e => {
      console.error(`Exception catched in creating meal: ${JSON.stringify(e)}`);
      response.status(500).json(e);
    })
    .finally(() =>
    {
      client.release();
    })
});


router.put("/", authenticateJWT, async (req, response) => {
 // console.error(`Editing meal is not implemented yet ${JSON.stringify(req.body)}`);
 const meal = req.body;
 const { errors, isValid } = validateMealInput(meal);

 // Check validation
 if (!isValid) {
   return response.status(400).json(errors);
 }

 const client = await pool.connect();
 //todo: insert image
 const query = `UPDATE meals 
 SET name=$1,  guest_count=$2
 WHERE id=$3`;
 console.log(`connected running [${query}]`);

 return client.query(query,
   [meal.name,  meal.guest_count,  meal.id])
   .then(res => {
     
     console.log(`query done.`);
    
     return response.json(res.rows[0]);
    //TODO: add notification to all followers + people in the area
   }
   )
   .catch(e => {
     console.error(`Exception catched in creating meal: ${JSON.stringify(e)}`);
     response.status(500).json(e);
   })
   .finally(() =>
   {
     client.release();
   })


  response.status(500).json(req.body);
});

// @route DELETE api/meals/id
// @desc delete a meal
// @access Public (?)
router.delete("/:meal_id", authenticateJWT, async (req, response) => {
  const meal = req.body;
  const mealId = req.params.meal_id;
  if (isNaN(mealId)) {
    return response.status(400).json(`mealId: wrong meal id format: ${mealId}.`);
  }

  console.log(`delete ${mealId}`);
  const client = await pool.connect();

  client.query('DELETE FROM meals WHERE id=$1',
    [mealId])
    .then(() => {
      console.log("deleted.");
      return response.status(201).json(req.body);
    }
    )
    .catch(e => {
      console.error("exception catched: " + e);
      response.status(500).json(e);
    })
    .finally(() => {
      client.release();
    });
});

module.exports = router;
