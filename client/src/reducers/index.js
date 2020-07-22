import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import messageCountReducer from "../reducers/messagesReducer";
import notificationsCountReducer from "../reducers/notificationsCountReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  messagesCount: messageCountReducer,
  notificationsCount: notificationsCountReducer
});
