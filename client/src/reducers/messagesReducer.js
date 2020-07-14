import { SET_MESSAGES_COUNT } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  console.log("messages reducer: " + JSON.stringify(action)); 
  switch (action.type) {
    case SET_MESSAGES_COUNT:
      console.log("messages reducer: SET_MESSAGES_COUNT, " + JSON.stringify(action.payload));
      return action.payload;
    default:
      return state;
  }
}
