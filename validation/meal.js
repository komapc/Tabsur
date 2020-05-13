const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateMealInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = `Name field is required, "${data.name}" is given`;
  }

  data.address = !isEmpty(data.address) ? data.address : "";

  if (Validator.isEmpty(data.address)) {
    errors.address = "Address field is required";
  }

  if (isEmpty(data.guestCount))
  { 
    errors.guestCount = "Number of invited guests is empty";
  }
  else if (isNaN(data.guestCount) || data.guestCount === "") {
    errors.guestCount = `Number of invited guests is not a number, "${data.name}" is given`;
  }
  else 
  {
    data.guestCount = (data.guestCount > 0) ? data.guestCount : "0";
    if (data.guestCount < 0) {
      errors.guestCount = "Number of invited guests should be a positive number";
    }
  }
  console.log("validate: " + JSON.stringify(errors));
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
