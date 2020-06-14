//this file is used only for AddMeal, but should be used everywhere.
import axios from "axios";
import { GET_ERRORS, USER_LOADING } from "./types";
import config from "../config";

// add a meal and image
export const addMeal = (userData, history) => dispatch => {
  console.log("Adding meal");
  console.log("Adding meal");
  axios
    .post(`${config.SERVER_HOST}/api/meals/`, userData)
    .then(res => {
      const meal_id = res.data[0].id;
      console.log(`meal added: ${JSON.stringify(meal_id)}`);
      userData.meal_id = res.meal_id;
      userData.meal_id = meal_id;
      axios.post(`${config.SERVER_HOST}/api/meals/image/`, userData)
        .then(res2 => {
          console.log(`add image: [${JSON.stringify(res2)}]`);
          history.push("/MyMeals");
        })
    })
    .catch(err => {
      console.log(`Error in addMeal: ${JSON.stringify(err)}`);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

//get
export const getMeals = (mealData, id) => dispatch => {
  axios
    .get(`${config.SERVER_HOST}/api/meals/` + id, mealData)
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
    }).catch(err => {
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
        .then(res => dispatch(res))
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
