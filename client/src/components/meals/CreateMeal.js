import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addMeal } from "../../actions/mealActions";
import MapLocationSelector from "./MapLocationSelector";
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import Grid from '@material-ui/core/Grid';
import attend from "../../resources/attended.svg"
import locationIcon from "../../resources/location_icon.svg"
import dateIcon from "../../resources/date.svg"
import servingsIcon from "../../resources/servings_icon.svg"

class CreateMeal extends Component {
  
  constructor() {
    super();
    
    const defaultLocationConst = { lng: 34.808, lat: 32.09 };
    const now = Date.now();
    this.state = {
      name: `My meal`,
      location: defaultLocationConst,
      defaultLocation:defaultLocationConst,
      address: " ",
      guest_count: 2,
      errors: {},
      showMap: false,
      selectedDate: new Date(now + 86400000),
      submitted: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.auth.isAuthenticated) {
      this.props.history.push("/Login");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
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
    const formatedDate=new Date(this.state.selectedDate).getTime();
    const newMeal = {
      name: this.state.name,
      date: formatedDate,
      address: this.state.address,
      location: this.state.location,
      host_id: this.props.auth.user.id,
      guest_count: this.state.guest_count,
      image_path: "#RANDOM"
    };

    this.props.addMeal(newMeal, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="main">
        <form noValidate onSubmit={this.onSubmit}>
          <div className="vertical-spacer" />
          {/* name */}
          <div className="name-input-field input-field col s12">
            <input
              onChange={this.onChange}
              value={this.state.name}
              error={errors.name}
              id="name"
              type="text"
              className={errors.name ? 'invalid' : ''}
              notched="true"
            />
            <label htmlFor="name" shrink="true">Meal name</label>
            <span className="red-text">{errors.name}</span>
          </div>
          {/* Date and time */}
          <div className="date-div">
            {/* <span><img className="meal-info-icons" src={dateIcon} alt="date" /></span> */}
            <span>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around"><span><img className="meal-info-icons" src={dateIcon} alt="date" /></span>
                  <KeyboardDateTimePicker
                    variant="dialog"
                    ampm={false}
                    label="date & time"
                    id="selectedDate"
                    value={this.state.selectedDate}
                    onChange={(value) => { this.setState({ selectedDate: value }) }}
                    onError={console.log}
                    disablePast
                    showTodayButton
                    autoOk
                    format="yyyy/MM/dd HH:mm"
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </span>
          </div>

          {/* Address*/}
          <div>
            <img className="meal-info-location-icons" src={locationIcon} alt="location" />
            <span className="location-input-field input-field col s12">
              <input
                onChange={this.onChange}
                onClick={this.onAddressClickHandle}
                value={this.state.address }
                error={errors.password}
                id="address"
                type="text"
                notched="true"
              />
              <label htmlFor="address" shrink="true">Location</label>
              <span className="red-text">{errors.address}</span>
            </span>
          </div>

          {/* Number of guests */}
          <div>
            <img className="meal-info-guests-icons" src={servingsIcon} alt="servings" />
            <span className="location-input-field input-field col s12">
              <input
                min={0} max={10}
                onChange={this.onChange}
                pattern='[0-9][0-9][0-9]'
                value={this.state.guest_count}
                error={errors.guest_count}
                id="guest_count" name="guest_count"
                type="number"  maxLength="2"
                notched="true"
              /> 
              <label htmlFor="guest_count"  shrink>Number of guests</label>
              <span className="red-text">{errors.guest_count}  </span>
            </span>
          </div>

          {/*Submit button */}
          <div className="button-div">
            {this.state.submitted ?
              <div className="meal-created-icon"><img src={attend} alt={"Done"} /></div> :
              <button
                type="submit"
                className="button hoverable accent-3">
                Open Meal
              </button>}
          </div>
        </form>
       
        <div className={this.state.showMap ? 'createMealMap' : 'createMealMap-hidden'}>
          <MapLocationSelector
            handleLocationUpdate={this.onLocationUpdate}
            // address={this.state.address}
            defaultLocation={this.state.defaultLocation}
            handleExit={this.onMapExit}
          />
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
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addMeal }
)(withRouter(CreateMeal));
