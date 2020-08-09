import React, { Component } from "react";
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
  console.log(`Failed to login with faceook: ${JSON.stringify(err)}`);
});

const FBLoginButton = ({ facebookResponse }) => (
  <FacebookLoginWithButton
    appId="441252456797282"
    // autoLoad="false"
    fields="name,email,picture"
    onClick={FBcomponentClicked}
    onFailure={FBonFailure}
    callback={facebookResponse}
    buttonText="Continue with Facebook"
    size="small"
    redirectUri="/"
    isMobile={false}
    icon="fa-facebook" />
)

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      user:false,
      picture:{}
    };
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

  facebookResponse = (response) => 
  { 
    console.log( JSON.stringify(response)  ); 
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
      <div className="main">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '80vh' }}
        >

        <Grid item style={{ minWidth: `${formMinWidth}px` }}>
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/Meals" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              the list
            </Link>
            <div className="col s12">
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <TextField
                  //variant="outlined"
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                  label={'Email'}
                  style={{width: '100%'}}
                />
                {/* <label htmlFor="email">Email</label> */}
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="input-field col s12">
                <TextField
                  //variant="outlined"  
                  label={'Password'}
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                  style={{width: '100%'}}
                />
                
                {/* <label htmlFor="password">Password</label> */}
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12">
                <Button
                  variant="contained" color="primary"
                  type="submit"
                  style={{width: '100%', marginTop: '1vh'}}
                  // className="button waves-effect waves-light hoverable accent-3"
                >
                  Login
                </Button>
                <div>
              {this.state.user ? <div>{JSON.stringify(this.state.user)}</div> :
                <FBLoginButton facebookResponse={this.facebookResponse} />
              }
            </div>
              </div>
            </form>
            {(this.props.match.params.extend)?
            <span>
            <GoogleLogin
              clientId={`${googleKey}`}
              buttonText="Login"
              onSuccess={this.props.responseGoogle}
              onFailure={this.props.responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
            
            </span>
            :<span/>
            }
           
          </div>
        </div>
  </Grid>   

</Grid> 
        
      </div>
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
