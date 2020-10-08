import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, loginUserFB, logoutUser } from "../../actions/authActions";
import FacebookLoginWithButton from 'react-facebook-login';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import store from "../../store";
const handleLogout = (event) =>{
    store.dispatch(logoutUser());
}

const Settings = () => {
  // email: "",
  // password: "",
  // errors: {},
  // user: false,
  // picture: {}

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
        <Button onClick={handleLogout}>
          Logout
        </Button>

      </Grid>
    </>
  );
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
