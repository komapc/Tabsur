import {
  SET_MESSAGES_COUNT
} from "./types";

function setMessagesCount(state, value) {
  switch (action.type) {
    case SET_MESSAGES_COUNT:
      return Object.assign({}, state, {
        messagesCount: value
      })
    default:
      return state
  }
}

export default setMessagesCount;
