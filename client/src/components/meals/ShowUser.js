import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from 'axios';
import config from "../../config";

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
    this.getUserInfo();
    this.getFollowStatus();
  }

  getFollowStatus() {
    const myUserId = this.props.auth.user.id;
    const thisUserId = this.state.id;  
    axios.get(`${config.SERVER_HOST}/api/follow/${thisUserId}`)
      .then(res => {
        console.log('getFollowStatus: ' + JSON.stringify(res.data));
        const followers = res.data;
        const found = followers.find(element => element.follower===myUserId);
        const followStatus = found?found.status:0;
        this.setState({ followStatus: followStatus });
        console.log(res.data);
      })
      .catch(err => {
        this.setState({followStatus:-1});
        console.log(err);
      });
  }

  follow(new_status) {
    const myUserId = this.props.auth.user.id;
    const thisUserId = this.state.id; 
    const body = { followie: thisUserId, status: new_status };
    axios.post(`${config.SERVER_HOST}/api/follow/${myUserId}`, body)
      .then(res => {
        console.log(res.data);
        //change in DB, than change state
        this.setState({followStatus:new_status});
      })
      .catch(err => {
        this.setState({followStatus:-1});
        console.log(err);
      });
  }

  getUserInfo() {
    axios.get(`${config.SERVER_HOST}/api/users/${this.state.id}`)
      .then(res => {
        console.log(res.data);
        this.setState({ user: res.data[0] });
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="main">
        <div>Info about user <span className="meal-name">{this.state.user.name}</span></div>
        <div>Meals created: {this.state.user.meals_created}</div>
        <div>Rate {this.state.user.rate}/100</div>
        <div>You follow him? {this.state.followStatus}</div>
        {this.state.followStatus?
        <button onClick={()=>this.follow(0)}>UnFollow</button>:
        <button onClick={()=>this.follow(3)}>Follow</button>}
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
