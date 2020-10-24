//this file is used only for AddMeal, but should be used everywhere.
import axios from "axios";
import { GET_ERRORS, USER_LOADING } from "./types";
import config from "../config";

// add a meal and image
export const addMeal = (userData, onDone) => dispatch => {
  console.log("Adding meal");
  return axios
    .post(`${config.SERVER_HOST}/api/meals/`, userData)
    .then(res => {
      console.log(`meal add got result: ${JSON.stringify(res.data)}`);
      const meal_id = res.data.id;
      console.log(`meal added: ${JSON.stringify(meal_id)}`);
      userData.meal_id = res.meal_id;
      userData.meal_id = meal_id;
      return axios.post(`${config.SERVER_HOST}/api/meals/image/`, userData)
        .then(res2 => {
          console.log(`add image: [${JSON.stringify(res2)}]`);
          return onDone();
        })
        .catch(err => {
          console.error(`Error in adding an image: ${JSON.stringify(err)}`);
        });
    })
    .catch(err => {
      console.error(`Error in addMeal: ${JSON.stringify(err)}`);
      dispatch({
        type: GET_ERRORS,
        //payload: err.response.data
      })
    }
    );
};


//delete meal
export const deleteMeal = (id) => {
  return axios.delete(`${config.SERVER_HOST}/api/meals/${id}`);
}
//get
export const getMeals = (id) => {
  return axios.get(`${config.SERVER_HOST}/api/meals/${id}`);
};

//get my meals
export const getMyMeals = (id) => {
  return axios.get(`${config.SERVER_HOST}/api/meals/my/${id}`);
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
      //.then(res => dispatch(res))
    );
};

//get attends by meal (?)
export const getAttendByMeal = attendData => {
  return axios
    .get(`${config.SERVER_HOST}/api/attends/meal/${attendData.meal_id}`, attendData);
};


//get info about a meal
export const getMealInfo = attendData => {
  return axios
    .get(`${config.SERVER_HOST}/api/meals/info/${attendData.meal_id}`);
};


//get a list of meals where the user attends
export const getAttendedMeals = userId => {
  return axios
    .get(`${config.SERVER_HOST}/api/meals/attends/${userId}`);
};

//get a list of guests for this meal
export const getGuestList = mealId => {
  return axios.get(`${config.SERVER_HOST}/api/meals/guests/${mealId}`)
};



// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
