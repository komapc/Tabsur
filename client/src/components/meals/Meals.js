import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";
import loadingGIF from "../../resources/animation/loading.gif";
import { Typography } from "@material-ui/core";

const Meals = (props) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const id = props.auth.user.id || -1;

  const refresh = (props) => {
    if (!props.auth.isAuthenticated)
    {
      console.warning(`Friends  called with bad id: ${props.id}.`);
      return;
    }
    console.log(`refreshing meal list.`);
    return getMeals(props.auth.user.id)
      .then(res => {
        console.log(res.data);
        setMeals(res.data);
      })
      .catch(err => {
        console.error(err);
        setMeals([]);
      })
      .finally(() => {
        console.log("loading set to false.")
        setLoading(false);
      })
  }

  useEffect(() => {
    refresh(props);
  }, [props]);
  return < React.Fragment >
    {
      loading ?
        <img src={loadingGIF} alt="loading" /> :
        <>
          {meals.length === 0 ? <Typography>No meals yet</Typography> :
            meals.map(meal =>
              <MealListItem key={meal.id} meal={meal} />
            )}
        </>}
  </React.Fragment >
}

const mapStateToProps = state => ({
  auth: state.auth,

});
const mapDispatchToProps = (dispatch) => ({
  getMeals: (form, history) => getMeals(form, history)(dispatch)
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(Meals);
