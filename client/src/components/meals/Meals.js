import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MapWithAMarker = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    <Marker
      position={{ lat: -34.397, lng: 150.644 }}
    />
  </GoogleMap>
));

class Meals extends Component {


  constructor(props) {
    super(props);
    this.state = {
      meals: []
    };
  } 

  componentDidMount() {
      axios.get('/api/meals/get')
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
              Hey {user.name}, 
                ACTIVE MEALS:
              
            </h4>
              <div className="flow-text grey-text text-darken-1">
                {this.state.meals.map(meal =>
                    <div key={meal._id}>
                        <img src={"http://www.catsinsinks.com/cats/rotator.php?"+meal._id} className="meal_image"></img>
                        <div className="meal_props">
                            <span className="mealName" > {meal.mealName}</span>
                            <br/>
                            <span> {new Date(meal.dateCreated).toUTCString()}</span>
                            <br/>
                            <Link to={"/Attend/" + meal._id}> Attend</Link>    
                        </div>
                    </div>
              )}
              </div >
          </div>
          <div className="split right">
         <MapWithAMarker
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: '100%' }} />}
              containerElement={<div style={{ height: '70%' }} />}
              mapElement={<div style={{ height: '100%'   }} />}
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
