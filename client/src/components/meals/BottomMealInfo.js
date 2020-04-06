import React from "react";
import dishes from "../../resources/dishes.png"
import location from "../../resources/location.png"
import time from "../../resources/time.png"
import { withRouter } from "react-router-dom";
var dateFormat = require('dateformat');
class BottomMealInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      meal: {created_at:0}
    };
  }

  handleAttend = () => {
    console.log(this.props.meal);
    this.props.history.push("/Attend/" + this.props.meal.id);
  }

  render() {
    const meal = this.props.meal;
    if (typeof meal === 'undefined')
    {
      return <div>Nothing is selected</div>
    }
    const dat = dateFormat(new Date(meal.created_at), "dddd, mmmm dS, yyyy, hh:MM:ss");
    return (
      <div className="meal_props" onClick={this.handleAttend}>
        <span >
          <img src={"http://www.catsinsinks.com/cats/rotator.php?" + meal._id}
            alt="Meal" className="meal_image"
          />
          <div>
            <img className="dish-icon" src={dishes} alt={"number of portions"} />({meal.guest_count})
          </div>
        </span>
        <span >
        <div>by <span className="meal-owner">{meal.host_name}</span></div>
          <div className="meal-name" > {meal.name}</div>
          <div className="dish-time"> <img className="dish-icon" src={time} alt={"date"} /> {dat}
          </div>
          <span>
            <img className="dish-icon" src={location} alt={"address"} />{meal.address}
          </span>
        </span>

      </div>
    )
  };

}

export default withRouter(BottomMealInfo);
