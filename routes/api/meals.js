const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

// Load input validation
//const validateRegisterInput = require("../../validation/register");
const validateMealInput = require("../../validation/meal");

// Load Meal model
const Meal = require("../../models/Meal")

// @route POST api/users/addMeal
// @desc add a meal
// @access Public
router.post("/get", (req, res) => 
{ 
  // Find meal by name
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


// @route POST api/users/login
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
        const payload = {
        // id: meal.id,
            mealName: mealName,
            dateCreated: Date.now()
        };
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

module.exports = router;
