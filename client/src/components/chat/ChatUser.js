import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
import { getChatMessages } from "../../actions/chatActions";
import { sendMessage } from "../../actions/notifications"

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import BackButton from "../layout/BackButton";
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const ChatLine = (props) => {
  return <div>
    {props.message.name2}: <b>{props.message.message_text}</b>
  </div>
}
class ChatUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      messages: [],
      partner_id: this.props.match.params.id,
      typedMessage: ""
    };
    console.log(`partner: ${this.state.partner_id}`);
    getChatMessages(this.props.auth.user.id, this.state.partner_id)
      .then(res => {
        console.log(res.data);
        this.setState({ messages: res.data, loading: false });
      })
      .catch(error => {
        console.error(error);
      })
  }
  
  sendMessageWithCallback(sender, myName, receiver) {
    //update local state
    const newItem = {name2: myName, name1:receiver, message_text: this.state.typedMessage};
    this.setState({ messages: [...this.state.messages, newItem] });
    //send to server
    sendMessage(sender, receiver, this.state.typedMessage)
      .then(res => { // Callback
        console.log(JSON.stringify(res));
      })
      .catch(err => {
        console.error(err);
      });
    this.setState({ typedMessage: "" });
  }
  onChange = event => {
    this.setState({ typedMessage: event.target.value });
  }
  render() {
    return <>
      <Box style={{ height: "85vh", overflowY:"scroll" }}>
        <AppBar position="sticky">
          <Toolbar>
            <BackButton />
          Chat with {this.state.messages.name2}</Toolbar>
        </AppBar>

        {this.state.messages.map(message =>
          <div key={message.id}>
            <ChatLine message={message}></ChatLine>
          </div>
        )}
      </Box>
      <Box style={{ top: "85vh", position: "sticky" }}>

        <TextField
          variant="outlined"
          label={'message'}
          placeholder="Message"
          onChange={this.onChange}
          id="message"
          value={this.state.typedMessage}
          inputProps={{
            autoComplete: 'off'
          }}
        />
        <Button variant="contained" 
          type="submit"
          onClick={() => this.sendMessageWithCallback(
          this.props.auth.user.id,
          this.props.auth.user.name,
          this.state.partner_id
        )}>Send</Button>
      </Box>
    </>
  };
}

const mapStateToProps = state => ({
  auth: state.auth,
  notificationsCount: state.notificationsCount
});

export default connect(
  mapStateToProps,
)(withRouter(ChatUser));