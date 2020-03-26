import { GET_ERRORS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  console.log("error reducer: " + JSON.stringify(action)); 
  switch (action.type) {
    case GET_ERRORS:
      console.log("error reducer: GET_ERRORS, " + action.payload);
      return action.payload;
    default:
      return state;
  }
}
