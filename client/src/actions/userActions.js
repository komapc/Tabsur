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

// Update user profile information
export const updateUserProfile = (userId, profileData) => {
  console.log(`Updating profile for user ${userId}:`, profileData);
  if (isNaN(userId)) {
    return Promise.reject(new Error("Invalid user ID"));
  }
  return axios.put(`${config.SERVER_HOST}/api/users/${userId}/profile`, profileData);
};

// Update user preferences
export const updateUserPreferences = (userId, preferences) => {
  console.log(`Updating preferences for user ${userId}:`, preferences);
  if (isNaN(userId)) {
    return Promise.reject(new Error("Invalid user ID"));
  }
  return axios.put(`${config.SERVER_HOST}/api/users/${userId}/preferences`, preferences);
};

// Get user preferences
export const getUserPreferences = (userId) => {
  console.log(`Getting preferences for user ${userId}`);
  if (isNaN(userId)) {
    return Promise.reject(new Error("Invalid user ID"));
  }
  return axios.get(`${config.SERVER_HOST}/api/users/${userId}/preferences`);
};

// Change user password
export const changePassword = (userId, passwordData) => {
  console.log(`Changing password for user ${userId}`);
  if (isNaN(userId)) {
    return Promise.reject(new Error("Invalid user ID"));
  }
  return axios.put(`${config.SERVER_HOST}/api/users/${userId}/password`, passwordData);
};

// Deactivate user account
export const deactivateAccount = (userId) => {
  console.log(`Deactivating account for user ${userId}`);
  if (isNaN(userId)) {
    return Promise.reject(new Error("Invalid user ID"));
  }
  return axios.put(`${config.SERVER_HOST}/api/users/${userId}/deactivate`);
};

// Delete user account
export const deleteAccount = (userId) => {
  console.log(`Deleting account for user ${userId}`);
  if (isNaN(userId)) {
    return Promise.reject(new Error("Invalid user ID"));
  }
  return axios.delete(`${config.SERVER_HOST}/api/users/${userId}`);
};
