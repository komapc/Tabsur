import React, { Component } from "react";
import { Link } from "react-router-dom";

import map from "../../resources/bottom_menu/map_bar.svg"
import list from "../../resources/bottom_menu/list_bar.svg"
import plus from "../../resources/bottom_menu/add_meal_bar.svg"
import myMeals from "../../resources/bottom_menu/my_meals_bar.svg"

// import mapActive from "../../resources/bottom_menu/active_map_bar.svg"
// import listActive from"../../resources/bottom_menu/active_list_bar.svg"
// import plusActive from "../../resources/bottom_menu/active_add_meal_bar.svg"
// import myMealsActive from "../../resources/bottom_menu/active_my_meals_bar.svg"
class Bottom extends Component {
  constructor() {
    super();
    this.state = {
      url: window.location.pathname
    };
  }
  render() {

    return (
      <div className="footer">
        <nav className="z-depth-0 footer">
          <Link to="/MealsMap">
            <img className="footer-icons" src={map} alt={"meals map"} />
             <img src="" className={(this.state.url==="/MealsMap")?"footerItem":"footerItemActive"} /> 
          </Link>
          <Link to="/Meals" >
           <img className="footer-icons" src={list} alt={"meals list"} /> </Link>
           <Link to="/Create" >
           <img className="footer-icons" src={plus} alt={"add meal"} />
          </Link>
          <Link to="/MyMeals">
            <img className="footer-icons" src={myMeals} alt={"my meals"} />
            </Link>
        </nav>
      </div>
    );
  }
}

export default Bottom;
