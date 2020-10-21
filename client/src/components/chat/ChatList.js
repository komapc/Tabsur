import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getChatUsers } from "../../actions/chatActions";
import ChatListItem from "./ChatListItem";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import loadingGIF from "../../resources/animation/loading.gif";
import Typography from '@material-ui/core/Typography';

const TheList = (props) =>
{
    if (props.users.length === 0) {
      return <Typography>No messages yet</Typography>
    }
    return props.users.sort((a, b) => a.created_at < b.created_at ? 1 : -1)
    .map(user => {
      const sender = user.sender;
      const receiver = user.receiver;
      const partner = props.myId !== sender ? sender : receiver;
      return <Fragment key={user.id}>
        <ChatListItem user={user} partner={partner} />
      </Fragment>
    }
    )
}
class ChatList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: [],
      loading: true,
      id: this.props.auth.user.id || -1,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.props.setFabVisibility(false);
      this.props.setSwipability(true);
    }

    this.setState({ notificationsCount: this.props.notificationsCount });
  }

  componentDidMount() {
    getChatUsers(this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ users: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({loading: false });
        console.error(err);
      });
  };

  render() {

    console.log(`notifications count: ${this.props.notificationsCount}`);
    return <Fragment>
        <AppBar position="sticky">
          <Toolbar> CHAT
            {/* CHAT ({this.state.notificationsCount}) */}
          </Toolbar>
        </AppBar>
        {
          this.state.loading ?
            <img src={loadingGIF} alt="loading" /> : 
            <TheList users={this.state.users} myId={this.props.auth.user.id}/>
        }
      </Fragment>
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  notificationsCount: state.notificationsCount

});
const mapDispatchToProps = (dispatch) => ({
  getChatUsers: (form, history) => getChatUsers(form, history)(dispatch)
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(withRouter(ChatList));