import React, { Component } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';
import MealsMapShow from './MealsMapShow';
import BottomMealInfo from './BottomMealInfo'
import config from "../../config";
const defaultLocation = { lng: 34.808, lat: 32.09 };
class MealsMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      meal: {},
      isSelected: false,
      selectedMeal: 0
    };
  }
  onMapClicked = (event) => {
    this.setState({ isSelected: false });
  }

  onMarkerClicked = (event) => {
    this.setState({ 
      meal: event, 
      isSelected: true, 
      selectedMeal: event.id});
      console.log("onMarkerClicked" + JSON.stringify(this.state.meal));
  }

  componentDidMount() {
    axios.get(`${config.SERVER_HOST}/api/meals/get/` + this.props.auth.user.id)
      .then(res => {
        console.log(res);
        this.setState({ meals: res.data });
      });
  }

  render() {
    console.log("Selected meal: " + JSON.stringify(this.state.meal));
    return (
     
      <div className={"main " + (this.state.isSelected ? 'meals-map-info' : 'meals-map')}>
         
        <MealsMapShow
          meals={this.state.meals}
          defaultLocation={defaultLocation}
          onMarkerClick={this.onMarkerClicked}
          onMapClick={this.onMapClicked}
          userId= {this.props.auth.user.id}
          selectedMeal={this.state.selectedMeal}
        />

        <div>
          <BottomMealInfo 
            meal={this.state.meal} />
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
)(MealsMap);
