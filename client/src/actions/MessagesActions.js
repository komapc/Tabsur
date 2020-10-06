import {
  SET_MESSAGES_COUNT
} from "./types";

export default function setMessagesCount(newCount) {
  console.log(`setMessagesCount to ${newCount}.`);
  return { 
    type: SET_MESSAGES_COUNT, 
    messagesCount: newCount
  } 
}

