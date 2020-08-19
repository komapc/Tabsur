import React, { Component } from "react";
import { connect } from "react-redux";
import MealListItem from "./MealListItem";
import { getMyMeals, getAttendedMeals } from "../../actions/mealActions";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
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
  updateLists()
  {
    getMyMeals(this.props.auth.user.id)
    .then(res => {
      console.log(res.data);
      this.setState({ meals: res.data });
    }).catch(err => {
      console.error(err);
    });
  getAttendedMeals(this.props.auth.user.id)
    .then(res => {
      console.log(res.data);
      this.setState({ mealsAttended: res.data });
    }).catch(err => {
      console.error(err);
    });
  } 
  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    
    this.props.setFabVisibility(true);
    this.props.setSwipability(true)
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
      <div >
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
          <div className="flow-text grey-text text-darken-1">
            {this.state.meals.map(meal =>
              <div key={meal.id}>
                <div key={meal.id}>
                  <MealListItem meal={meal} />
                </div>
              </div>
            )}
          </div>
        </TabPanel>
        <TabPanel value={this.state.value} index={1}>
          <div className="flow-text grey-text text-darken-1">
            {this.state.mealsAttended.map(meal =>
              <div key={meal.id}>
                <div key={meal.id}>
                  <MealListItem meal={meal} />
                </div>
              </div>
            )}
          </div >
        </TabPanel>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,

});

export default connect(
  mapStateToProps,
)(MyMeals);
