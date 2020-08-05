import React, { Component } from "react";
import { connect } from "react-redux";
import map from "../../resources/bottom_menu/map_bar.svg"
import list from "../../resources/bottom_menu/list_bar.svg"
import plus from "../../resources/bottom_menu/add_meal_bar.svg"
import myMeals from "../../resources/bottom_menu/my_meals_bar.svg"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
class  Bottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationsCount: props.notificationsCount
    };
  }
  render() {
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
          <Tab label="Meals" icon={<img className="footer-icons" src={map} alt={"meals map"} />}> </Tab>
          <Tab label="My Profile"  icon={<img className="footer-icons" src={list} alt={"meals map"} />}></Tab>  
          <Tab label="My Meals"  icon={
            <Badge badgeContent={this.props.notificationsCount} color="secondary">
              <img className="footer-icons" src={myMeals} alt={"meals map"} />
            </Badge>
          }></Tab>
          <Tab label="Add Meal" icon={<img className="footer-icons" src={plus} alt={"meals map"} />}></Tab>
        </Tabs>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  notificationsCount: state.notificationsCount
});
export default connect(mapStateToProps)(Bottom);