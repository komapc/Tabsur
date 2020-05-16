import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import map from "../../resources/bottom_menu/map_bar.svg"
import list from "../../resources/bottom_menu/list_bar.svg"
import plus from "../../resources/bottom_menu/add_meal_bar.svg"
import myMeals from "../../resources/bottom_menu/my_meals_bar.svg"

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
        <nav>
          <NavLink to="/MealMap" activeClassName="active">
            <img className="footer-icons" src={map} alt={"meals map"} /></NavLink >
          <NavLink to="/Meals" activeClassName="active">
            <img className="footer-icons" src={list} alt={"meals list"} /> </NavLink >
          <NavLink to="/Create" activeClassName="active">
            <img className="footer-icons" src={plus} alt={"add meal"} /></NavLink >
          <NavLink to="/MyMeals" activeClassName="active">
            <img className="footer-icons" src={myMeals} alt={"my meals"} /> </NavLink >

        </nav>

      </div>
    );
  }
}

export default Bottom;
