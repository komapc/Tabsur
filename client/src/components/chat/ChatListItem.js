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

  handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.history.push({
      pathname: `/ChatUser/${this.props.user.id}`
    });
  }
  render() {

    return (
      <div onClick={this.handleClick}>
            <span > 
            <b>{this.state.user.name1}</b></span> said to <b>{this.state.user.name2}</b>
            <span> {this.state.user.message_text}</span>
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