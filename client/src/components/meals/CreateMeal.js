import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addMeal } from "../../actions/mealActions";
import { DatePicker } from 'antd';
import MapLocationSelector from "./MapLocationSelector";
import attend from "../../resources/attended.svg"

import 'antd/es/date-picker/style/css';
const defaultLocation = { lng: 34.808, lat: 32.09 };

class CreateMeal extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      location: defaultLocation,
      address: "",
      guestCount: 0,
      errors: {},
      showMap: false,
      date: new Date().getDate(),
      submitted: false
    };
    
  }

  onLocationUpdate = ({ address, location }) => {
    this.setState({ address, location })
  };

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onAddressClickHandle = e => {
    this.setState({ showMap: true });
  }
  onMapExit = (e) => {
    this.setState({ showMap: false })
  }

  onSubmit = e => {
    e.preventDefault();

    const newMeal = {
      name: this.state.name,
      date: this.state.date,
      address: this.state.address,
      location: this.state.location,
      host_id: this.props.auth.user.id,
      guestCount: this.state.guestCount,
    };

    this.props.addMeal(newMeal);
     
    this.setState({submitted:true});
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="main">

        <div className="row">
          <div >
            <form noValidate onSubmit={this.onSubmit}>
              {/* name */}
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={errors.name ? 'invalid' : ''}
                />
                <label htmlFor="name">Meal name</label>
                <span className="red-text">{errors.name}</span>
              </div>
              {/* Date and time */}
              <div className="">
                <DatePicker className="picker" mode="date" showTime="true" />
              </div>
              {/* Address */}
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  onClick={this.onAddressClickHandle}
                  value={this.state.address || ""}
                  error={errors.password}
                  id="address"
                  type="text"
                />
                <label htmlFor="address">Address</label>
                <span className="red-text">{errors.name}</span>
              </div>
              {/* Number of guests */}
              <div className="input-field col s12">
                <input min={0} max={10}
                  onChange={this.onChange}
                  value={this.state.guestCount}
                  error={errors.password}
                  id="guestCount"
                  type="number" pattern="[0-9]*" maxlength="2"
                />
                <label htmlFor="guestCount">Max number of guests</label>
                <span className="red-text">{errors.guestCount}  </span>
              </div>
              {/*Submit button */}
              {this.state.submitted?
              <img className="attend-button" src={attend} alt={"Done"}/>:
              <button
                type="submit"
                className="button hoverable accent-3">
                Open
              </button>}
            </form>
          </div>
          {
            // TODO: use user current location
          }
          <div className={this.state.showMap ? 'createMealsMap' : 'createMealsMap-hidden'}>
            <MapLocationSelector
              handleLocationUpdate={this.onLocationUpdate}
              // address={this.state.address}
              defaultLocation={defaultLocation}
              handleExit={this.onMapExit}
            />
          </div>
        </div>
      </div>
    );
  }
}

CreateMeal.propTypes = {
  addMeal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addMeal }
)(withRouter(CreateMeal));
