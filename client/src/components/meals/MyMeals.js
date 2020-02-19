import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';
import {Link} from 'react-router-dom';

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
              Hey {user.name}
            </h4>
          </div>
          <div>
            Here is your meals list:
            <div className="flow-text grey-text text-darken-1">
               {this.state.meals.map(meal =>
                   <div key={meal._id}>
                       <img src={"http://www.catsinsinks.com/cats/rotator.php?"+meal._id} className="meal_image"></img>
                       <div className="meal_props">
                           <span className="mealName" > {meal.mealName}</span>
                           <br/>
                           <span> {new Date(meal.dateCreated).toUTCString()}</span>
                           <br/>
                           <Link to={"/Attend/" + meal._id}> Attend</Link>    
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
