import React from "react";
import { Link } from 'react-router-dom';
var dateFormat = require('dateformat');

class MealListItem extends React.Component {
  render() {
    const meal = this.props.meal;
    const dat=dateFormat(new Date(meal.created_at), "dddd, mmmm dS, yyyy, h:MM:ss TT");
    return (
      <div className="meal_props"> <img src={"http://www.catsinsinks.com/cats/rotator.php?" + meal._id} 
        alt="Meal" className="meal_image"/>

        <div>by <span>{meal.host_name}</span></div>
        <div className="mealName" > {meal.name}</div>
        <div> date: {dat}</div>
        <div> <span>🍽️</span>({meal.guest_count})</div>
        <Link to={"/Attend/" + meal.id}> Attend</Link>
      </div>
    )
  };

}

export default MealListItem;
