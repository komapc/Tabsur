import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getChatUsers } from "../../actions/chatActions";
import ChatListItem from "./ChatListItem";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import loadingGIF from "../../resources/animation/loading.gif";

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
    
    this.setState({notificationsCount:this.props.notificationsCount});
  }

  componentDidMount() {
    getChatUsers(this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ users: res.data, loading: false });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  showList = () => {
    if (this.state.users.length === 0) {
      return <div>No messages yet</div>
    }
    return <div className="map-meal-info" style={{ width: '100%' }}>
      {
        this.state.users.map(user => {
          const sender = user.sender;
          const receiver = user.receiver;
          const partner = this.props.auth.user.id !== sender ? sender : receiver;
          return <div key={user.id}>
            <ChatListItem user={user} partner={partner} />
          </div>
        }
        )}
    </div>
  }
  render() {
    
    console.log(`notifications count: ${this.props.notificationsCount}`);
    return (
      <div className="main">
        <AppBar position="sticky">
          <Toolbar> CHAT
            {/* CHAT ({this.state.notificationsCount}) */}
          </Toolbar>
        </AppBar>
        {
          this.state.loading ?
            <img src={loadingGIF} alt="loading" /> : this.showList()
        }
      </div>
    );
  }}

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