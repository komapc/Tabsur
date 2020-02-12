import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';

class MyMeals extends Component {


  constructor(props) {
    super(props);
    this.state = {
      meals: []
    };
  }

  render() {
    const { user } = this.props.auth;
    
    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy ">
            <h4>
              Hey {user.name}
            </h4>
          </div>
          <div>
          Here is your meals list:
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
)(MyMeals);
