import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MealListItem from "./MealListItem";
import { getGuestList, deleteMeal } from "../../actions/mealActions";
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
  const meal = state ? props.location.state.meal : {};
  const my = meal.host_id === props.auth.user.id;
  return (
    <>
      <BackBarMui history={props.history} />
      <MealListItem meal={meal} />
      <GuestList mealId={meal.id} userId={props.auth.user.id} />
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
