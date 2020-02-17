import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { joinMeal, getAttendByMeal } from "../../actions/mealActions";
import axios from 'axios';
import { useHistory, withRouter } from 'react-router-dom';
import {BrowserRouter} from 'react-router';

// info about meal + attend option
class Attend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meal_id: this.props.match.params.id,
            meal: [],
            attends: []
        };
               axios.get("/api/attends/meal/" + this.state.meal_id)
       .then(res => 
       {
            this.setState({ attends: res.data })
       })
    }


    onSubmit = e => {
        e.preventDefault();

        const newAttend = {
          meal_id: this.state.meal_id,
          user_id: this.props.auth.user.id,
          user_name: this.props.auth.user.name,
        };
        this.props.joinMeal(newAttend, this.props.history);
    };

  render() {
    const { user } = this.props.auth;
    //const {meal_id}= this.state.meal_id;
    return (
      <div className="container valign-wrapper">
        <div className="row">
        <form  onSubmit={this.onSubmit}>
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

          <div> List of people who attended
           {this.state.attends.map(attend =>
                    <div key={attend._id}   >
                        <div>
                            <span className="mealName" > {attend.user_name || attend.user_id || "x"}</span>
                        </div>
                    </div>
              )}



          </div>
          <button
              onClick={this.joinMeal}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                 Join this meal
          </button>
          <button type="submit"
          onClick={this.props.history.goBack}
          className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              back to list
            </button>
            </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  attends: getAttendByMeal(state.meal_id)
});

export default connect(
  mapStateToProps,
  { joinMeal, getAttendByMeal }
)(Attend);
