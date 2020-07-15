import React, { Component } from "react";
import sandwich from "../../resources/menu.svg"
import notification from "../../resources/notification.svg"
import setMessagesCount from "../../actions/MessagesActions"
import Menu from "./Menu.js"
import Notifications from "./Notifications";
import Badge from '@material-ui/core/Badge';
import { connect } from "react-redux";
import MessageOutlinedIcon from '@material-ui/icons/Message';
import store from "../../store";
import setNotificationsCount from "../../actions/notifications"

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideNavBar: false,
      visible: false,
      showMenu: false,
      showNotifications: false
    };

    store.subscribe(() => {
      // ISSUE: I can subscribe to messagesCount or notificationsCount (switch between next two lines)
      //        But I can't subscribe to both of them

      //this.setState({ messagesCount: store.getState().messagesCount });
      this.setState({ notificationsCount: store.getState().notificationsCount });
    });
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
    alert('messages under construction');
  };

  render() {
    return (
      <div className="navbar-top">
        <div>
          <span onClick={this.openMessages}>
            <Badge badgeContent={this.state.messagesCount} color="secondary">
              <MessageOutlinedIcon fontSize="large" color="disabled" alt={"Messages"} />
            </Badge>
          </span>
          <span onClick={this.openNotifications} >
            <Badge badgeContent={this.state.notificationsCount} color="secondary">
              <img className="navbar-icons" src={notification} alt={"Notifications"} />
            </Badge>
          </span>
          <span onClick={this.openMenu}>
            <Badge badgeContent={0} color="secondary">
              <img className="navbar-icons" src={sandwich} alt={"..."} />
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

const mapDispatchToProps = dispatch => {
  // return {
  //   setMessagesCount: () => dispatch(setMessagesCount()),
  //   setNotificationsCount: () => dispatch(setNotificationsCount()),
  //   dispatch
  // }
  return {
    setMessagesCount: (newCount) => dispatch(setMessagesCount(newCount)),
    setNotificationsCount: (newCount) => dispatch(setNotificationsCount(newCount))
  }
}
export default connect(
  mapStateToProps, mapDispatchToProps
)(Navbar);
