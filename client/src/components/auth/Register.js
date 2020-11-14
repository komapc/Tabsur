import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
    const formMinWidth = window.innerWidth < 500 ? window.innerWidth : 500;
    return (
      <div className="main">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item style={{ minWidth: `${formMinWidth}px` }}>
            <div className="row">
              <div >
                <div>
                  Already registered? <Link to="/login">Log in</Link>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                  <div>
                    <TextField
                      variant="outlined"
                      onChange={this.onChange}
                      value={this.state.name}
                      error={errors.name}
                      id="name"
                      type="text"
                      className={classnames("", {
                        invalid: errors.name
                      })}
                      style={{ width: '100%', margin: '1vh' }}
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
                      style={{ width: '100%', margin: '1vh' }}
                      label={'Email'}
                    />
                    <span className="red-text">{errors.email}</span>
                  </div>
                  <div>
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
                      style={{ width: '100%', margin: '1vh' }}
                      label={'Password'}
                    />
                    <span className="red-text">{errors.password}</span>
                  </div>
                  <div>
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
                      style={{ width: '100%', margin: '1vh' }}
                      label={'Confirm Password'}
                    />
                    <span className="red-text">{errors.password2}</span>
                  </div>
                  <div>
                    <Button type="submit" style={{ width: '100%', margin: '1vh' }} variant="contained" color="primary">
                      Sign up
                </Button>
                  </div>
                </form>
              </div>
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
