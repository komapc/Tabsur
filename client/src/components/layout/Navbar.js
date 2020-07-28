import React, { Component } from "react";
import sandwich from "../../resources/menu.svg"
import notification from "../../resources/notification.svg"
import setMessagesCount from "../../actions/MessagesActions"
import Menu from "./Menu.js"
import Notifications from "./Notifications";
import Badge from '@material-ui/core/Badge';
import { connect } from "react-redux";
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import store from "../../store";
import setNotificationsCount from "../../actions/notifications"

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideNavBar: false,
      visible: false,
      showMenu: false,
      showNotifications: false,
      messagesCount: props.messagesCount,
      notificationsCount: props.notificationsCount
    };
    console.log(`notificationsCount: ${JSON.stringify(this.props.notificationsCount)}`);
  }

  openMenu = () => {
    this.setState({ showMenu: true });
  }

  openNotifications = () => {
    this.setState({ showNotifications: true });
    store.dispatch(setNotificationsCount(0));
  }

  openMessages = () => {
    store.dispatch(setMessagesCount(0));
    alert('You have received a message,');
  };

  render() {
    return (
      <div className="navbar-top">
        <div>
          <span onClick={this.openMessages}>
            <Badge badgeContent={this.props.messagesCount} color="secondary">
              <MessageOutlinedIcon fontSize="large" color="primary" alt={"Messages"} />
            </Badge>
          </span>
          <span onClick={this.openNotifications} >
            <Badge badgeContent={this.props.notificationsCount} color="secondary">
              {/* <img className="navbar-icons" src={notification} alt={"Notifications"} /> */}
              <NotificationsOutlinedIcon fontSize="large" color="primary" alt={"Notifications"} />
            </Badge>
          </span>
          <span onClick={this.openMenu}>
            <Badge badgeContent={0} color="secondary">
              {/* <img className="navbar-icons" src={sandwich} alt={"..."} /> */}
              <MoreVertIcon fontSize="large" color="primary" alt={"Menu"} />
            </Badge>
          </span>
        </div>
        <div>
          <Menu visible={this.state.showMenu}
            onItemClicked={() => { this.setState({ showMenu: false }) }} />

          <Notifications
            visible={this.state.showNotifications}
            onItemClicked={() => { this.setState({ showNotifications: false }) }} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notificationsCount: state.notificationsCount,
  messagesCount: state.messagesCount
});

export default connect(
  mapStateToProps
)(Navbar);
