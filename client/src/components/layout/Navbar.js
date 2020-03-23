import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div >
            <Link
              to="/Notifications"
            >
               <span>🔔</span>
            </Link>

            <span> / </span>

            <Link
              to="/MyProfile"
            >
               <span>🧍</span>
            </Link>

            <span> / </span>
            <Link
              to="/About"
            >
              About us
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
