import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div >
            <Link
              to="/"        
            >
              Main
            </Link>
            <span> ** </span>
            <Link
              to="/Meals"   
            >
              Join a meal to join!
            </Link>
            <span> ** </span>
            <Link
              to="/Create"   
            >
              Create a  meal
            </Link> <span> ** </span>
            <Link
              to="/YouMeals"   
            >
              Create a  meal
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
