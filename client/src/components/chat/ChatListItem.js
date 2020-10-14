import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
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
      pathname: `/ChatUser/${this.props.partner}`
    });
  }
  render() {
    const name = this.state.user.name1 === this.props.auth.user.name ? this.state.user.name2 : this.state.user.name1;
    return (
      <CardHeader
        onClick={this.handleClick}
        avatar={
          <Avatar aria-label="recipe" style={{ backgroundColor: '#13A049' }}>
            {name[0].toUpperCase()}
          </Avatar>
        }
        title={<span style={{ fontWeight: 900 }}>
          {name}
        </span>}
        subheader={this.state.user.message_text}
      />
    )
  };
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withRouter(ChatListItem));