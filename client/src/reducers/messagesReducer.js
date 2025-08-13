import { SET_MESSAGES_COUNT } from "../actions/types";

const initialState = 0;

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGES_COUNT:
      return {
        ...state,
        count: action.payload
      };
    default:
      return state;
  }
};

export default messagesReducer;
