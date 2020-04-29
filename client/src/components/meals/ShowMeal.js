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
      guests:[]
    }
  }
  componentDidMount() {
    axios.get(`${config.SERVER_HOST}/api/meals/get_users/${this.props.mealId}`)
      .then(res => {
        console.log(res.data);
        this.setState({ guests: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }


  render() {
    return (
      <div className="main" >
        Guests list: 
        {
           this.state.guests.map(guest =>
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

  render() {
    return (
      <div className="main">
        <MealListItem meal={this.state.meal} />
        <GuestList mealId={this.state.meal.id}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
)(withRouter(ShowMeal));
