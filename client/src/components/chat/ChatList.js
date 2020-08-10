import React, { Component } from "react";
import { Router, Route, IndexRoute } from 'react-router';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getChatUsers } from "../../actions/chatActions";
import ChatListItem from "./ChatListItem";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import loadingGIF from "../../resources/animation/loading.gif";
import backButton from "../../resources/back_button.svg";

class ChatList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: [],
      loading: true,
      id: this.props.auth.user.id || -1
    };
  } 
  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.props.setFabVisibility(true);
      this.props.setSwipability(true);
    }
  }

  componentDidMount() {
    getChatUsers(this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ users: res.data, loading: false });
      })
  };

  render() {;

    return (
      <div className="main">
        <img
          className="info-back"
          alt="back"
          onClick={this.props.history.goBack}
          src={backButton}
        />
          <AppBar position="sticky">
        <Toolbar>CHAT</Toolbar>
      </AppBar>
        <div className="row">
          {
            this.state.loading ?
              <img src={loadingGIF} alt="loading" /> :
              <div className="map-meal-info">
                {this.state.users.map(user =>
                  <div key={user.id}>
                    <ChatListItem user={user} />
                  </div>
                )}
              </div>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,

});
const mapDispatchToProps = (dispatch) => ({
  getChatUsers: (form, history) => getChatUsers(form, history)(dispatch)
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(withRouter(ChatList));
