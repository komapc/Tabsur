import React, { Component } from "react";
import { Link } from "react-router-dom";
import map from "../../resources/map.png"
import list from "../../resources/list.png"
import plus from "../../resources/plus.png"
import myMeals from "../../resources/my.png"

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
            {/* <img src="" className={(this.state.url==="/MealsMap")?"footerItem":"footerItemActive"} /> */}
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
