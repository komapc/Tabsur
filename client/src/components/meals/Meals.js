import React, { Component } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";
import axios from 'axios';
import config from "../../config";

class Meals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meals: []
    };
  }

  componentDidMount() {
    axios.get(`${config.SERVER_HOST}/api/meals/get/` + this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ meals: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="main">
        <div className="row">
          <div className="map-meal-info">
            {this.state.meals.map(meal =>
              <div key={meal.id}>
                <MealListItem meal={meal} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,

});

export default connect(
  mapStateToProps,
  { getMeals }
)(Meals);
