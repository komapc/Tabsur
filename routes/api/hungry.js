const pool = require("../db.js");
const authenticateJWT = require('../authenticateJWT.js');
const express = require("express");
const router = express.Router();

// Load input validation
const validateMealInput = require("../../validation/hungry");

// @route GET api/hungry/
// @desc get a hungry list
// @access Public
router.get("/:id", async (req, response) => {
  console.log(`get hungry for user ${req.params.id}`);

  const SQLquery = `
  SELECT id, user_id, name, type, location, address,
    date, until, visibility
    FROM hungry 
  WHERE m.date>now() AND user_id=$1`;
  console.log(`SQLquery: [${SQLquery}]`);
  const client = await pool.connect();
  client.query(SQLquery, [req.params.id])
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.release();
    })
})

// @route GET api/meals/my
// @desc get a list of meals created by me
// @access Public
router.get("/user/:id", async (req, response) => {
  console.log("get my hungry by user id: " + JSON.stringify(req.params));
  if (req.params.id == "undefined") {
    console.log("error, empty id");
    response.status(400).json("Error in geting my meals: empty");
    return;
  }
  const SQLquery = `
    SELECT id, name, type, location, address,
      date, until, visibility
    FROM hungry 
    WHERE m.date>now() AND user_id=$1`;
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
    });
});

// @route POST api/hungry/
router.post("/", authenticateJWT, async (req, response) => {
  // Form validation
  const hungry = req.body;
  const { errors, isValid } = validateMealInput(hungry);

  // Check validation
  if (!isValid) {
    return response.status(400).json(errors);
  }

  console.log(`add hungry - start, ${JSON.stringify(req.body)}`);
  const client = await pool.connect();

  const query=`INSERT INTO hungry (user_id, name, type, location, address,
    date, until, visibility)
    VALUES($1, $2, $3, $4, $5, (to_timestamp($6/ 1000.0)), (to_timestamp($7/ 1000.0)), $8) 
    RETURNING id`;
  console.log(`connected running [${query}]`);
  
  client.query(query,
    [hungry.user, hungry.name, hungry.type, `(${hungry.location.lng}, ${hungry.location.lat})`,
    hungry.address, hungry.date, hungry.until, hungry.visibility])
    .then((res) => {
      console.log(`query done: ${JSON.stringify(res.rows)}`);
      const message =
      {
        title: 'Somebody is hungry here', 
        body:  `A hungry user in your area!`, 
        icon: 'resources/Message-Bubble-icon.png', 
        click_action: `/User/${hungry.user}`,
        receiver: followie,
        meal_id:  -1,
        sender: -1,
        type: 7
      }
      addNotification(message);
    }
    )
    .catch((e) => {
      console.error("exception catched: " + e);
      response.status(500).json(e);
    })
    .finally(()=>
    {
      client.release();
    });
});

// @route DELETE api/hungry/id
// @desc delete a hungry
// @access Public (?)
router.delete("/:hungry_id", authenticateJWT, async (req, response) => {
  const hungry = req.body;
  const hungry_id = req.params.hungry_id;
  if (isNaN(hungry_id)) {
    return response.status(400).json(`hungry_id: wrong hungry id format: ${mealId}.`);
  }

  console.log(`delete - start, ${hungry_id}`);
  const client = await pool.connect();

  console.log("connected");
  client.query('DELETE FROM hungry WHERE id=$1',
    [mealId])
    .then(() => {
      console.log("deleted.");
      return response.status(201).json(req.body);
    }
    )
    .catch((e) => {
      console.error("exception catched: " + e);
      response.status(500).json(e);
    })
    .finally(() => {
      client.release();
    })
});

module.exports = router;
