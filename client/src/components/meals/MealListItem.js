import React from "react";
import dishes from "../../resources/dishes.png"
import time from "../../resources/time.png"
import { withRouter } from "react-router-dom";
var dateFormat = require('dateformat');
class MealListItem extends React.Component {


  handleAttend = () => {
    console.log(this.props.meal);
    this.props.history.push("/Attend/" + this.props.meal.id);
  }

  render() {
    const meal = this.props.meal;
    const dat = dateFormat(new Date(meal.created_at), "dddd, mmmm dS, yyyy, hh:MM:ss");
    return (
      <div className="meal_props" onClick={this.handleAttend}>
        <img src={"http://www.catsinsinks.com/cats/rotator.php?" + meal._id}
          alt="Meal" className="meal_image"
        />

        <div>by <span className="meal-owner">{meal.host_name}</span></div>
        <div className="meal-name" > {meal.name}</div>
        <div className="dish-time"> <img className="dish-icon" src={time} alt={"date"} /> {dat}</div>
        <div>
          <img className="dish-icon" src={dishes} alt={"number of portions"} />({meal.guest_count})</div>

      </div>
    )
  };

}

export default withRouter(MealListItem);
