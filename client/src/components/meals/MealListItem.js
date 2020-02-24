import React from "react";
import { Link } from 'react-router-dom';


class MealListItem extends React.Component {
  render() {
    const meal = this.props.meal;
    return (
      <span>
        <div className="meal_props">
          <img src={"http://www.catsinsinks.com/cats/rotator.php?" + meal._id} alt="Meal image" className="meal_image"></img>
          <span className="mealName" > {meal.mealName}</span>
          <br />
          <span> {new Date(meal.dateCreated).toUTCString()}</span>
          <br />
          <Link to={"/Attend/" + meal._id}> Attend</Link>
        </div>
      </span>
    )
  };

}

export default MealListItem;
