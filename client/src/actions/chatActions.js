//this file is used only for AddMeal, but should be used everywhere.
import axios from "axios";
import { GET_ERRORS, USER_LOADING } from "./types";
import config from "../config";


//get a list of meals where the user attends
export const getChatUsers = userId => {
  return axios
    .get(`${config.SERVER_HOST}/api/chat/${userId}`);
};
