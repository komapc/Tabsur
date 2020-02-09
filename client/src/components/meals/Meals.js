import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';

class Meals extends Component {


  constructor(props) {
    super(props);
    this.state = {
      meals: []
    };
  }

    DataTable() {
    //var p = getMeals();
    var p =  axios.get("../api/meals/get");
    /*return p.map( (res, i) => {
      return <div obj={res} key={i} />;
    });*/
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
              <b>Hey there,</b> {user.name}
              <div className="flow-text grey-text text-darken-1">
                List of meals
                 {this.state.meals.map(meal =>
                  <div key={meal._id}>
                  <span> {meal.mealName}</span>
                  <span> {meal.dateCreated}</span>
                  </div>
                )}
              </div>
              {this.DataTable()}
            </h4>
          </div>
        </div>
      </div>
    );
  }
}

Meals.propTypes = {
  //logoutUser: PropTypes.func.isRequired,
  //auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
 
});

export default connect(
  mapStateToProps,
  { getMeals }
)(Meals);
