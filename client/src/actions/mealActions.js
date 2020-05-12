//this file is used only for AddMeal, but should be used everywhere.
import axios from "axios";
import { GET_ERRORS, USER_LOADING } from "./types";
import config from "../config";

// add a meal
export const addMeal = (userData, history) => dispatch => {
  axios
    .post(`${config.SERVER_HOST}/api/meals/add`, userData)
    .then(res => 
      {
        console.log(`add meal: [${res}]`);
        history.push("/MyMeals");
      })
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

//get my meals
export const getMyMeals = (mealData, id) => dispatch => {
  axios.get(`${config.SERVER_HOST}/api/meals/my/` + this.props.auth.user.id)
  .then(res => {
    console.log(res.data);
    this.setState({ meals: res.data });
  }).catch(err =>{
    console.log(err);
  }); 
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
