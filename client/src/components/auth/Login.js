import React, { Component, Fragment } from "react";
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, loginUserFB } from "../../actions/authActions";
import classnames from "classnames";
import GoogleLogin from 'react-google-login';
import FacebookLoginWithButton from 'react-facebook-login';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

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
);

class Login extends Component {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/");
    }
    console.log(`componentWillReceiveProps: ${JSON.stringify(nextProps)}.`);
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
    console.log(`Errors: ${JSON.stringify(this.state.errors)}`);
  };

  responseGoogle = (response) => {
    console.log(response);
  };

  facebookResponse = (response) => {
    console.log(`facebookResponse: ${JSON.stringify(response)}`);
    const userData = {
      email: response.email,
      name: response.name,
      picture: response.picture
    };

    this.props.loginUserFB(userData);
  };

  render() {
    const { errors } = this.state;
    return (
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh', width: '100vw' }}
      >
        <Fragment>
          <Paper elevation={3} variant="outlined" style={{ borderColor: 'black' }}>
            <div style={{
              padding: '10%', width: `90vw`
            }}>

              <Grid item xs={12}>
                Don't have an account? <Link to="/register">Register</Link>
              </Grid>

            </div>
            <form noValidate onSubmit={this.onSubmit} >

              <TextField
                variant="standard" color="secondary"
                onChange={this.onChange}
                value={this.state.email}
                error={errors.email}
                id="email"
                type="email"
                className={classnames("", {
                  invalid: errors.email || errors.emailnotfound
                })}
                label={'Email'}
                xs={12}
                style={{ width: '100%' }}
              />
              <Grid xs={12} item >
                <Typography className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </Typography>
              </Grid>
              <Grid xs={12} item >
                <TextField
                  variant="standard" color="secondary"
                  label={'Password'}
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                  style={{ width: '100%', marginTop: '10%' }}
                />

                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </Grid>
              <Grid xs={12} item >
                <Button
                  variant="contained" color="secondary"
                  type="submit"
                  style={{ width: '100%', marginTop: '10%' }}
                >
                  Login
                </Button>
                {this.state.user ?
                  <div>{JSON.stringify(this.state.user)}</div> :
                  <div className="btn-fb-login-wrapper">
                    <FBLoginButton facebookResponse={this.facebookResponse} /></div>
                }
              </Grid>
            </form>
            {
              (this.props.match.params.extend) ?
                <GoogleLogin xs={12}
                  clientId={`${googleKey}`}
                  buttonText="Login"
                  onSuccess={this.props.responseGoogle}
                  onFailure={this.props.responseGoogle}
                  cookiePolicy={'single_host_origin'}
                />
                : <> </>
            }
          </Paper>
        </Fragment>
      </Grid >

    );
  }
}

Login.propTypes = {
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
)(Login);
