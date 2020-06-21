import React, { Component } from "react";
import { connect } from "react-redux";
import MealListItem from "./MealListItem";
import { getMyMeals, getAttendedMeals } from "../../actions/mealActions";

class MyMeals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      mealsAttended: []
    };
  }

  componentDidMount() {
    getMyMeals(this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ meals: res.data });
      }).catch(err => {
        console.log(err);
      });
    getAttendedMeals(this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ mealsAttended: res.data });
      }).catch(err => {
        console.log(err);
      });
  }
  render() {
    const { user } = this.props.auth;
    return (
      <div className="main">
        <div className="row">
          <h4>
            Hey {user.name},
              Meals you created:
            </h4>
          <div>
            <div className="flow-text grey-text text-darken-1">
              {this.state.meals.map(meal =>
                <div key={meal.id}>
                  <div key={meal.id}>
                    <MealListItem meal={meal} />
                  </div>
                </div>
              )}
            </div >
          </div>
          <h4>
            Meals you attend:
            </h4>
          <div>
            <div className="flow-text grey-text text-darken-1">
              {this.state.mealsAttended.map(meal =>
                <div key={meal.id}>
                  <div key={meal.id}>
                    <MealListItem meal={meal} />
                  </div>
                </div>
              )}
            </div >
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
)(MyMeals);
