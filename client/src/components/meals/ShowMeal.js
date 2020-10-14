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
      userId: this.props.userId
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

class ShowMeal extends Component {

  constructor(props) {
    super(props);
    this.state = props.location.state;
  }

  deleteMealEvent = (e) => {
    deleteMeal(this.state.meal.id).then(res => {
      console.log(res.data);

      this.props.history.push({ pathname: '/MyMeals' });
    })
      .catch(err => {
        console.error(err);
      });
  }

  editMealEvent = (e) => {
    this.props.history.push({ pathname: `/EditMeal/${this.state.meal.id}` });
  }

  render() {
    const my = this.state.meal.host_id === this.props.auth.user.id;
    return (
      <>
        <BackBarMui history={this.props.history} />
        <MealListItem meal={this.state.meal} />
        <GuestList mealId={this.state.meal.id} userId={this.props.auth.user.id} />
        {
          my? <>
            <Button variant = "outlined" onClick={(e) => this.deleteMealEvent(e)}> Delete </ Button> 
            <Button variant = "outlined" onClick={(e) => this.editMealEvent(e)}> Edit </ Button>  
          </>:""
        }

      </>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withRouter(ShowMeal));
