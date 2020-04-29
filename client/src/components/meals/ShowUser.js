import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addMeal, getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";
import axios from 'axios';
import config from "../../config";


class ShowUser extends Component {

  constructor(props) {
    super(props);
    this.state={
      id : this.props.match.params.id,
      user: {},
      ...props
    };
  }

  
  componentDidMount() {
    axios.get(`${config.SERVER_HOST}/api/users/get/${this.state.id}`)
      .then(res => {
        console.log(res.data);
        this.setState({ user: res.data[0] });
        
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

// };

  render() {
    return (
      <div className="main">
        <div>Info about user {this.state.user.name}</div>
        <div>Meals created: {this.state.user.meals_created}</div>
        <div>Rate {this.state.user.rate}/100</div>
      </div>
    );
  }
}


export default connect(
)(withRouter(ShowUser));
