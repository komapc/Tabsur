import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import store from "../../store";
import menu from "../../resources/menu.svg" 
class Notifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      onItemClicked:this.props.onItemClicked,
    };
  }
  closeMenu = () =>{
    this.state.onItemClicked();
  }
  render() {
    const visible = this.props.visible;
    return (
      <div className={visible ? "menu" : "menu-hidden"}>
        <div><img  className="menu-close" src={menu} onClick={this.closeMenu}/></div>
        No Notifications
      </div>
    );
  }
}
export default Notifications;