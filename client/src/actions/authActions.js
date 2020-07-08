import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  GET_CURRENT_USER,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";
import config from "../config";

// Register User
export const registerUser = (userData, history) => dispatch => {
  console.log(`registerUser, ${config.SERVER_HOST}`);
  axios
    .post(`${config.SERVER_HOST}/api/users/register`, userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  console.log(`userData, ${config.SERVER_HOST}`);
  axios
    .post(`${config.SERVER_HOST}/api/users/login`, userData)
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const loginUserFB = userData => dispatch => {
  console.log(`Log-in with facebook, ${JSON.stringify(userData)}`);
  axios
    .post(`${config.SERVER_HOST}/api/users/loginFB`, userData)
    .then(res => {
      console.log(`loginFB ${JSON.stringify(userData)} done`);
      // Set token to localStorage
      const { token } = res.data.id;
      console.log(`res.data is ${JSON.stringify(res.data)}`);
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
    {
      console.log(`loginFB failed: ${JSON.stringify(err)}`);
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
      }
    );
}
// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Get user info
export const getUser = (id) => {
  return axios.get(`${config.SERVER_HOST}/api/users/${id}`)
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};


// db version for "about" window
export const system = userData => {
  console.log(`system, ${config.SERVER_HOST}`);
  return axios
    .get(`${config.SERVER_HOST}/api/users/system`, userData);
};
