import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Avatar from "../layout/Avatar";
import CardHeader from "@mui/material/CardHeader";

class ChatListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Initialize state directly from props in the constructor
      user: this.props.user || {}, // Provide a default empty object
      auth: this.props.auth || {} // Provide a default empty object
    };
  }

  handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.history.push({
      pathname: `/ChatUser/${this.props.partner}`
    });
  };

  render() {
    const { user, auth } = this.state;
    const name = user.name1 === auth.user.name ? user.name2 : user.name1;
    const partnerId = user.receiver === auth.user.id ? user.sender : user.receiver;

    return (
      <CardHeader
        onClick={this.handleClick}
        avatar={<Avatar class="default" user={{ name: name, id: partnerId }} />}
        title={<span style={{ fontWeight: 900 }}>{name}</span>}
        subheader={user.message_text}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(ChatListItem)); 
