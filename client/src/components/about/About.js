import React, { Component } from "react";
import { connect } from "react-redux";
//import { system } from "../../actions/authActions";
import axios from 'axios';
import config from "../../config";
class About extends Component {


  constructor(props) {
    super(props);
    this.state = {
      user: []
    };
    // system().then(systemData => {
    // console.log(systemData);})
    axios.get(`${config.SERVER_HOST}/api/users/system`)
    .then(res => {
      console.log(res.data);

    });
  }

  render() {
    const { user } = this.props.auth;
    console.log("About log:" + user.name);
    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy ">
            <h4>  Hey, 
              <small>{user.name}</small>
            </h4>
            <div>
              Welcome to Coolanu TableSurfing community!
              <br />
              If you have food &ndash; invite guests,
              <br />
              if you are hungry &ndash; find a host!
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
)(About);
