import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import errorReducer from "./MessagesReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  messages: messageReducer
});
