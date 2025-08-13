import { SET_PROFILE_NOTIFICATIONS_COUNT } from "../actions/types";

const initialState =  0;

const profileNotificationsCountReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE_NOTIFICATIONS_COUNT:
      return action.payload;
    default:
      return state;
  }
};

export default profileNotificationsCountReducer;
