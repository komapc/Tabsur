//this file is used only for AddMeal, but should be used everywhere.
import axios from "axios";
import { GET_ERRORS, USER_LOADING } from "./types";
import config from "../config";

// add a meal
export const addMeal = (userData) => dispatch => {
  axios
    .post(`${config.SERVER_HOST}/api/meals/addMeal`, userData)
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//get
export const getMeals = (mealData, id) => dispatch => {
  axios
    .get(`${config.SERVER_HOST}/api/meals/get/` + id, mealData)
    .then(res => {
     dispatch(res); 
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// join/unjoin the meal
export const joinMeal = (attendData, id) => dispatch => {
  console.log("joinMeal: " + JSON.stringify(attendData));
  axios
    .post(`${config.SERVER_HOST}/api/attends/${id}`, attendData)
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
      .then(res=>dispatch(res))
    );
};


//get
export const getAttendByMeal = attendData => dispatch => {
  axios
    .get(`${config.SERVER_HOST}/api/attends/meal/` + attendData.meal_id, attendData)
    .then(res => {
     dispatch(res); 
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
