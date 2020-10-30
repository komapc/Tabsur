//currently this file is not used.
import React, { Component } from "react";
import { connect } from "react-redux";
import { joinMeal, getAttendByMeal, getMyMeals } from "../../actions/mealActions";
import { Link } from 'react-router-dom';

// info about meal + attend option
class Attend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meal_id: this.props.match.params.id,
      meal: {
        location: { lng: 0, lat: 0 },
        address: '',
        guest_count: 0,
      },
      attends: []
    };

    getMyMeals(this.props.auth.user.id)
      .then(res => {
        this.setState({ meal: res.data })
      })
      
      .catch(err => {
        console.error(`getMyMeals failed: ${err}`);
      });;

    getAttendByMeal(this.state.meal)
      .then(res => {
        this.setState({ attends: res.data })
      })
      .catch(err => {
        console.error(`getAttendByMeal failed: ${err}`);
      });
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
    console.log(this.state.meal)
    return (
      <div className="main">
        <div className="row">
          <form onSubmit={this.onSubmit}>
            <div className="landing-copy ">
              <h4>
                Hey {user.name}
                <br />
              </h4>
              Meal info:
              <div>Do you want to attend <b>{this.state.meal.name}</b>? </div>
              <div>It is hosted by <Link to={"/Profile/" + this.state.meal.host}> {this.state.meal.host}</Link> </div>
              <div> today at <b> {this.state.meal.time}</b> </div>
              <div> Guest count <b> {this.state.meal.guest_count}</b> </div>
              <div>at {this.state.meal.address}</div>
              {/* <div>at {this.state.meal.location.lng}, {this.state.meal.location.lat} (see map) </div> */}
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
              className="button btn-large waves-effect waves-light hoverable accent-3"
            >
              Join this meal
          </button>
            <button type="submit"
              onClick={this.props.history.goBack}
              className="button btn-large waves-effect waves-light hoverable accent-3"
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
  attends: getAttendByMeal(state.meal)
});

export default connect(
  mapStateToProps,
  { joinMeal, getAttendByMeal }
)(Attend);
