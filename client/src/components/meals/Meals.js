import React, { Component } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";
import axios from 'axios';
import config from "../../config";
import loadingGIF from "../../resources/animation/loading.gif";
class Meals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      loading: true
    };
  }

  componentDidMount() {
    axios.get(`${config.SERVER_HOST}/api/meals/` + this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ meals: res.data, loading: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="main">
        <div className="row">
          {
            this.state.loading ?
              <img src={loadingGIF} alt="loading" /> :
              <div className="map-meal-info">
                {this.state.meals.map(meal =>
                  <div key={meal.id}>
                    <MealListItem meal={meal} />
                  </div>
                )}
              </div>}
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
