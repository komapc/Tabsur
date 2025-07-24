import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them back to the meals list.
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    console.trace(this.state.errors);
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      location: '0,0',
      address: '_'
    };

    this.props.registerUser(newUser, this.props.history);
    console.trace(`newUser: ${JSON.stringify(newUser)}`);
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="main">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '90vh' }}
        >
          <Grid item>
            <div className="row">
              <>
                <>
                  Already registered? <Link to="/login">Log in</Link>
                </>
                <form noValidate onSubmit={this.onSubmit}>
                  <div>
                    <TextField
                      variant="outlined"
                      onChange={this.onChange}
                      value={this.state.name}
                      error={!!errors.name}
                      id="name"
                      type="text"
                      className={classnames("", {
                        invalid: errors.name
                      })}
                      style={{ width: '80vw', margin: '3vh' }}
                      label={'Name'}
                    />
                    <span className="red-text">{errors.name}</span>
                  </div>
                  <div>
                    <TextField
                      variant="outlined"
                      onChange={this.onChange}
                      value={this.state.email}
                      error={errors.email}
                      id="email"
                      type="email"
                      className={classnames("", {
                        invalid: errors.email
                      })}
                      style={{ width: '80vw', margin: '3vh' }}
                      label={'Email'}
                    />
                    <span className="red-text">{errors.email}</span>
                  </div>
                  <>
                    <TextField
                      variant="outlined"
                      onChange={this.onChange}
                      value={this.state.password}
                      error={errors.password}
                      id="password"
                      type="password"
                      className={classnames("", {
                        invalid: errors.password
                      })}
                      style={{ width: '80vw', margin: '3vh' }}
                      label={'Password'}
                    />
                    <span className="red-text">{errors.password}</span>
                  </>
                  <>
                    <TextField
                      variant="outlined"
                      onChange={this.onChange}
                      value={this.state.password2}
                      error={errors.password2}
                      id="password2"
                      type="password"
                      className={classnames("", {
                        invalid: errors.password2
                      })}
                      style={{ width: '80vw', margin: '3vh' }}
                      label={'Confirm Password'}
                    />
                    <span className="red-text">{errors.password2}</span>
                  </>
                  <Button type="submit"
                    style={{ width: '80vw', margin: '3vh' }} variant="contained" color="primary">
                    Sign up
                </Button>
                </form>
              </>
            </div>
          </Grid>
        </Grid>

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
  { registerUser }
)(withRouter(Register));
