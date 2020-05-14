import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import MealListItem from "./MealListItem";
import { getMyMeals } from "../../actions/mealActions";
import config from "../../config";

class MyMeals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      mealsAttended: []
    };
  }

  componentDidMount() {
    axios.get(`${config.SERVER_HOST}/api/meals/my/` + this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ meals: res.data });
      }).catch(err => {
        console.log(err);
      });
      axios.get(`${config.SERVER_HOST}/api/meals/attends/` + this.props.auth.user.id)
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
