import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

// add a meal
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/meals/register", userData)
    .then(res => history.push("/login"))
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
    .post("/api/meals/login", mealData)
    .then(res => {
     
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
