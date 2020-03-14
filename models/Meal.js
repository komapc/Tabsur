const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MealSchema = new Schema({
  name: { //meal name
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    default: "here and now"
  },
  location: {
    type: Map,
  },
  host: {
    type: String,
    default: "-1"
  },
  guestCount: {
    type: Number,
    default:1
  }  
});

module.exports = Meal = mongoose.model("meals", MealSchema);
