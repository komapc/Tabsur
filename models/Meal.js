const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MealSchema = new Schema({
  mealName: { //meal name
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
   
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = Meal = mongoose.model("meals", MealSchema);
