const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateMealInput(data) {
  const errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.date = !isEmpty(data.date) ? String(data.date) : '';
  data.location = !isEmpty(data.location) ? data.location : '';
  data.host_id = !isEmpty(data.host_id) ? String(data.host_id) : '';

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = `Name field is required, "${data.name}" is given`;
  }

  // Description checks
  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description field is required';
  }

  // Date checks
  if (Validator.isEmpty(data.date)) {
    errors.date = 'Date field is required';
  }

  // Location checks - handle both string and object formats
  if (isEmpty(data.location)) {
    errors.location = 'Location field is required';
  } else if (typeof data.location === 'object' && (!data.location.lng || !data.location.lat)) {
    errors.location = 'Location must have both longitude and latitude';
  }

  // Host ID checks
  if (Validator.isEmpty(data.host_id)) {
    errors.host_id = 'Host ID field is required';
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

// Validation function for meal updates (more flexible)
module.exports.validateMealUpdate = function validateMealUpdate(data) {
  const errors = {};

  // Only validate fields that are present
  if (data.name !== undefined) {
    data.name = !isEmpty(data.name) ? data.name : '';
    if (Validator.isEmpty(data.name)) {
      errors.name = `Name field is required, "${data.name}" is given`;
    }
  }

  if (data.description !== undefined) {
    data.description = !isEmpty(data.description) ? data.description : '';
    if (Validator.isEmpty(data.description)) {
      errors.description = 'Description field is required';
    }
  }

  if (data.date !== undefined) {
    data.date = !isEmpty(data.date) ? String(data.date) : '';
    if (Validator.isEmpty(data.date)) {
      errors.date = 'Date field is required';
    }
  }

  if (data.location !== undefined) {
    if (isEmpty(data.location)) {
      errors.location = 'Location field is required';
    } else if (typeof data.location === 'object' && (!data.location.lng || !data.location.lat)) {
      errors.location = 'Location must have both longitude and latitude';
    }
  }

  if (data.host_id !== undefined) {
    data.host_id = !isEmpty(data.host_id) ? String(data.host_id) : '';
    if (Validator.isEmpty(data.host_id)) {
      errors.host_id = 'Host ID field is required';
    }
  }

  if (data.guest_count !== undefined) {
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
  }
  
  console.log(`Validate Update: ${JSON.stringify(errors)}`);
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
