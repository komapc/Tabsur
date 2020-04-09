import React, { Component } from "react";
import { Link } from "react-router-dom";
import sandwich from "../../resources/sandwich.png" 
import search from "../../resources/search.png" 
import Menu from "./Menu.js"
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu:false
    };
  }

  openMenu = () =>
  {
    this.setState({showMenu: true});
  }
  render() {
    return (
      <div className="navbar-fixed">
        <nav>
            <div className="menuRight">
            <span>STATE:{this.state.showMenu?1:0}</span>
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
            <span
              onClick={this.openMenu}
            >
                <img className="navbar-icons" src={sandwich} alt={"..."}/> 
            </span>
          </div>
        </nav>
        <div>
          
          <Menu visible={this.state.showMenu}/>
        </div>
      </div>
    );
  }
}

export default Navbar;