import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import store from "../../store";
class Menu extends Component {

  constructor(props) {
    super(props);
    console.log("MENU CONSTRUCTOR");
    this.state = {
      visible: this.props.visible,
      onItemClicked:this.props.onItemClicked,
    };
  }
  closeMenu = () =>{
    this.state.onItemClicked();
  }

  handleLogout(event) {
    store.dispatch(logoutUser());
    this.closeMenu(event);
  }
  render() {
    const visible = this.props.visible;
    return (
      <div className={visible ? "menu" : "menu-hidden"}>
        <Link to="/Login" onClick={this.handleLogout}>Logout</Link> <br />
        <Link to="/About" onClick={this.closeMenu}>>About</Link><br />
        <Link to="/MyProfile"  onClick={this.closeMenu}>> <span>🧍</span>My profile</Link><br />
      </div>
    );
  }
}
export default Menu;