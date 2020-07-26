import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import Avatar from "../layout/Avatar"

import tmpBgImg from "../../resources/images/susi.jpeg";
import { makeStyles } from '@material-ui/core/styles';

//#region MyProfileHeader TODO: Wrap into file; choose directory place file
const useStylesHeader = makeStyles(theme => ({
  alignItemsAndJustifyContent: {
    width: "100%",
    height: theme.spacing(25),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray', // TODO: Ask Yana about background color
    backgroundImage: `url(${tmpBgImg})`,
    backgroundSize: 'cover'
  },
  empty: {
    height: 64
  }
}))
const MyProfileHeader = () => {
  const classes = useStylesHeader()
  return (
    <React.Fragment>
      <div className={classes.alignItemsAndJustifyContent}>
        <Avatar />
      </div>
      <div className={classes.empty}></div>
    </React.Fragment>
  )
}
//#endregion

//#region MyProfileStats TODO: wrap it somewhere
const useStylesStats = makeStyles(theme => ({
  alignItemsAndJustifyContent: {  // TODO: Rename
    width: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    color: "green",
    fontSize: 32,
    fontWeight: "fontWeightBold",
    fontStyle: "italic",
    fontFamily: "Monospace"
  }
}))
const MyProfileStats = ({name: Name}) => {
  const classes = useStylesStats()
  return (
    <React.Fragment>
      <div className={classes.alignItemsAndJustifyContent}>
        {Name}
      </div>
    </React.Fragment>
  )
}
//#endregion

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.auth.user.name,
      email:  this.props.auth.user.email,
      address: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
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

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      address: this.state.address,
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <React.Fragment>
        <MyProfileHeader />
        <MyProfileStats name={this.state.name}/>

        {false ? (
        <div className="row">
          <div className="col s8 offset-s2">
            <form noValidate onSubmit={this.onSubmit} display="none" disabled={true}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <label htmlFor="name">Name</label>
                <span className="red-text">{errors.name}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">{errors.email}</span>
              </div>

              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.address}
                  error={errors.address}
                  id="address"
                  type="address"
                  className={classnames("", {
                    invalid: errors.address
                  })}
                />
                <label htmlFor="address">Address</label>
                <span className="red-text">{errors.address}</span>
              </div>
              <div>
              More params to come: cousine, images, visit history and more.
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  type="submit"
                  className="button waves-effect waves-light hoverable accent-3" >
                  Save
                </button>
              </div>
            </form>
        </div>
        </div>) : ""}
      </React.Fragment>
    );
  }
}

MyProfile.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(MyProfile));
