import React from "react";
import dishes from "../../resources/dishes.png"
import location from "../../resources/location.png"
import time from "../../resources/time.png"
import attend from "../../resources/attend.png"
import connect from 'react-redux'
import { withRouter } from "react-router-dom";
//import {joinMeal} from "../../actions/mealActions"
import axios from "axios";
import config from "../../config";
var dateFormat = require('dateformat');
class MealListItem extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      meals: []
    };
  }

  
  handleAttend = () => {
    console.log(this.props.meal);
    //joinMeal(this.props.meal);
    // this.props.history.push("/Attend/" + this.props.meal.id);
    // debugger;
    // axios.post(`${config.SERVER_HOST}/api/attends/get/` + this.props.auth.user.id)
    //   .then(res => {
    //     console.log(res);
    //     this.setState({ meals: res.data });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  render() {
    const meal = this.props.meal;
    const dat = dateFormat(new Date(meal.created_at), "dddd, mmmm dS, yyyy, hh:MM");
    return (
      <div className="meal_props" >
        <span className="meal-props-left">
          <img src={"http://www.catsinsinks.com/cats/rotator.php?" + meal._id}
            alt="Meal" className="meal_image"/>
          <div className="meal-dishes-div">
            <img className="dish-icon" src={dishes} alt={"number of portions"} />
            <span className="meal-guests">({meal.guest_count}/{meal.Atendee_count})</span>
          </div>
        </span>
        <span >
          <img className="attend-button" src={attend} alt={"attend"} onClick={this.handleAttend}/>
        <div className="meal-owner-div">by <span className="meal-owner">{meal.host_name}</span>
         
        </div>
          <div className="meal-name" > {meal.name}</div>
          <div>
          <img className="dish-icon" src={time} alt={"date"} />
          <span className="dish-time">  {dat} </span>
          </div>
          <img className="location-icon" src={location} alt={"address"} />
          <span className="location-text">
          {meal.address}
          </span>
        </span>

      </div>
    )
  };

}

const mapStateToProps = state => ({
  auth: state.auth,

});
export default withRouter(MealListItem);
//export default connect(mapStateToProps)(MealListItem);
