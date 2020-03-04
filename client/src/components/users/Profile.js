import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import axios from 'axios';
import config from "../../config";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: this.props.match.params.id,
      errors: {}
    };

    axios.get(`${config.SERVER_HOST}/api/users/get/` + this.props.match.params.id)
      .then(res => {
        console.log(res.data);
        this.setState({ user: res.data });

      });
  }


  render() {
    const { errors } = this.state;
    if (!this.state.user) {
      return <div> Loading </div>
    }
    return (

      <div className="container">
        <div className="row">
          <h1>Profile</h1>
          <div className="col s8 offset-s2">

            <div className="input-field col s12">
              User name: {this.state.user.name}
            </div>
            <div className="input-field col s12">
              User address: {this.state.user.address || "unknown"}
            </div>
          </div>

        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Profile));
