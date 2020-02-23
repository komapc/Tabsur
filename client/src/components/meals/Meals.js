import React, { Component } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";
import axios from 'axios';
import Map from './Map';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import config from "../../config";
/*
const MapWithAMarker = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: 34.397, lng: 150.644 }}
  >
    <Marker
      position={{ lat: 34.397, lng: 150.644 }}
    />
  </GoogleMap>
));
*/
class Meals extends Component {


  constructor(props) {
    super(props);
    this.state = {
      meals: []
    };
  }

  componentDidMount() {
    axios.get(`${config.SERVER_HOST}/api/meals/get`)
      .then(res => {
        console.log(res);
        this.setState({ meals: res.data });
      });
  }


  render() {
    const { user } = this.props.auth;

    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy " className="split left">
            <h4 className="caption">
              ACTIVE MEALS:
            </h4>
            <div className="flow-text grey-text text-darken-1">
              {this.state.meals.map(meal =>
                <div key={meal._id}>
                  <MealListItem meal={meal} />
                </div>

              )}
            </div >
          </div>
          <div className="split right">
            {/*<MapWithAMarker
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: '100%' }} />}
              containerElement={<div style={{ height: '70%' }} />}
              mapElement={<div style={{ height: '100%' }} />}
            />
            */}
            <Map
              google={this.props.google}
              center={{ lat: 38.5204, lng: 38.8567 }}
              height='300px'
              zoom={10}
            />
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
