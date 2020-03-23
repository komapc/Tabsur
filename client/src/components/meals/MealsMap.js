import React, { Component } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';
import MealsMapShow from './MealsMapShow';

import config from "../../config";
const defaultLocation = {lng: 34.808, lat: 32.09};
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
      <div className="mealsMap">
      <MealsMapShow   
          meals={this.props.meals}
          defaultLocation={defaultLocation}
        /> 
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
)(MealsMap);
