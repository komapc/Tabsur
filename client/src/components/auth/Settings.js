import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, loginUserFB, logoutUser } from "../../actions/authActions";
import FacebookLoginWithButton from 'react-facebook-login';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import store from "../../store";
import { useHistory } from "react-router-dom";

import BackBarMui from "../layout/BackBarMui";
const handleLogout = (event) => {
  store.dispatch(logoutUser());
}

const onEmailChange = (e) =>
{
  console.log(e);
}
const Settings = () => {
  var email ="";
  // password: "",
  // errors: {},
  // user: false,
  // picture: {}
  const history = useHistory();
  return (
    <>
      <h4 className="wizard-caption">Settings</h4>
      <BackBarMui history={history} />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        {/* <div>
          <TextField
            variant="outlined"
            onChange={onEmailChange}
            value={email}
            id="email"
            type="email"
            
            label={'Email'}
            style={{ width: '100%', marginTop: '1vh' }}
          />
         </div> */}

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
