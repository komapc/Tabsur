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
export const getMeals = mealData => dispatch => {
  axios
    .get(`${config.SERVER_HOST}/api/meals/get/` + this.props.auth.user.id, mealData)
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

// add a meal
export const joinMeal = (attendData, history) => dispatch => {
  console.log(JSON.stringify(attendData));
  axios
    .post(`${config.SERVER_HOST}/api/attends/`, attendData)
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
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
