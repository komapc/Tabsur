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
      user:"",
      mealName: "",
      type: "",
      location: "",
      errors: {}
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
      mealName: this.state.mealName
    };

    this.props.addMeal(newMeal, this.props.history);
  };

  render() {
    //const { mealName } = this.props.mealName;
    const { errors } = this.state;
    const { user } = this.props.auth;
    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy ">
            <h4>
              <b>Create a meal,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                Add a meal:
              </p>
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
                 
                  <div className="input-field col s12">
                    <input
                      onChange={this.onChange}
                      value={this.state.location}
                      error={errors.password}
                      id="location"
                      type="date"
                      className={classnames("", {
                        invalid: errors.password
                      })}
                    />
                 
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
