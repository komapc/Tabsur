import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import backButton from "../../resources/back_button.svg";
import defaultImage from "../../resources/userpic_empty.svg";

import {getFollowStatus, setFollow, getUserInfo} from "../../actions/userActions"
import { sendMessage } from "../../actions/notifications"
class ShowUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      user: {},
      followStatus: 0,
      ...props
    };
  }

  componentDidMount() {
    this.getUserInfoEvent();
    this.getFollowStatusEvent();
  }

  getFollowStatusEvent() {
    const myUserId = this.props.auth.user.id;
    const thisUserId = this.state.id;
    getFollowStatus(thisUserId)
      .then(res => {
        console.log(`getFollowStatus: ${JSON.stringify(res.data)}`);
        const followers = res.data;
        const found = followers.find(element => element.follower === myUserId);
        const followStatus = found ? found.status : 0;
        this.setState({ followStatus: followStatus });
        console.log(res.data);
      })
      .catch(err => {
        this.setState({ followStatus: -1 });
        console.log(err);
      });
  }

  follow(new_status) {
    const myUserId = this.props.auth.user.id;
    const thisUserId = this.state.id;
    const body = { followie: thisUserId, status: new_status };
    setFollow(myUserId, body)
      .then(res => {
        console.log(res.data);
        //change in DB, than change state
        this.setState({ followStatus: new_status });
      })
      .catch(err => {
        this.setState({ followStatus: -1 });
        console.log(err);
      });
  }

  getUserInfoEvent() {
    getUserInfo(this.state.id)
      .then(res => {
        console.log(res.data);
        this.setState({ user: res.data[0] });
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  sendMessageWithCallback(sender, receiver, message) {
    sendMessage(sender, receiver, message)
    .then(res => { // Callback
      console.log(JSON.stringify(res));
    });
  }

  render() {
    return (
      <div className="info-all">
        <div className="info-back-div"><img
         className="info-back"
          alt="back"
          onClick={this.props.history.goBack}
          src={backButton}
        />
        <span className="info-caption">profile</span>
        </div>
        <div className="info-top">
          <img className="info-main-image" src={defaultImage} alt="user"/>
          <span className="info-main-name">{this.state.user.name}</span>
        </div>
        <div className="info-fields">
        <div className="row">
          <div className="info-column">Meals created
          </div>
          <div className="info-column">
          {this.state.user.meals_created}
          </div>
      </div>
          <div>You follow him?</div>
          {this.state.followStatus ?
            <button onClick={() => this.follow(0)}>UnFollow</button> :
            <button onClick={() => this.follow(3)}>Follow</button>}
        </div>
        <div>
          {
            this.props.auth.user.id != this.state.id ?
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
      </div>
    );
  }
}


const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withRouter(ShowUser));
