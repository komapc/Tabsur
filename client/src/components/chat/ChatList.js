import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getChatUsers } from '../../actions/chatActions';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Box,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { withRouter } from "react-router-dom";
import loadingGIF from "../../resources/animation/loading.gif";

const TheList = (props) => {
  // Sanity tests
  console.log(`TheList - users:`, props.users);
  console.log(`TheList - myId:`, props.myId);

  if (!props.users || props.users.length === 0) {
    return <Typography>No messages yet</Typography>
  }
  
  try {
    return props.users.sort((a, b) => a.created_at < b.created_at ? 1 : -1)
      .map(user => {
        const sender = user.sender;
        const receiver = user.receiver;
        const partner = props.myId !== sender ? sender : receiver;
        return <Fragment key={user.id || Math.random()}>
          <div style={{padding: '8px', borderBottom: '1px solid #eee'}}>
            Chat with User {partner} - {user.created_at}
          </div>
        </Fragment>
      })
  } catch (error) {
    console.error('TheList render error:', error);
    return <Typography>Error loading chat list</Typography>;
  }
}
class ChatList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      notificationsCount: 0
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.active !== this.props.active && this.props.active) {
      this.props.setFabVisibility(false);
      this.props.setSwipability(true);
    }

    if (prevProps.notificationsCount !== this.props.notificationsCount) {
      this.setState({ notificationsCount: this.props.notificationsCount });
    }

    // Reload chat users if user ID changes (e.g., after login)
    if (prevProps.auth?.user?.id !== this.props.auth?.user?.id && this.props.auth?.user?.id) {
      this.loadChatUsers();
    }
  }

  componentDidMount() {
    if (this.props.auth?.user?.id) {
      this.loadChatUsers();
    }
  }

  loadChatUsers = () => {
    if (!this.props.auth?.user?.id) {
      console.log('ChatList: No user ID available');
      this.setState({ loading: false });
      return;
    }

    getChatUsers(this.props.auth.user.id)
      .then(res => {
        console.log('Chat users loaded:', res.data);
        this.setState({ users: res.data, loading: false });
      })
      .catch((err) => {
        console.error('Failed to load chat users:', err);
        this.setState({ loading: false, users: [] });
      });
  };

  render() {
    // Sanity tests
    console.log(`ChatList render - notifications count: ${this.props.notificationsCount}`);
    console.log(`ChatList render - loading: ${this.state.loading}`);
    console.log(`ChatList render - authenticated: ${this.props.auth?.isAuthenticated}`);
    console.log(`ChatList render - users count: ${this.state.users?.length}`);

    try {
      return <Fragment>
        <AppBar position="sticky">
          <Toolbar> CHAT
              {/* CHAT ({this.state.notificationsCount}) */}
          </Toolbar>
        </AppBar>
        {
          this.state.loading ?
            <img src={loadingGIF} alt="loading" /> :
            (this.props.auth?.isAuthenticated)?
              <TheList users={this.state.users || []} myId={this.props.auth.user?.id} />
              :<Typography>Please log in to view messages</Typography>
        }
      </Fragment>
    } catch (error) {
      console.error('ChatList render error:', error);
      return <div>Chat temporarily unavailable</div>;
    }
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
