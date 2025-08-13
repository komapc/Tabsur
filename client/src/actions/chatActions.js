//this file is used only for AddMeal, but should be used everywhere.
import axios from "axios";
import config from "../config";

export const GET_CHAT_MESSAGES = 'GET_CHAT_MESSAGES';
export const GET_CHAT_MESSAGES_LOADING = 'GET_CHAT_MESSAGES_LOADING';


//get a list of chat partners + last message
export const getChatUsers = userId => {
  if (isNaN(userId))
  {
    return new Promise( ()=>[])
  }
  return axios
    .get(`${config.SERVER_HOST}/api/chat/${userId}`);
};

//get a chat history with a user
export const getChatMessages = (myId, userId) => {
  if (isNaN(userId))
  {
    return new Promise( ()=>[])
  }
  return axios
    .get(`${config.SERVER_HOST}/api/chat/user/${myId}/${userId}/`);
};
