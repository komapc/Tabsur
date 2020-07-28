import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
import { getChatUsers } from "../../actions/chatActions";
class ChatUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user
    };
  }

 
  render() {
  return <span>
    chat with a user 

    <div>
          {
            this.props.auth.user.id !== this.state.id ?
              <div>
                <input type="text" id="message" placeholder="Message"></input>
                <button onClick={() => this.sendMessageWithCallback(
                  this.props.auth.user.id,
                  this.state.id,
                  document.getElementById("message").value
                )}>Send</button>
              </div> :
              <div></div>
          }
        </div>
  </span>
};
 
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
)(withRouter(ChatUser));