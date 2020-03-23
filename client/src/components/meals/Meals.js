import React, { Component } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";
import axios from 'axios';
import MapLocationSelector from './MapLocationSelector';

import config from "../../config";

class Meals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meals: []
    };
  }
  onMapClicked = (event) => {
    //nothing for now
  }

  componentDidMount() {
    axios.get(`${config.SERVER_HOST}/api/meals/get`)
      .then(res => {
        console.log(res);
        this.setState({ meals: res.data });
      });
  }


  render() {

    return (
      <div className="container valign-wrapper">
        <div className="row">
            <div className="flow-text grey-text text-darken-1">
              {this.state.meals.map(meal =>
                <div key={meal._id}>
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
