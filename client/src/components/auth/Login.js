
import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Link, useHistory, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, loginUserFB } from "../../actions/authActions";
import classnames from "classnames";
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const { extend } = useParams();

  useEffect(() => {
    if (props.auth.isAuthenticated) {
      history.push("/");
    }

    if (props.errors) {
      setErrors(props.errors);
    }
  }, [props.auth.isAuthenticated, props.errors, history]);

  const onChange = (e) => {
    const { id, value } = e.target;
    if (id === "email") {
      setEmail(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    props.loginUser(userData);
  };

  // Use the useGoogleLogin hook
  const googleLogin = useGoogleLogin({
    clientId: process.env.REACT_APP_GOOGLE_API_KEY,
    onSuccess: credentialResponse => {
      console.log(credentialResponse);
      // Send credentialResponse to your server
      // You'll likely want to extract user info from credentialResponse
      // and call your loginUserFB action here
      // Example:
      // const userData = {
      //   email: extractedEmail,
      //   name: extractedName,
      //   picture: extractedPicture
      // };
      // props.loginUserFB(userData);
    },
    onError: (error) => {
      console.log('Google Login Failed', error);
      setErrors({ ...errors, googleLogin: "Google login failed" });
    },
  });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <Paper elevation={3} style={{
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #ddd'
      }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        
        <form noValidate onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <TextField
              variant="standard"
              color="secondary"
              onChange={onChange}
              value={email}
              error={!!(errors.email || errors.emailnotfound)}
              id="email"
              type="email"
              className={classnames("", {
                invalid: errors.email || errors.emailnotfound,
              })}
              label="Email"
              fullWidth
            />
            {(errors.email || errors.emailnotfound) && (
              <Typography className="red-text" style={{ fontSize: '12px', marginTop: '5px' }}>
                {errors.email || errors.emailnotfound}
              </Typography>
            )}
          </div>
          
          <div>
            <TextField
              variant="standard"
              color="secondary"
              label="Password"
              onChange={onChange}
              value={password}
              error={!!(errors.password || errors.passwordincorrect)}
              id="password"
              type="password"
              className={classnames("", {
                invalid: errors.password || errors.passwordincorrect,
              })}
              fullWidth
            />
            {(errors.password || errors.passwordincorrect) && (
              <Typography className="red-text" style={{ fontSize: '12px', marginTop: '5px' }}>
                {errors.password || errors.passwordincorrect}
              </Typography>
            )}
          </div>
          
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            style={{ marginTop: '10px' }}
          >
            Login
          </Button>
          
          {extend && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => googleLogin()}
              style={{ marginTop: '10px' }}
            >
              Sign in with Google 🚀
            </Button>
          )}
          
          {errors.googleLogin && (
            <Typography color="error" style={{ fontSize: '12px', textAlign: 'center' }}>
              {errors.googleLogin}
            </Typography>
          )}
        </form>
      </Paper>
    </div>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser, loginUserFB })(Login);
