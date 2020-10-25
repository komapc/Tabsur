import React, { useEffect, useState, Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MealListItem from "./MealListItem";
import { getGuestList, deleteMeal, getMealInfo } from "../../actions/mealActions";
import { getUserFollowers } from "../../actions/userActions";
import BackBarMui from "../layout/BackBarMui";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Friend from '../users/Friend';
class GuestList extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      guests: [],
      followies: [],
      sorted: ["Loading"], //list of guest with followies first
      userId: this.props ? this.props.userId : props.match.params.id
    }
  }

  getGuests = () => {
    getGuestList(this.props.mealId)
      .then(res => {
        console.log(res.data);
        this.setState({ guests: res.data });
      })
      .catch(err => {
        console.error(err);
      });
  }

  getFollowies = () => {
    const userId = this.state.userId;
    getUserFollowers(userId)
      .then(res => {
        console.log("followies: " + JSON.stringify(res.data));
        this.setState({ followies: res.data });
      })
      .catch(err => {
        console.error(err);
      });
  }
  componentDidMount() {
    this.getFollowies();
    this.getGuests();
  }

  render() {
    let sorted = this.state.guests;
    return (
      <>
        <h3>Guests list</h3>
        {
          sorted.map(guest =>
            <Box key={guest.user_id} m={1}>
              <Friend user_id={guest.user_id} name={guest.name} />
            </Box>
          )
        }
      </>
    );
  }
};


const deleteMealEvent = (history, meal) => {
  deleteMeal(meal.id).then(res => {
    console.log(res.data);

    history.push({ pathname: '/MyMeals' });
  })
    .catch(err => {
      console.error(err);
    });
}

const editMealEvent = (history, meal) => {
  history.push({ pathname: `/EditMeal/${meal.id}` });
}


const ShowMeal = (props) => {

  const state = props.location.state;
  
  const mealId = props.match.params.id;
  const [meal, setMeal] = useState({id:mealId, host_id:-1});
  
  console.log(`Meal id: ${mealId}`);
  useEffect(() => {
  
  if (state) {
    setMeal(props.location.state.meal);
  }
  else {
    console.log(`Meal id: ${mealId}`);

    getMealInfo(mealId)
      .then((res) => {
        setMeal(res.data[0]);
        console.log(res.data[0]);
      })
      .catch(err => {
        console.error(err);
      });
  
 }
}, [props]);

 const my = (meal)?
  meal.host_id === props.auth.user.id : false;
  return (
    <>
      <BackBarMui history={props.history} />
      <MealListItem meal={meal} />
      <GuestList mealId={mealId} userId={props.auth.user.id} />
      {
        my ? <>
          <Button variant="outlined" onClick={(e) => deleteMealEvent(e)}> Delete </ Button>
          <Button variant="outlined" onClick={() => editMealEvent(props.history, meal)}> Edit </ Button>
        </> : ""
      }

    </>
  );

}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withRouter(ShowMeal));
