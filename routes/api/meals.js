const pgConfig=require("./../dbConfig.js");
const {Client}=require("pg");
const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

// Load input validation
const validateMealInput = require("../../validation/meal");

// Load Meal model
const Meal = require("../../models/Meal")

// @route GET api/meals/get
// @desc get a meal list
// @access Public
router.get("/get", async  (req, response) => 
{
  const client = new Client(pgConfig.pgConfig);

  const meal = req.body;
  console.log(meal);

  await client.connect();

  client.query('SELECT m.*, u.name as host_name FROM meals as m join users as u on m.host_id = u.id')
    .then(resp=>{
      response.json(resp.rows);
    })
    .catch(err => { console.log(err); return response.status(500).json(newReq); });})
 
// @route GET api/meals/get_my
// @desc get a list of meals created by me
// @access Public
router.get("/get_my/:id", async (req, response) => 
{
  const client = new Client(pgConfig.pgConfig);

  const meal = req.body;
  console.log(meal);

  await client.connect();

  await client.query(`SELECT * from   meals where host_id=${req.params.id}`, (err, resp) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(resp.rows[0]);
        response.json(resp.rows);
      }
    })
});

// // @route GET api/meals/get
// // @desc get a meal by id
// // @access Public
// router.get('/get/:id', function(req, res, next) {
  
//     Meal.aggregate([
//     { $lookup:
//        {
//          from: 'users',
//          localField: 'host',
//          foreignField: '_id',
//          as: 'host_name'
//        }
//      }
//     ]).exec(function(err, res) {
//    console.log(res);
//     });

//   Meal.findById(req.params.id, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });


// });

// @route POST api/meals/addMeal
router.post("/addMeal", async (req, response) => {
    // Form validation
    const client = new Client(pgConfig.pgConfig);
    const { errors, isValid } = validateMealInput(req.body);

    // Check validation
    if (!isValid) {
        return response.status(400).json(errors);
    }
    try{
      
    console.log("addMeal - start,  " +pgConfig.pgConfig.user );
    const meal = req.body;
    await client.connect();
    
    console.log("connected");
    await client.query('INSERT INTO meals (name, type, location, address, guest_count, host_id)' +
        'VALUES($1, $2, $3, $4, $5, $6)',
        [meal.name, meal.type, `(${meal.location.lng}, ${meal.location.lat})`, meal.address, meal.guestCount, meal.host_id]);
    // TODO: fix user id
    
    }
    catch(e)
    {
      console.log("exception catched: " + e);
    }
    console.log("query done");
    await client.end();
    return response.status(201).json(req.body);
});


// @route DELETE api/meals/get
// @desc delete a meal
// @access Public (?)

router.get("/delete/:id",async(req, res) => 
{ 
//todo

const client = new Client(pgConfig);
  await client.connect();

  await client.query('delete from meals where id=$1',
      [req.id]);
  // TODO: fix user id

  client.end();

  // Find meal by name
  myCursor = Meal.delete(function(err, meals) 
  {
    if (err) 
    {
        console.log(err);
    } else 
    {
        res.json(meals);
    }
  })
});

module.exports = router;
