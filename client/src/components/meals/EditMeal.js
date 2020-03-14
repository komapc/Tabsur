import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addMeal, getMeals } from "../../actions/mealActions";
import classnames from "classnames";

class Meals extends Component {

  constructor() {
    super();
    this.state = {
      user: "",
      name: "",
      type: "",
      location: "",
      guests: 0, //max number of invited guests
      errors: {},
    };
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newMeal = {
      name: this.state.name,
      host: this.props.auth.user.id,
      guests: this.state.guests,
      createdAt: this.state.date,
      location: this.state.location || "here and now"
    };

    this.props.addMeal(newMeal, this.props.history);
  };

  render() {
    const { errors } = this.state;
    const { user } = this.props.auth;
    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy ">
            <h4>
              <b>Edit the meal</b> {user.name}

            </h4>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <label htmlFor="name">Meal name</label>
                <span className="red-text">{errors.name}</span>
              </div>

              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.date}
                  error={errors.password}
                  id="date"
                  type="date"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
                <label htmlFor="date">Date</label>
                <span className="red-text">{errors.name}</span>
              </div>

              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.location}
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
