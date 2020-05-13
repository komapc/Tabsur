import React, { Component } from "react";
import { Link } from "react-router-dom";
import sandwich from "../../resources/menu.svg" 
import search from "../../resources/search.svg" 
import notification from "../../resources/notification.svg" 
import Menu from "./Menu.js"
import Notifications from "./Notifications";
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      showMenu: false,
      showNotifications: false
    };
  }

  openMenu = () =>
  {
    this.setState({showMenu: true});
  }

  openNotifications = () =>
  {
    this.setState({showNotifications: true});
  }
  render() {
    return (
      <div className="navbar-fixed">
        <nav>
            <div className="menu-right">
            <Link
              to="/meals"
            >
                <img className="navbar-icons" src={search} alt={"meals list"}/> 
            </Link>
            <span
                onClick={this.openNotifications} >
                <img className="navbar-icons" src={notification} alt={"Notifications"}/>
              </span>
            <span
              onClick={this.openMenu}>
                <img className="navbar-icons" src={sandwich} alt={"..."}/> 
            </span>
           
          </div>
        </nav>
        <div> 
          <Menu 
            visible={this.state.showMenu} 
            onItemClicked={()=>{this.setState({showMenu: false})}} />
            
          <Notifications 
            visible={this.state.showNotifications} 
            onItemClicked={()=>{this.setState({showNotifications: false})}} />
         </div> 
      </div>
    );
  }
}

export default Navbar;