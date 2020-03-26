import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import store from "../../store";
class Menu extends Component {
render() {
   
  return (
    <div>
      <Link to="/Login" /*onClick={   store.dispatch(logoutUser())*/>Logout</Link> <br/>
      <Link to="/About">About</Link><br/>
      <Link to="/MyProfile"> <span>🧍</span>My profile</Link><br/>
      <Link to="/MealsMap">Close</Link><br/>
    </div>  
  );
}
}
export default Menu;
