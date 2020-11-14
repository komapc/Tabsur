import React, { useEffect, useState, Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MealListItem from "./MealListItem";
import { deleteMeal, getMealInfo } from "../../actions/mealActions";
import AttenderList from "./AttenderList";
import BackBarMui from "../layout/BackBarMui";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const deleteMealEvent = (history, meal) => {
  deleteMeal(meal.id).then(res => {
    console.log(`Meal deleted: ${JSON.stringify(res.data)}`);

    history.push({ pathname: '/MyMeals' });
  })
    .catch(err => {
      console.error(err);
    });
};

const editMealEvent = (history, meal) => {
  history.goBack();
};

const goToMaps = (event, id) => {
  event.stopPropagation();
  event.preventDefault();
  this.props.history.push(`/MealMap/${id}`);//todo: fix, redirect properly to the map
};

const ShowMeal = (props) => {

  const state = props.location.state;

  const mealId = props.match.params.id;
  const [meal, setMeal] = useState(null);

  console.log(`Meal id: ${mealId}`);
  useEffect(() => {

    if (state) {
      setMeal(props.location.state.meal);
    }
    else {
      console.log(`Meal id: ${mealId}`);

      getMealInfo(mealId, props.auth.user.id)
        .then((res) => {
          setMeal(res.data[0]);
          console.log(`getMealInfo: ${JSON.stringify(res.data[0])}`);
        })
        .catch(err => {
          console.error(err);
        });

    }
  }, [mealId, props, state]);

  const my = (meal) ?
    meal.host_id === props.auth.user.id : false;
  return (
    <>

      <BackBarMui history={props.history} />
      <Grid container spacing={2}
        justify="space-around"
        alignItems="flex-start"
        direction="column">
        <Box style={{ width: "80vw" }} m={2} xs={12} >
          {meal ? <MealListItem meal={meal} /> : <></>}
          <h3>Description</h3>
          <div >{meal ? meal.description : ""}</div>
          <h3>Address</h3>
          {/* <Typography variant="body2" color="textPrimary" component="p" onClick={(event) => { props.goToMaps(event, props.meal.id) }}>
          <RoomIcon fontSize='small' style={{ color: 'black', }} /> {props.meal.address}
        </Typography> */}
          <div onClick={(event) => { goToMaps(event, props.meal.id) }}>{meal ? meal.address : ""}</div>
          <AttenderList mealId={mealId} userId={props.auth.user.id} />
          {
            my ? <>
              <Button variant="outlined" onClick={(e) => deleteMealEvent(props.history, meal)}> Delete </ Button>
              <Button variant="outlined" onClick={() => editMealEvent(props.history, meal)}> Edit </ Button>
            </> : ""
          }
        </Box>
      </Grid>
    </>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withRouter(ShowMeal));
