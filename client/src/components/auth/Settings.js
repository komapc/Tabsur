import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, loginUserFB, logoutUser } from "../../actions/authActions";
import classnames from "classnames";
import GoogleLogin from 'react-google-login';
import FacebookLoginWithButton from 'react-facebook-login';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import store from "../../store";
//const keys = require("../config/keys");
const googleKey = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";


const FBcomponentClicked = (function (response) {
  if (response.authResponse) {
    console.log('Welcome!  Fetching your information.... ' + JSON.stringify(response));
  } else {
    console.log('User cancelled login or did not fully authorize.');
  }
});

const FBonFailure = (function (err) {
  console.error(`Failed to login with faceook: ${JSON.stringify(err)}`);
});

const FBLoginButton = ({ facebookResponse }) => (
  <FacebookLoginWithButton
    appId="441252456797282"
    // autoLoad="false"
    fields="name,email,picture"
    onClick={FBcomponentClicked}
    onFailure={FBonFailure}
    callback={facebookResponse}
    textButton="Continue with Facebook"
    size="metro"
    redirectUri="/"
    isMobile={false}
    icon="fa-facebook" />
)

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      user: false,
      picture: {}
    };
  }

  
  handleLogout = (event) =>{
    store.dispatch(logoutUser());
}

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  responseGoogle = (response) => {
    console.log(response);
  }

  facebookResponse = (response) => {
    console.log(JSON.stringify(response));
    const userData = {
      email: response.email,
      name: response.name,
      picture: response.picture
    };

    this.props.loginUserFB(userData);
  }

  render() {
    const { errors } = this.state;
    const formMinWidth = window.innerWidth < 500 ? window.innerWidth : 500;
    return (
      <>
      <h1>Settings</h1>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >


        <Button onClick={this.handleLogout}>
          Logout
        </Button>

      </Grid>
</>
    );
  }
}
Settings.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser, loginUserFB }
)(Settings);
