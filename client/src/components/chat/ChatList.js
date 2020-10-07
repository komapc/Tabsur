import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getChatUsers } from "../../actions/chatActions";
import ChatListItem from "./ChatListItem";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import loadingGIF from "../../resources/animation/loading.gif";


const showList = (props) => {
  if (props.users.length === 0) {
    return <div>No messages yet</div>
  }
  return <div className="map-meal-info" style={{ width: '100%' }}>
    {
      props.users.map(user => {
        const sender = user.sender;
        const receiver = user.receiver;
        const patner = props.auth.user.id !== sender ? sender : receiver;
        return <div key={user.id}>
          <ChatListItem user={user} partner={patner} />
        </div>
      }
      )}
  </div>
}

const ChatList = (props) => {
  const id = props.auth.user.id || -1;
  const [notificationsCount, setNotificationsCount] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log(`ChatList props: ${JSON.stringify(props)}.`);
    console.log(`ChatList effect: ${props.active}.`);
    if (props.active) {
      props.setFabVisibility(false);
      props.setSwipability(true);
    }

    //setNotificationsCount(props.notificationsCount);
    setNotificationsCount(0);
    getChatUsers(id)
      .then(res => {
        console.log(`getChatUsers result: ${JSON.stringify(res.data)}`);
        setUsers(res.data);
        setLoading(false);      
      })
      .catch(err => {
        console.error(err);
      });

  }, [props]);

  console.log(`notifications count: ${props.notificationsCount}`);
  return (
    <div className="main">
      <AppBar position="sticky">
        <Toolbar>
          CHAT ({notificationsCount})
      </Toolbar>
      </AppBar>
      {
        loading ?
          <img src={loadingGIF} alt="loading" /> : showList({users:users, auth:props.auth})
      }
    </div>
  )
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
