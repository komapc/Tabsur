import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addMeal, getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";

class GuestList extends Component {
  constructor(props) {
    super(props);
    this.state = props;
    this.state.guests=[];
  }
  render() {
    return (
      <div >
        Guests list
      </div>
    );
  }
};

class ShowMeal extends Component {

  constructor(props) {
    super(props);
    this.state = props.location.state;
  }

  render() {
    return (
      <div className="main">
      <MealListItem meal={this.props.meal} />
      <GuestList mealId={this.props.meal.id}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addMeal }
)(withRouter(ShowMeal));
