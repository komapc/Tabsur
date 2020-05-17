import React, { Component } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';
import MealMapShow from './MealMapShow';
import BottomMealInfo from './BottomMealInfo'
import config from "../../config";
class MealMap extends Component {

  constructor(props) {
    super(props);
    const position = { lng: 31.808, lat: 32.09 };
    let selected=0;
    const params=this.props.match.params;
    if (this.props.selectedMeal>0)
    {
      selected=this.props.selectedMeal;
    }
    else if (!isNaN(params.meal_id))
    {
      selected = params.meal_id;
    };
    this.state = {
      meals: [],
      meal: {},
      isSelected: selected>0,
      selectedMeal: selected,
      defaultLocation: position
    };

  }
  onMapClicked = (event) => {
    this.setState({ isSelected: false, selectedMeal: {} });
  }

  onMarkerClicked = (event) => {
    this.setState({
      meal: event,
      isSelected: true,
      selectedMeal: event.id
    });
    console.log("onMarkerClicked" + JSON.stringify(this.state.meal));
  }

  componentDidMount() {
    axios.get(`${config.SERVER_HOST}/api/meals/` + this.props.auth.user.id)
      .then(res => {
        console.log(res);
        this.setState({ meals: res.data });
        if (this.state.isSelected)
        {
          this.setState({ meal: this.state.meals[this.state.selectedMeal] });
        }
      });

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition( (position)=>{

          const p = { lng: position.coords.longitude, lat: position.coords.latitude };

          console.log("geolocation is: ", JSON.stringify(p));
          this.setState({defaultLocation:p});
        });
      }
      else {
        console.log("geolocation is not available.");
      }
  }

  render() {
    console.log("Selected meal: " + JSON.stringify(this.state.meal));
    return (

      <div className={"main " + (this.state.isSelected ? 'meals-map-info' : 'meals-map')}>

        <MealMapShow
          meals={this.state.meals}
          defaultLocation={this.state.defaultLocation}
          onMarkerClick={this.onMarkerClicked}
          onMapClick={this.onMapClicked}
          userId={this.props.auth.user.id}
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
)(MealMap);
