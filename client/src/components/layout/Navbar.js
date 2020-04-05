import React, { Component } from "react";
import { Link } from "react-router-dom";
import sandwich from "/resources/sandwich.png" 
class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="menuRight">
          <Link
              to="/address"
            >
               <span>🔍</span>
            </Link>

            <span> / </span>
            <Link
              to="/notifications"
            >
               <span>🔔</span>
            </Link>
            <span> / </span>
            <Link
              to="/menu"
            >
                <img src={sandwich} alt={"..."}/> 
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
