import React, { Component } from "react";
import config from "../../config";
import { connect } from "react-redux";
import axios from 'axios';
import menu from "../../resources/menu.svg" 
class Notifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      onItemClicked:this.props.onItemClicked,
      notes: []
    };
  }

  getNotifications = () =>
  {
    axios.get(`${config.SERVER_HOST}/api/notifications/get/` + this.props.auth.user.id)
    .then(res => {
      console.log(res.data);
      this.setState({ notes: res.data });
    }).catch(err =>{
      console.log(err);
    }); 
  }

  markAsRead = (id, status) =>
  {
    const note = {
      status: status
    };

    axios.put(`${config.SERVER_HOST}/api/notifications/` + id, note)
    .then(res => {
      console.log(res.data);
      this.setState({ notes: res.data });
    }).catch(err =>{
      console.log(err);
    }); 
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.visible !== this.state.visible) {
      //this.setState({ startTime: nextProps.startTime });
      this.getNotifications();
    }
  }
  
  componentDidMount() {
    this.getNotifications();
  }

  closeMenu = () =>{
    this.state.onItemClicked();
  }
  render() {
    const visible = this.props.visible;
    return (
      <div className={visible ? "notes" : "notes-hidden"}>
        <div><img  className="menu-close" src={menu} onClick={this.closeMenu}/></div>
        {this.state.notes.map(note =>
              <div key={note.id} onClick={()=>this.markAsRead(note.id, 0)}>
                <div className="notification">{note.message_text} </div>
              </div>
            )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,

});

export default connect(
  mapStateToProps,
)(Notifications);
