import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import messageReducer from "../reducers/messagesReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  messages: messageReducer
});
