import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import { getMeals } from "../../actions/mealActions";
import axios from 'axios';
import { useHistory, withRouter } from 'react-router-dom';
import {BrowserRouter} from 'react-router';

// info about meal + attend option
class Attend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meal_id: this.props.match.params.id,
            meal: []
        };
        axios.get('/api/meals/get/' +this.props.match.params.id)
          .then(res => {
            console.log(res);
            console.log(res.data);
            this.setState({ meal: res.data });
          });
  }
  joinMeal()
  {
      axios.get('/api/meals/get/' +this.props.match.params.id)
          .then(res => {
            console.log(res);
            console.log(res.data);
            this.setState({ meal: res.data });
          });
  }
    
  render() {
    const { user } = this.props.auth;
    //const {meal_id}= this.state.meal_id;
    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy ">
            <h4>
              Hey {user.name}
              <br/>
            </h4>
              Meal info: 
              <div>Do you whant to attend <b>{this.state.meal.mealName}</b>? </div>
              <div>It is hosted by <b> {this.state.meal._id}</b> </div>
              <div> today at <b> {this.state.meal.time}</b> </div>
              <div>at {this.state.meal.place} (see map)  </div>
          </div>
          <div>
          </div>
           <button
          onClick={this.joinMeal}
          className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
             Join this meal
            </button>
          <button
          onClick={this.props.history}
          className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              back to list
            </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
 
});

export default connect(
  mapStateToProps,
 // { getMeals }
)(Attend);
