import React, { Component } from "react";
import { connect } from "react-redux";

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
            <div>
              Welcome to Coolanu TableSurfing community!
              <br />
              If you have food - invite guests,
              <br />
              if you are hungry - find a host!
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(
)(MyMeals);
