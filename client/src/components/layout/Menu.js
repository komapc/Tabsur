import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import store from "../../store";
class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMenu:false
    };
  }
  handleLogout(event) {
    store.dispatch(logoutUser());
  }
  render() {

    return (
      <div className={this.state.showMenu ? "menu" : "menu-hidden"}>
        <Link to="/Login" onClick={this.handleLogout}>Logout</Link> <br />
        <Link to="/About">About</Link><br />
        <Link to="/MyProfile"> <span>🧍</span>My profile</Link><br />
      </div>
    );
  }
}
export default Menu;
