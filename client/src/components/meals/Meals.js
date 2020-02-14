import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom';
class Meals extends Component {


  constructor(props) {
    super(props);
    this.state = {
      meals: []
    };
  } 
    
  componentDidMount() {
    axios.get('/api/meals/get')
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
              Hey {user.name}
              <ul className="flow-text grey-text text-darken-1">
                List of available meals in your neighborhood:
                 {this.state.meals.map(meal =>
                 <li  key={meal._id} ><span className="mealName" > {meal.mealName}</span>
                  <span> {new Date(meal.dateCreated).toUTCString()}</span>
                  <Link to={"/Attend/" + meal._id}> Attend</Link>
                  </li>
                )}
              </ul>
            </h4>
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
  { getMeals }
)(Meals);
