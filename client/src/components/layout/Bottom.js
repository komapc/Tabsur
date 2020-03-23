import React, { Component } from "react";
import { Link } from "react-router-dom";

class Bottom extends Component {
  render() {
    return (
      <div className="footer ">
        <nav className="z-depth-0 footer">
          <div > <Link
            to="/MealsMap"
          >
            Map
            </Link>
            <span> | </span>
            <Link
              to="/Meals"
            >
              List
            </Link>
            <span> | </span>
            <Link
              to="/Create"
            >
              ➕
            </Link>

          </div>
        </nav>
      </div>
    );
  }
}

export default Bottom;
