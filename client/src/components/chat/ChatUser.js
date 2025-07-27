import { withRouter, useHistory } from "react-router-dom";
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { getChatMessages } from "../../actions/chatActions";
import { sendMessage } from "../../actions/notifications"

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BackBarMui from "../layout/BackBarMui";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';

const ChatLine = (props) => {
  return <Typography>
    {props.message.name2}: <b>{props.message.message_text}</b>
  </Typography>
}

const ChatUser = (props) => {

  const sendMessageWithCallback = (sender, myName, receiver, typedMessage) => {
    //update local state
    if (typedMessage.trim() === '')
      return;
    const newItem = { name2: myName, name1: receiver, message_text: typedMessage };
    setMessages([...messages, newItem]);

    //send to server
    sendMessage(sender, receiver, typedMessage)
      .then(res => { // Callback
        console.log(`sendMessage: ${JSON.stringify(res)}`);
      })
      .catch(err => {
        console.error(err);
      });
    setTypedMessage("");
  }
  const onChange = event => {
    setTypedMessage(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessageWithCallback(
        props.auth.user.id,
        props.auth.user.name,
        partner_id,
        typedMessage
      )
    }
  };

  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const partner_id = props.match.params.id;
  console.log(`partner: ${partner_id}`);

  const messageRef = useRef();
  useEffect(() => {
    if (!props.auth.isAuthenticated) {
      return;
    }
    getChatMessages(props.auth.user.id, partner_id)
      .then(res => {
        console.log(res.data);
        setMessages(res.data);

        if (messageRef.current) {
          messageRef.current.scrollIntoView(
            {
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest'
            })
        }
      })
      .catch(error => {
        console.error(error);
      })

  }, [props, partner_id]);

  useEffect(() => {


    if (messageRef.current) {

      console.log("useEffects, before scroll");
      messageRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }

  }, [messages]);
  const history = useHistory();
  return <>
    <AppBar position="sticky">
      <Toolbar>
        <BackBarMui history={history} />
    Chat with {messages.name2}</Toolbar>
    </AppBar>
    <Box style={{ height: "calc(100vh - 140px)", overflowY: "scroll" }}  >
      <div ref={messageRef}>
        {messages.map(message =>
          <ChatLine key={uuidv4()} message={message} />
        )}
      </div>
    </Box>
    <Box style={{ bottom: "10px", left: "40px", position: "fixed" }}>

      <TextField
        onKeyPress={handleKeyPress}
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
};

const mapStateToProps = state => ({
  auth: state.auth,
  notificationsCount: state.notificationsCount
});

export default connect(
  mapStateToProps,
)(withRouter(ChatUser));