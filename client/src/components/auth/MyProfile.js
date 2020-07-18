import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

import tmpBgImg from "../../resources/images/susi.jpeg";
import tmpAvatarImg from "../../resources/images/ava.jpeg";

//#region Header
//#region Avatar
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    "margin-top": 190
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  large: {
    width: theme.spacing(17),
    height: theme.spacing(17),
    borderWidth: theme.spacing(1), 
    borderColor: 'white', 
    borderStyle:'solid'
  }
}));

function MrAvatar() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Avatar alt="Aristotle" src={tmpAvatarImg} className={classes.large} />
    </div>
  );
}
//#endregion

const useStyles3 = makeStyles(theme => ({
  marginAutoContainer: {
    width: 500,
    height: 80,
    display: 'flex',
    backgroundColor: 'gold',
  },
  marginAutoItem: {
    margin: 'auto'
  },
  alignItemsAndJustifyContent: {
    width: "100%",
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray', // TODO: Ask Yana about background color

    backgroundImage: `url(${tmpBgImg})`,
    backgroundSize: 'cover'
  },
  empty: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: 'red'  
  }
}))
const Header = () => {
  const classes = useStyles3()
  return (
    <React.Fragment>
      <div className={classes.alignItemsAndJustifyContent}>
        <MrAvatar />
      </div>
      <div className={classes.empty}></div>
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
      <div>
        <Header />

        <div className="row">
          <div className="col s8 offset-s2">

          <form noValidate onSubmit={this.onSubmit} display="none">
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
        </div>
      </div>
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
