import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import store from "../../store";
import menu from "../../resources/menu.svg" 
class Menu extends Component {

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

  handleLogout(event) {
    store.dispatch(logoutUser());
    this.closeMenu();
  }
  render() {
    const visible = this.props.visible;
    return (
      <div className={visible ? "menu" : "menu-hidden"}>
        <div><img  className="menu-close" src={menu} onClick={this.closeMenu}/></div>
        <Link className="link" to="/Login" onClick={this.handleLogout}>Logout</Link> <br />
        <Link className="link" to="/About" onClick={this.closeMenu}>About</Link><br />
        <Link className="link" to="/MyProfile"  onClick={this.closeMenu}>My profile</Link>
      </div>
    );
  }
}
export default Menu;