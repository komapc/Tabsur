import { Toolbar, Grid, Button } from "@mui/material";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, loginUserFB, logoutUser } from "../../actions/authActions";
import { TextField } from "@mui/material";
//import FacebookLoginWithButton from 'react-facebook-login';
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
      <Toolbar>
        <BackBarMui history={history} />
        Settings</Toolbar>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <div>
          <TextField
            variant="outlined"
            onChange={onEmailChange}
            value={email}
            id="email"
            type="email"
            
            label={'Email'}
            style={{ width: '100%', marginTop: '1vh' }}
          />
         </div>

        <Button variant="outlined" onClick={handleLogout}>
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
