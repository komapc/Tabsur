import React, { Component } from "react";
import { Link } from "react-router-dom";

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
              to="/otifications"
            >
               <span>🔔</span>
            </Link>
            <span> / </span>
            <Link
              to="/menu"
            >
               <span style={{float: "right",width: "30px",   padding:"5px"}}>⋮</span>
            </Link>

           
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
