import React from "react";
import { withRouter } from "react-router-dom";

import axios from 'axios';
import config from "../../config";
import MealListItem from "./MealListItem";
class BottomMealInfo extends React.Component {

  constructor(props) {
    super(props);
    console.log("bottom: " + JSON.stringify(props));
    this.state = {
      meal: props.meal
    };

  }

  handleAttend = () => {
    // console.log(this.props.meal);
    // this.props.history.push("/Attend/" + this.props.meal.id);
    console.log(this.props.meal + ", " + this.state.auth.user.id);
    const attend = { user_id: this.props.auth.user.id, meal_id: this.props.meal.id };
    axios.post(`${config.SERVER_HOST}/api/attends/${this.props.auth.user.id}`, attend)
      .then(res => {
        console.log(res);
        this.setState({ meals: res.data });
      })
      .catch(err => {
        console.log(err);
      });
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
