import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

class MyMeals extends Component {


  constructor(props) {
    super(props);
    this.state = {
      meals: []
    };
  }

  render() {
    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy ">
            <h4>
              About us.
            </h4>
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
)(MyMeals);
