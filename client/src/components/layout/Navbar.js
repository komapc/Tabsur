import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="menuRight">
          <Link
              to="/Address"
            >
               <span>🔍</span>
            </Link>

            <span> / </span>
            <Link
              to="/Notifications"
            >
               <span>🔔</span>
            </Link>
            <span> / </span>
            <Link
              to="/Menu"
            >
               <span>⋮</span>
            </Link>

           
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
