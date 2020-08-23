import React, { Component } from "react";
import { connect } from "react-redux";
import store from "../../store";
import setMessagesCount from "../../actions/MessagesActions"
import { setNotificationsCount, setProfileNotificationsCount } from "../../actions/notifications"
import meals from "../../resources/bottom_menu/my_meals_bar.svg"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { makeStyles } from '@material-ui/core/styles';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
const useStyles = makeStyles(theme => ({
  bigIcon: {
    height: '33px',
    margin: '12px',
    marginBottom: '1px',
    width: '33px'
  }
}));
const BigPersonImg = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <AccountCircleOutlinedIcon className={classes.bigIcon} />
    </React.Fragment>
  )
}
const BigSearchIcon = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <SearchOutlinedIcon className={classes.bigIcon} />
    </React.Fragment>
  )
}
const BigChatIcon = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <ChatOutlinedIcon className={classes.bigIcon} />
    </React.Fragment>
  )
}
const BigAddImg = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <AddCircleOutlineOutlinedIcon className={classes.bigIcon} />
    </React.Fragment>
  )
}
class Bottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messagesCount: props.messagesCount,
      notificationsCount: props.notificationsCount,
      profileNotificationsCount: props.profileNotificationsCount
    };
  }
  render() {
    // TODO: use tabs enum object from App.js and move it from App.js outside
    if (this.props.index === 1 && this.props.profileNotificationsCount !== 0) {
      store.dispatch(setProfileNotificationsCount(0));
    } else if (this.props.index === 2 && this.props.notificationsCount !== 0) {
      store.dispatch(setNotificationsCount(0));
    } else if (this.props.index === 3 && this.props.messagesCount !== 0) {
      store.dispatch(setMessagesCount(0));
    }

    return (
      <div className="footer">
        <Tabs
          value={this.props.index}
          onChange={this.props.onChange}
          centered
          indicatorColor='primary'
          TabIndicatorProps={{
            style: {
              backgroundColor: "primary"
            }
          }}>
          <Tab label="Search" icon={<BigSearchIcon />} />
          <Tab label="My Profile" icon={<Badge badgeContent={this.props.profileNotificationsCount} color="secondary"><BigPersonImg /></Badge>}></Tab>
          <Tab label="My Meals" icon={
            <Badge badgeContent={this.props.notificationsCount} color="secondary">
              <img className="footer-icons" src={meals} alt={"meals map"} />
            </Badge>
          }></Tab>
          <Tab label="Chat" icon={
            <Badge badgeContent={this.props.messagesCount} color="secondary">
              <BigChatIcon />
            </Badge>
          }></Tab>
        </Tabs>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  messagesCount: state.messagesCount,
  notificationsCount: state.notificationsCount,
  profileNotificationsCount: state.profileNotificationsCount
});
export default connect(mapStateToProps)(Bottom);