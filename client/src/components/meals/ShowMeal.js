import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addMeal } from "../../actions/mealActions";
import MealListItem from "./MealListItem";
import axios from 'axios';
import config from "../../config";

class GuestList extends Component {
  constructor(props) {
    super(props);
    this.state = 
    { 
      guests:[],
      followies:[],
      sorted:[], //list of guest with followies first
      userId:this.props.userId
    }
  }

  getGuests = ()=>
  {
    axios.get(`${config.SERVER_HOST}/api/meals/get_users/${this.props.mealId}`)
    .then(res => {
      console.log(res.data);
      this.setState({ guests: res.data });
    })
    .catch(err => {
      console.log(err);
    });
  }

  getFollowies = ()=>
  {
    const user_id = this.state.userId;
    axios.get(`${config.SERVER_HOST}/api/follow/followies/${user_id}`)
    .then(res => {
      console.log("followies: " + res.data);
      this.setState({ followies: res.data });
    })
    .catch(err => {
      console.log(err);
    });
  }
  componentDidMount() {
    this.getFollowies();
    this.getGuests();
  }

  render() {
    let  sorted = this.state.guests;
    //sorted = sorted.concat(this.state.guests);
    //const uniq = [...new Set(sorted)];
    return (
      <div className="main" >
        Guests list: 
        {
          sorted.map(guest =>
          <div key={guest.id}>
            <Link to={`user/${guest.user_id}`}> #{guest.name}</Link>
          </div>
          )
        }
      </div>
    );
  }
};

class ShowMeal extends Component {

  constructor(props) {
    super(props);
    this.state = props.location.state;
  }
  deleteMeal = (e) =>
  {    
    axios.delete(`${config.SERVER_HOST}/api/meals/${this.props.mealId}`)
    .then(res => {
      console.log(res.data);
      alert("The meal was deleted");
    })
    .catch(err => {
      console.log(err);
    });
  }
  render() {
    return (
      <div className="main">
        <MealListItem meal={this.state.meal} />
        <GuestList mealId={this.state.meal.id} userId = {this.props.auth.user.id}/>
        {
          (this.state.meal.host_id == this.props.auth.user.id)?
          <button onClick={(e)=>this.deleteMeal(e)}> Delete meal </ button>:""
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withRouter(ShowMeal));
