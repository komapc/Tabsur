//this file is used only for AddMeal, but should be used everywhere.
import axios from "axios";
import config from "../config";

// get notifications for a user
export const getNotifications = (usderId) => {
  console.log("get notifications.");
  if (isNaN(usderId))
  {
    console.log("bad usderId: ${usderId}");
  }
  return axios.get(`${config.SERVER_HOST}/api/notifications/${usderId}`);
  
};

//markAsRead
export const markAsRead = (noteid, note) => {
  console.log("get notifications.");
  return  axios.put(`${config.SERVER_HOST}/api/notifications/${noteid}`, note);
};
