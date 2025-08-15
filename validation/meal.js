const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateMealInput(data) {
  const errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : '';

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = `Name field is required, "${data.name}" is given`;
  }

  // Address is optional for now - can be empty string
  data.address = !isEmpty(data.address) ? data.address : '';
  
  // Add missing required fields with defaults
  data.type = !isEmpty(data.type) ? data.type : 'dinner';
  data.visibility = !isEmpty(data.visibility) ? data.visibility : 'public';

  // Guest count validation - handle 0 as valid
  if (data.guest_count === undefined || data.guest_count === null || data.guest_count === '') {
    errors.guest_count = 'Number of invited guests is empty.';
  } else if (isNaN(data.guest_count)) {
    errors.guest_count = `Number of invited guests is not a number, "${data.guest_count}" is given`;
  } else {
    data.guest_count = parseInt(data.guest_count);
    if (data.guest_count < 0) {
      errors.guest_count = 'Number of invited guests should be a positive number';
    }
  }
  
  console.log(`Validate: ${JSON.stringify(errors)}`);
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
