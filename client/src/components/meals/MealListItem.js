import dishes from "../../resources/servings_icon.svg"
import location from "../../resources/location_icon.svg"
import time from "../../resources/date_time_icon.svg"
import attended from "../../resources/attended.svg";
import fullUp from "../../resources/full_up.svg";
import hosted from "../../resources/host_meal.svg"
import available from "../../resources/available_meal.svg"

import { withRouter } from "react-router-dom";
import { joinMeal } from "../../actions/mealActions"
import { connect } from "react-redux";

import React from "react";
var dateFormat = require('dateformat');
class MealListItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      meal: this.props.meal,
      auth: this.props.auth
    };
  }

  componentDidUpdate(prevProps) {
    if(prevProps.meal !== this.props.meal) {
      this.setState({meal: this.props.meal});
    }
  }
  
  handleAttend = () => {
    const status=3; //attend
    const user_id = this.state.auth.user.id;
    if (this.state.meal.guest_count <= this.state.meal.Atendee_count) {
      return;
    }

    if (this.state.meal.host_id === this.state.auth.user.id) {
      return;
    }

    if (this.state.meal.me > 0) {
      return;
    }
    console.log("handleAttend: " + JSON.stringify(this.state.meal) + ", " + user_id);
    const attend = { user_id: user_id, meal_id: this.props.meal.id, status: status };
    this.props.joinMeal(attend, user_id);
    this.setState((prevState => {
      let meal = Object.assign({}, prevState.meal);  // creating copy 
      meal.Atendee_count++;
      meal.me = 1;
      return { meal };
    }));
  }

  getMealIcon = (meal, userId) => {
    console.log(JSON.stringify(meal));

    if (meal.guest_count <= meal.Atendee_count) {
      return fullUp;
    }

    if (meal.host_id === userId) {
      return hosted;
    }
    if (meal.me > 0) {
      return attended;
    }
    return available;
  }
  gotoMeal = ( event, meal)=>
  {
    this.props.history.push({
      pathname: '/Meal',
      state: { meal:meal}});
  }
  goToUser = (event, host_id) =>
  {
    event.stopPropagation();
    event.preventDefault();
    this.props.history.push(`/user/${host_id}`);
  }
  render() {

    const meal = this.state.meal;
    console.log("MealListItem: " + JSON.stringify(meal));
    if (Object.keys(meal).length === 0) {
      return <div></div>
    }
    const attendStateIcon = this.getMealIcon(meal, this.props.auth.user.id);
    const dat = dateFormat(new Date(meal.created_at), "dddd, mmmm dS, yyyy, hh:MM");
    return (
      <div className="meal_props" onClick={(event)=>{this.gotoMeal(event, meal)}}>
        <span className="meal-props-left">
          <img src={"http://www.catsinsinks.com/cats/rotator.php?" + meal.id}
            alt="Meal" className="meal_image" />
          <div className="meal-dishes-div">
            <img className="meal-info-icons" src={dishes} alt={"number of portions"} />
            <span className="meal-guests">({meal.guest_count}/{meal.Atendee_count})</span>
          </div>
        </span>
        <span >
          
        <span  className="attend-button">
          <img 
            src={attendStateIcon} 
            alt={"attend"} 
            onClick={this.handleAttend} />
            attend</span>
          <div className="meal-owner-div">by <span className="meal-owner" 
          onClick={(event)=>{this.goToUser(event, meal.host_id)}}>{meal.host_name}</span>
          </div>
          <div className="meal-name" > {meal.name}</div>
          <div>
            <img className="meal-info-icons" src={time} alt={"date"} />
            <span className="meal-info">{dat}</span>
          </div>
          <div>
            <img className="meal-info-icons" src={location} alt={"address"} />
            <span className="meal-info">{meal.address}  </span>
          </div>
        </span>
      </div>
    )
  };
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { joinMeal }
)(withRouter(MealListItem));