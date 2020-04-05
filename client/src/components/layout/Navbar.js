import React, { Component } from "react";
import { Link } from "react-router-dom";
import sandwich from "../../resources/sandwich.png" 
import search from "../../resources/search.png" 
class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="menuRight">
        
            {/* <Link
              to="/notifications"
            >
               <span>🔔</span>
            </Link> */}
            <Link
              to="/meals"
            >
                <img className="navbar-icons" src={search} alt={"meals list"}/> 
            </Link>
            <Link
              to="/menu"
            >
                <img className="navbar-icons" src={sandwich} alt={"..."}/> 
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
