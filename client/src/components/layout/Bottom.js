import React, { Component } from "react";
import map from "../../resources/bottom_menu/map_bar.svg"
import list from "../../resources/bottom_menu/list_bar.svg"
import plus from "../../resources/bottom_menu/add_meal_bar.svg"
import myMeals from "../../resources/bottom_menu/my_meals_bar.svg"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
class  Bottom extends Component {
  render() {
    return (
      <div className="footer">
        <Tabs value={this.props.index}  onChange={this.props.onChange}  selectedIndex={this.props.index} 
          fullWidth centered selectionFollowsFocus='True' indicatorColor='primary'
          inkBarStyle={{background: 'Black'}} 
          TabIndicatorProps={{
            style: {
              backgroundColor: "#dc004e"
            }
        }}>
          <Tab label="Meals" icon={<img className="footer-icons" src={map} alt={"meals map"} />}> </Tab>
          <Tab label="My Profile"  icon={<img className="footer-icons" src={list} alt={"meals map"} />}></Tab>  
          <Tab label="My Meals"  icon={<img className="footer-icons" src={myMeals} alt={"meals map"} />}></Tab>
          <Tab label="Add Meal" icon={<img className="footer-icons" src={plus} alt={"meals map"} />}></Tab>
        </Tabs>
      </div>
    );
  }
}

export default Bottom;
