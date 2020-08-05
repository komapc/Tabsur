import { SET_PROFILE_NOTIFICATIONS_COUNT } from "../actions/types";

const initialState =  0;

export default function(state = initialState, action) {
  console.log(`notifications reducer: ${JSON.stringify(action)}`); 
  switch (action.type) {
    case SET_PROFILE_NOTIFICATIONS_COUNT:
      console.log("messages reducer: SET_PROFILE_NOTIFICATIONS_COUNT, " + JSON.stringify(action.profileNotificationsCount));
      return action.profileNotificationsCount;
    default:
      return state;
  }
}
