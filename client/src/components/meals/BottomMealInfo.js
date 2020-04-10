import React from "react";
import dishes from "../../resources/dishes.png"
import location from "../../resources/location.png"
import time from "../../resources/time.png"
import { withRouter } from "react-router-dom";

import MealListItem from "./MealListItem";
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
    
    return (
      <div className="meal_props" onClick={this.handleAttend}>
        <MealListItem  meal={meal}/>
      </div>
    )
  };

}

export default withRouter(BottomMealInfo);
