import React, { Component } from "react";
import { Link } from "react-router-dom";

class Bottom extends Component {
  constructor()
  {
    super();
    this.state = {
      url:window.location.pathname
    };
  }
  render() {
   
    return (
      <div className="footer ">
        <nav className="z-depth-0 footer">
          <div > 
            <Link
             to="/MealsMap"
            >
            <span className={(this.state.url==="/MealsMap")?"footerItem":"footerItemActive"} >Map</span>
            </Link>
            <span> | </span>
            <Link 
              to="/Meals"
            >
              <span className={(window.location.pathname==="/Meals")?"footerItem":"footerItemActive"} >List</span>
            </Link>
            <span> | </span>
            <Link
              to="/Create"
            >
               <span className={(window.location.pathname==="/Create")?"footerItem":"footerItemActive"} >➕</span>
            </Link>

          </div>
        </nav>
      </div>
    );
  }
}

export default Bottom;
