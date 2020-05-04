import React, { Component } from "react";
import { connect } from "react-redux";

class NotificationsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meals: []
    };
  }

  render() {
    const { user } = this.props.auth;
    
    return (
      <div className="container valign-wrapper main">
        <div className="row">
          <div className="landing-copy ">
            <h4>
              Hey {user.name}
            </h4>
          </div>
          <div>
          Your notifications (request approves, reminder etc.) will be here.
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
 
});

export default connect(
  mapStateToProps,
)(NotificationsScreen);