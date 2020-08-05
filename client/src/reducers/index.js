import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import messageCountReducer from "../reducers/messagesReducer";
import notificationsCountReducer from "../reducers/notificationsCountReducer";
import profileNotificationsCountReducer from "../reducers/profileNotificationsCountReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  messagesCount: messageCountReducer,
  notificationsCount: notificationsCountReducer,
  profileNotificationsCount: profileNotificationsCountReducer
});
