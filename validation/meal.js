const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateMealInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";


  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  data.address = !isEmpty(data.address) ? data.address : "";

  if (Validator.isEmpty(data.address)) {
    errors.address = "Address field is required";


    data.guestCount = (guestCount > 0) ? data.guestCount : "";
    if (guestCount < 0) {
      errors.guestCount = "Number if invited guests should be a positive number";
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
