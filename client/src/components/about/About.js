import React, { Component } from "react";
import { connect } from "react-redux";
import { system } from "../../actions/authActions";
class About extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: []
    };
    system().then(systemData => {
         console.log(systemData);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    const user = (this.props.auth.isAuthenticated )? this.props.auth.user.name:" [anonymous]";
    console.log(`About log: ${user}; auth: ${JSON.stringify(this.props.auth)}`);
    return (
      <div className="main">
          <div className="landing-copy ">
            <h4>  Hey, 
              <small>{user}</small>
            </h4>
            <div>
              Welcome to BeMyGuest community!
              <br />
              If you have food &ndash; invite guests,
              <br />
              if you are hungry &ndash; find a host!
            </div>
          </div>
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
)(About);
