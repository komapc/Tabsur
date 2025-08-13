
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
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      <Paper elevation={3} style={{ borderColor: "black" }}>
        <div
          style={{
            padding: "10%",
            width: `90vw`,
          }}
        >
          <Grid item xs={12}>
            Don't have an account? <Link to="/register">Register</Link>
          </Grid>
        </div>
        <form noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                label={"Email"}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography className="red-text">
                {errors.email}
                {errors.emailnotfound}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                color="secondary"
                label={"Password"}
                onChange={onChange}
                value={password}
                error={!!(errors.password || errors.passwordincorrect)}
                id="password"
                type="password"
                className={classnames("", {
                  invalid: errors.password || errors.passwordincorrect,
                })}
                style={{ width: "100%", marginTop: "10%" }}
              />
              <span className="red-text">
                {errors.password}
                {errors.passwordincorrect}
              </span>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                style={{ width: "100%", marginTop: "10%" }}
              >
                Login
              </Button>
            </Grid>
            {extend ? (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => googleLogin()}
                >
                  Sign in with Google 🚀
                </Button>
              </Grid>
            ) : null}
            {errors.googleLogin && (
              <Grid item xs={12}>
                <Typography color="error">{errors.googleLogin}</Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Grid>
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
