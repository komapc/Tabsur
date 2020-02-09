import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';

class Meals extends Component {

  render() {
    const { user } = this.props.auth;
    j = axios.get("api/get");
    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy ">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                List of meals
              </p>
              
            </h4>
          </div>
        </div>
      </div>
    );
  }
}

Meals.propTypes = {
  //logoutUser: PropTypes.func.isRequired,
  //auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getMeals }
)(Meals);
