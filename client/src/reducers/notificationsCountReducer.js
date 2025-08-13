import { SET_NOTIFICATIONS_COUNT } from "../actions/types";

const initialState =  0;

const notificationsCountReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATIONS_COUNT:
      return action.payload;
    default:
      return state;
  }
};

export default notificationsCountReducer;
