import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import React, { Component } from "react";
class ChatListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      auth: this.props.auth
    };
  }

  render() {

    return (
      <div >
        <span>
            <span> {this.state.user.id}</span> said:
            <span> {this.state.user.message_text}</span>
        </span>
        
      </div>
    )
  };
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withRouter(ChatListItem));