import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';
import {Link} from 'react-router-dom';
import MealListItem from "./MealListItem";

class MyMeals extends Component {


    constructor(props) {
        super(props);
        this.state = {
            meals: []
    };
    axios.get('/api/meals/get_my/' +  this.props.auth.user.id)
        .then(res => {
        console.log(res);
        this.setState({ meals: res.data });
    });
  
  }

  render() {
    const { user } = this.props.auth;
    
    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy ">
            <h4>
              Hey {user.name}, 
              your meals list:
            </h4>
          </div>
          <div>
            <div className="flow-text grey-text text-darken-1">
                {this.state.meals.map(meal =>
                    <div key={meal._id}>
                        <div key={meal._id}>
                            <MealListItem meal={meal} />
                        </div>
                </div>
                )}
            </div >
          </div>
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
)(MyMeals);
