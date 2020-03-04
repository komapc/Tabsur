import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addMeal } from "../../actions/mealActions";
import classnames from "classnames";
import Map from './Map';  
import { DatePicker } from 'antd';  

import 'antd/es/date-picker/style/css'; // for css
class Meals extends Component {

  constructor() {
    super();
    this.state = {
      user: "",
      mealName: "",
      type: "",
      location: "",
      guests: 0, //max number of invited guests
      errors: {},
      date:  new Date().getDate(),
      latLng: [] //long/lat
    };
  }
  setStartDate = date =>
  {
    this.props.setState("date", date);
  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };


  onMapClicked = (e, mapState) => {
    var pos = e.latLng; 
    this.setState({location:mapState.address}); 
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newMeal = {
      mealName: this.state.mealName,
      host: this.props.auth.user.id,
      guests: this.state.guests,
      dateCreated: this.state.date,
      location: this.state.location || "here and now",
      position: [0,0]
    };

    this.props.addMeal(newMeal, this.props.history);
  };

  render() {
    const { errors } = this.state;
    const { user } = this.props.auth;
    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy split left">
            <h4>
                Add a meal:
            </h4>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="mealName"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <label htmlFor="mealName">Meal name</label>
                <span className="red-text">{errors.name}</span>
              </div>
              <div className="col s12 picker">
              <DatePicker className="picker" mode="date" showTime="true"
              /> 
              </div>
            
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}  
                  value={this.state.location || "default"}
                  error={errors.password}
                  id="location"
                  type="text"

                />
                <label htmlFor="location">Location</label>
                <span className="red-text">{errors.name}</span>
              </div>

              <div className="input-field col s12">
                <input min={0} max={10}
                  onChange={this.onChange}
                  value={this.state.guests}
                  error={errors.password}
                  id="guests"
                  type="number"

                />
                <label htmlFor="guests">Max number of guests</label>
                <span className="red-text">{errors.name}</span>
              </div>
                <div className="col s12" >
                <button
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3">
                  Add and invite!
                </button>
              </div>
            </form>
          </div>
              <div className="split right">
                <Map
                  google={this.props.google}
                  center={{ lat: 32.09, lng: 34.808 }}
                  height='400px'
                  zoom={10}
                  onClick={this.onMapClicked}
                />
              </div>
        </div>
      </div>
    );
  }
}

Meals.propTypes = {
  addMeal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addMeal }
)(withRouter(Meals));
