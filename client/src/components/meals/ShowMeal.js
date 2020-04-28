import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addMeal, getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";
class ShowMeal extends Component {

  constructor(props) {
    super(props);
    this.state = props.location.state;
  //  alert(JSON.stringify(props.location));
  }

  render() {
    return (
      <div className="main">
      <MealListItem meal={this.state.meal} />
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
