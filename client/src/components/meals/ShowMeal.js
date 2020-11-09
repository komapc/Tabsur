import React, { useEffect, useState, Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MealListItem from "./MealListItem";
import { getGuestList, deleteMeal, getMealInfo } from "../../actions/mealActions";
import { getUserFollowers } from "../../actions/userActions";
import BackBarMui from "../layout/BackBarMui";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Friend from '../users/Friend';
//todo: use GuestList component
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
    if (!userId)
    {
      this.setState({ followies: [] });
      return;
    }
    getUserFollowers(userId)
      .then(res => {
        console.log(`Followies: ${JSON.stringify(res.data)}`);
        this.setState({ followies: res.data });
      })
      .catch(err => {
        this.setState({ followies: [] });
        console.error(err);
      });
  }
  componentDidMount() {
    this.getFollowies();
    this.getGuests();
  }

  render() {
    let sorted = this.state.guests;
    if ( this.state.guests.length === 0)
      return <> </>;
     
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

const goToMaps = (event, id) => {
  event.stopPropagation();
  event.preventDefault();
  this.props.history.push(`/MealMap/${id}`);//todo: fix, redirect properly to the map
}

const ShowMeal = (props) => {

  const state = props.location.state;
  
  const mealId = props.match.params.id;
  const [meal, setMeal] = useState(null);
  
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
        console.log(`getMealInfo: ${JSON.stringify(res.data[0])}`);
      })
      .catch(err => {
        console.error(err);
      });
  
 }
}, [mealId, props, state]);

 const my = (meal)?
  meal.host_id === props.auth.user.id : false;
  return (
    <>
    
    <BackBarMui history={props.history} />
    <Grid container spacing={2}
    justify="space-around"
    alignItems="flex-start"
    direction="column">
      <Box  style={{width:"80vw"}}m={2} xs={12} >
        {meal?<MealListItem meal={meal} />:<></>}
        <h3>Description</h3> 
        <div >{meal?meal.description:""}</div>
        <h3>Address</h3> 
         {/* <Typography variant="body2" color="textPrimary" component="p" onClick={(event) => { props.goToMaps(event, props.meal.id) }}>
          <RoomIcon fontSize='small' style={{ color: 'black', }} /> {props.meal.address}
        </Typography> */}
        <div onClick={(event) => { goToMaps(event, props.meal.id) }}>{meal?meal.address:""}</div>
        <GuestList mealId={mealId} userId={props.auth.user.id} />
        {
          my ? <>
            <Button variant="outlined" onClick={(e) => deleteMealEvent(props.history, meal)}> Delete </ Button>
            <Button variant="outlined" onClick={() => editMealEvent(props.history, meal)}> Edit </ Button>
          </> : ""
        }
    </Box>
    </Grid>
    </>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withRouter(ShowMeal));
