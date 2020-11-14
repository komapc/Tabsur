import React, { Component } from "react";
import { connect } from "react-redux";
import MealListItem from "./MealListItem";
import { getMyMeals, getAttendedMeals } from "../../actions/mealActions";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { Typography } from "@material-ui/core";


const MealList = (props) => {
  {
    return <>
    {props.meals.length === 0 ? <Typography>{props.EmptyMealMessage}</Typography> :
    props.meals.map(meal =>
      <MealListItem key={meal.id} meal={meal} />
    )}
    </>

  }
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
class MyMeals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      mealsAttended: [],
      value: 0
    };
    this.updateLists();
  }
  updateLists() {

    if (!this.props.auth.isAuthenticated) {
      return;
    }
    getMyMeals(this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ meals: res.data });
      }).catch(err => {
        console.error(`getMyMeals error: ${err}`);
      });
    getAttendedMeals(this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ mealsAttended: res.data });
      }).catch(err => {
        console.error(err);
      });
  }
  componentDidUpdate(nextProps) {
    if (nextProps.active !== this.state.active) {
      this.setState({ active: nextProps.active });
      if (nextProps.active) {
        this.updateLists();
      }
    }
  }

  render() {
    const handleChange = (event, newValue) => {
      this.setState({ value: newValue });
    };

    return (
      < >
        <AppBar position="sticky">
          <Tabs
            value={this.state.value}
            onChange={handleChange}
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
        <TabPanel value={this.state.value} index={0}>

          <MealList meals={this.state.meals} EmptyMealMessage="No active meals" />
        </TabPanel>
        <TabPanel value={this.state.value} index={1}>

          <MealList meals={this.state.meals} EmptyMealMessage="No meals" />
        </TabPanel>
      </>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
)(MyMeals);
