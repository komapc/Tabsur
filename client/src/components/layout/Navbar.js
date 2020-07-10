import React, { Component } from "react";
import sandwich from "../../resources/menu.svg" 
import notification from "../../resources/notification.svg" 
import MessageOutlinedIcon from '@material-ui/icons/Message';
import Menu from "./Menu.js"
import Notifications from "./Notifications";
import Badge from '@material-ui/core/Badge';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideNavBar: false,
      visible:false,
      showMenu: false,
      showNotifications: false
    };
  }

  openMenu = () => {
    this.setState({showMenu: true});
  }

  openNotifications = () => {
    this.props.setNewNotificationsCounter(0);
    this.setState({showNotifications: true});
  }

  openMessages = () => {
    this.props.setNewMessagesCounter(0);
    alert('messages under construction');
  }

  render() {
    return (
      <div className="navbar-top">
        <div>
          <div>
            <span onClick={this.openMessages}>
              <Badge badgeContent={this.props.newMessagesCounter} color="secondary">
                <MessageOutlinedIcon fontSize="large" color="disabled" alt={"Messages"}/>
              </Badge>
            </span>
            <span onClick={this.openNotifications} >
              <Badge badgeContent={this.props.newNotificationsCounter} color="secondary">
                <img className="navbar-icons" src={notification} alt={"Notifications"}/>
              </Badge>
            </span>
            <span onClick={this.openMenu}>
              <Badge badgeContent={0} color="secondary">
                <img className="navbar-icons" src={sandwich} alt={"..."}/> 
              </Badge>
            </span>
          </div>
        </div>
        <div> 
          <Menu visible={this.state.showMenu} 
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