const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateMealInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.mealName = !isEmpty(data.mealName) ? data.mealName : "";


  // Name checks
  if (Validator.isEmpty(data.mealName)) {
    errors.mealName = "Name field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
