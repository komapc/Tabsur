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
  dateCreated: {
    type: Date,
    default: Date.now
  },
  //meal time
  time: {
    type: Date,
    default: Date.now
  },
  place: {
    type: Date,
    default: Date.now
  }  
});

module.exports = Meal = mongoose.model("meals", MealSchema);
