import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
import { getChatMessages } from "../../actions/chatActions";
import { sendMessage } from "../../actions/notifications"

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import backButton from "../../resources/back_button.svg";
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const ChatLine = (props) =>
{
  return <div>
    {props.message.name1}: <b>{props.message.message_text}</b>
  </div>
}
class ChatUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      messages: [],
      partner_id: this.props.match.params.id,
      typedMessage:""
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
  componentDidMount() {

  };
  sendMessageWithCallback(sender, receiver) {
    sendMessage(sender, receiver, this.state.typedMessage)
      .then(res => { // Callback
        console.log(JSON.stringify(res));
      });
      this.setState({ typedMessage: "" });
  }
  onChange = value=>
  {
    this.setState({ typedMessage: value.value }) 
  }
  render() {
    return <>
    <Box style={{height:"80vh"}}>
      <AppBar position="sticky">
        <Toolbar>
          <img width="20px"
            alt="back"
            onClick={this.props.history.goBack}
            src={backButton}
          />Chat with {this.state.messages.name2}</Toolbar>
      </AppBar>

      {this.state.messages.map(message =>
          <div key={message.id}>
           <ChatLine message={message}></ChatLine>
          </div>
        )} 
      </Box>
      <Box style={{bottom:"0px", position:"sticky"}}>

        <TextField
          variant="outlined"  
          label={'message'}
          placeholder="Message"
          on
          onChange={this.onChange}
          id="message"
          value={this.state.typedMessage}
          />
        <Button onClick={() => this.sendMessageWithCallback(
            this.props.auth.user.id,
            this.state.id
        )}>Send</Button>
     </Box>
    </>
  };

}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
)(withRouter(ChatUser));