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

  handleuserClick = (event, id) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.history.push({
      pathname: `/ChatUser/{id}`
    });
  }
  render() {

    return (
      <div >
        <span>
            <span onClick={this.handleuserClick}> {this.state.user.id}</span> said:
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