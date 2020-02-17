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
router.get("/get", (req, res) => 
{
  // Find meals
  myCursor = Meal.find(function(err, meals) 
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

// @route GET api/meals/get_my
// @desc get a list of meals created by me
// @access Public
router.get("/get_my/:id", (req, res) => 
{
    // Find meals
    myCursor = Meal.find({host:req.params.id}, function(err, meals) 
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



// @route GET api/meals/get
// @desc get a meal by id
// @access Public
router.get('/get/:id', function(req, res, next) {
  Meal.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


// @route POST api/meals/addMeal
// @desc Login user and return JWT token
// @access Public
router.post("/addMeal", (req, res) => {
    // Form validation

    const { errors, isValid } = validateMealInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const mealName = req.body.mealName;

    Meal.findOne({ mealName:mealName}).then(meal => {
    // Check if user exists
    if (meal) {
        return res.status(404).json({ mealFound: "Meal with name " + mealName + " already found" });
    }
    if(true)
    {
        const payload = req.body;
        Meal.create(payload);
        return res.status(201).json(payload);
    } 
    else 
    {
        return res
            .status(400)
            .json({ status: "An error" });
        }
    });
});


// @route DELETE api/meals/get
// @desc delete a meal
// @access Public (?)

router.get("/delete/:id", (req, res) => 
{ 
//todo
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
