import React, { Component } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";
import axios from 'axios';
import MapLocationSelector from './MapLocationSelector';

import config from "../../config";

class MealsMap extends Component {

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
      <MapLocationSelector
                  handleLocationUpdate={this.onLocationUpdate}
                  // address={this.state.address}
                  defaultLocation={defaultLocation}
                /> 
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,

});

export default connect(
  mapStateToProps,
  { getMeals }
)(MealsMap);
