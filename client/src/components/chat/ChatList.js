import React, { Component } from "react";
import { connect } from "react-redux";
import { getChatUsers } from "../../actions/chatActions";
import ChatListItem from "./ChatListItem";

import loadingGIF from "../../resources/animation/loading.gif";
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
    if (nextProps.active)
    { 
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
  render() {
    return (
      <div className="main">
        CHAT
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
)(ChatList);
