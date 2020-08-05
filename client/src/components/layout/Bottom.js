import React, { Component } from "react";
import { connect } from "react-redux";
import store from "../../store";
import {setNotificationsCount, setProfileNotificationsCount} from "../../actions/notifications"
import map from "../../resources/bottom_menu/map_bar.svg"
import list from "../../resources/bottom_menu/list_bar.svg"
import plus from "../../resources/bottom_menu/add_meal_bar.svg"
import meals from "../../resources/bottom_menu/my_meals_bar.svg"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import FaceOutlinedIcon from '@material-ui/icons/FaceOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { makeStyles } from '@material-ui/core/styles';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined';
const useStyles = makeStyles(theme => ({
  bigIcon: {
      height:'33px',
      margin: '12px',
      marginBottom:'1px',
      width: '33px'
  }
}));
const BigPersonImg = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      {/* <PersonOutlineOutlinedIcon className={classes.bigIcon} /> */}
      <FaceOutlinedIcon className={classes.bigIcon} />
    </React.Fragment>
  )
}
const BigSearchIcon = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      {/* <PersonOutlineOutlinedIcon className={classes.bigIcon} /> */}
      <SearchOutlinedIcon className={classes.bigIcon} />
    </React.Fragment>
  )
}
const BigMessageIcon = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <MessageOutlinedIcon className={classes.bigIcon} />
    </React.Fragment>
  )
}
const BigAddImg = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      {/* <PersonOutlineOutlinedIcon className={classes.bigIcon} /> */}
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
    if(this.props.index === 1 && this.props.profileNotificationsCount !== 0) {
      store.dispatch(setProfileNotificationsCount(0));
    } else if(this.props.index === 2 && this.props.notificationsCount !== 0) {
      store.dispatch(setNotificationsCount(0));
    }
    return (
      <div className="footer">
        <Tabs 
          value={this.props.index}  
          onChange={this.props.onChange}  
          //selectedIndex={this.props.index} 
          //fullWidth 
          //selectionFollowsFocus='True' 
          //inkBarStyle={{ background: 'Black' }} 
          centered 
          indicatorColor='primary'
          TabIndicatorProps={{
            style: {
              backgroundColor: "#dc004e"
            }
        }}>
          {/* <Tab label="Meals" icon={<img className="footer-icons" src={meals} alt={"meals map"} />}> </Tab> */}
          <Tab label="Meals" icon={<BigSearchIcon />}> </Tab>
          {/* <Tab label="My Profile"  icon={<img className="footer-icons" src={list} alt={"meals map"} />}></Tab>   */}
          <Tab label="My Profile"  icon={<Badge badgeContent={this.props.profileNotificationsCount} color="secondary"><BigPersonImg /></Badge>}></Tab>  
          <Tab label="My Meals"  icon={
            <Badge badgeContent={this.props.notificationsCount} color="secondary">
              <img className="footer-icons" src={meals} alt={"meals map"} />
              {/* <BigMyMealsImg /> */}
            </Badge>
          }></Tab>
          <Tab label="Messages" icon={
            // <img className="footer-icons" src={plus} alt={"meals map"} />
            // <BigAddImg />
            <Badge badgeContent={this.props.messagesCount} color="secondary">
              <BigMessageIcon />
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