import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import MealListItem from "./MealListItem";
import { getMyMeals, getAttendedMeals } from "../../actions/mealActions";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { Typography } from "@material-ui/core";


const MealList = (props) => {
  return <>
    {props.meals.length === 0 ? <Typography>{props.EmptyMealMessage}</Typography> :
      <>
        <h3>{props.caption}</h3>
        {props.meals.map(meal =>
          <MealListItem key={meal.id} meal={meal} />
        )}
      </>
    }
  </>
}
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {children}
    </div>
  )
}
const MyMeals = (props) => {

  const [meals, setMeals] = useState([]);
  const [attended, setAttended] = useState([]);
  const [value, setValue] = useState(0);

  const id = props.auth.user.id;
  useEffect(() => {
    updateLists();
  }, [props, id]);

  const updateLists = () => {
    if (!props.auth.isAuthenticated) {
      return;
    }
    getMyMeals(id)
      .then(res => {
        console.log(res.data);
        setMeals(res.data);
      }).catch(err => {
        console.error(`getMyMeals error: ${err}`);
      });
    getAttendedMeals(id)
      .then(res => {
        console.log(res.data);
        setAttended(res.data);
      }).catch(err => {
        console.error(err);
      });
  }

  const now = new Date();
  const currentMeals = meals.filter(meal => new Date(meal.date) >= now);
  const pastMeals = meals.filter(meal => new Date(meal.date) < now);
  const currentAttended = attended.filter(meal => new Date(meal.date) >= now);
  const pastAttended = attended.filter(meal => new Date(meal.date) < now);

  return (
    <>
      <AppBar position="sticky">
        <Tabs
          value={value}
          onChange={(e, newValue) => { setValue(newValue) }}
          centered
          indicatorColor='primary'
          TabIndicatorProps={{
            style: {
              backgroundColor: "primary"
            }
          }}>
          <Tab label="Created" />
          <Tab label="Attended" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <MealList meals={currentMeals} EmptyMealMessage="No active meals" caption="Active meals" />
        <MealList meals={pastMeals} EmptyMealMessage="No meals" caption="Past meals" />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MealList meals={currentAttended} EmptyMealMessage="No meals" caption="Active attended meals" />
        <MealList meals={pastAttended} EmptyMealMessage="No meals" caption="Past attended meals" />
      </TabPanel>
    </>
  );
}
const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
)(MyMeals);
