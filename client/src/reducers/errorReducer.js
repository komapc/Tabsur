import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {};

const errorReducer = (state = initialState, action) => {
  // Safety check: ensure action exists and has a type
  if (!action || !action.type) {
    return state;
  }

  switch (action.type) {
    case GET_ERRORS:
      // Ensure we always return a valid state object
      // If payload is undefined/null, return a default error object
      const payload = action.payload;
      if (payload && typeof payload === 'object' && Object.keys(payload).length > 0) {
        return payload;
      }
      return { general: "An error occurred" };
    case CLEAR_ERRORS:
      return {};
    default:
      // Always return the current state for unknown actions
      return state;
  }
};

export default errorReducer;
