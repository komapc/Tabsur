//this file is used only for AddMeal, but should be used everywhere.
import axios from "axios";
import config from "../config";

// get user followers
export const getUserFollowers = userId => {
  if (isNaN(userId)) {
    return new Promise(() => []);
  }
  return axios.get(`${config.SERVER_HOST}/api/follow/${userId}`);
};

// get user followees
export const getUserFollowies = userId => {
  if (isNaN(userId)) {
    return new Promise(() => []);
  }
  return axios.get(`${config.SERVER_HOST}/api/follow/followies/${userId}`);
};


// get user followees
export const getFollowStatus = userId => {
  if (isNaN(userId)) {
    return new Promise(() => []);
  }
  return axios.get(`${config.SERVER_HOST}/api/follow/${userId}`);
};

//set follow/unfollow status
export const setFollow =  (myUserId, body) => {
  console.log(`Setting follower status for ${myUserId}.`);
  if (isNaN(myUserId)) {
    console.log("myUserId is bad. Are you logged-in?");
    return new Promise(() => []);
  }
  return axios.post(`${config.SERVER_HOST}/api/follow/${myUserId}`, body);
};


//get info about a user
export const getUserInfo = (userId) => {
  console.log(`getting user info ${userId}.`)
  if (isNaN(userId)) {
    return new Promise(() => []);
  }
  return axios.get(`${config.SERVER_HOST}/api/users/${userId}`);
};

//get info about a user
export const getUserImages = (userId) => {
  if (isNaN(userId)) {
    return new Promise(() => []);
  }
  return axios.get(`${config.SERVER_HOST}/api/images/gallery/${userId}`);
};
