import { withRouter } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { getChatMessages } from "../../actions/chatActions";
import { sendMessage } from "../../actions/notifications"

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import BackButton from "../layout/BackButton";
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
const uuidv1 = require('uuid/v1');

const ChatLine = (props) => {
  return <div>
    {props.message.name2}: <b>{props.message.message_text}</b>
  </div>
}


const ChatUser = (props) => {
  const sendMessageWithCallback = (sender, myName, receiver, typedMessage) => {
    //update local state
    const newItem = { name2: myName, name1: receiver, message_text: typedMessage };
    setMessages([...messages, newItem]);
    //send to server
    sendMessage(sender, receiver, typedMessage)
      .then(res => { // Callback
        console.log(JSON.stringify(res));
      })
      .catch(err => {
        console.error(err);
      });
     setTypedMessage("");
  }
  const onChange = event => {
    setTypedMessage(event.target.value);
  }
  
  const [typedMessage, setTypedMessage] =  useState("");
  const [messages, setMessages] = useState([]);

  const partner_id = props.match.params.id;
  console.log(`partner: ${partner_id}`);
  
  useEffect(() => {
  getChatMessages(props.auth.user.id, partner_id)
    .then(res => {
      console.log(res.data);
        setMessages(res.data);
    })
    .catch(error => {
      console.error(error);
    })
  },[props]);

  return <>
    <Box style={{ height: "85vh", overflowY: "scroll" }}>
      <AppBar position="sticky">
        <Toolbar>
          <BackButton />
          Chat with {messages.name2}</Toolbar>
      </AppBar>

      {messages.map(message =>
        <div key={uuidv1()}>
          <ChatLine message={message}></ChatLine>
        </div>
      )}
    </Box>
    <Box style={{ top: "85vh", position: "sticky" }}>

      <TextField
        variant="outlined"
        label={'message'}
        placeholder="Message"
        onChange={onChange}
        id="message"
        value={typedMessage}
        inputProps={{
          autoComplete: 'off'
        }}
      />
      <Button variant="contained"
        type="submit"
        onClick={() => sendMessageWithCallback(
          props.auth.user.id,
          props.auth.user.name,
          partner_id,
          typedMessage
        )}>Send</Button>
    </Box>
  </>
}
const mapStateToProps = state => ({
  auth: state.auth,
  notificationsCount: state.notificationsCount
});

export default connect(
  mapStateToProps,
)(withRouter(ChatUser));