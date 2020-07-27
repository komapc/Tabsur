import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
class ChatUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meal: props.meal
    };
  }

 
  render() {
  return <span>
    chat with a user 
  </span>
};
 
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
)(withRouter(ChatUser));