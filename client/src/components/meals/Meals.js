import React, { Component } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";

import loadingGIF from "../../resources/animation/loading.gif";
class Meals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      loading: true,
      id: this.props.auth.user.id || -1,
      active: this.props.active
    };
  }

  refresh() {
    getMeals(this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ meals: res.data, loading: false });
      })
      .catch(err => {
        console.err(err);
        this.setState({ meals: [], loading: false });
      })
  }

  componentDidMount() {
    this.refresh();
  };

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.active !== this.state.active) {
      this.setState({ active: nextProps.startTime });
      if (nextProps.active) {
        this.refresh();
      }
    }
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
const mapDispatchToProps = (dispatch) => ({
  getMeals: (form, history) => getMeals(form, history)(dispatch)
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(Meals);
