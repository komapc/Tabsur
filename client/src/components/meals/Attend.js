import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';
import { useHistory, withRouter } from 'react-router-dom';
import {BrowserRouter} from 'react-router';

class Attend extends Component {
    
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
              <br/>
              Meal info 
            </h4>
          </div>
          <button
          onClick={this.props.history.goBack}
          className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              back to list
            </button>
        </div>
      </div>
    );
  }
  debugger;
}

const mapStateToProps = state => ({
  auth: state.auth,
 
});

export default connect(
  mapStateToProps,
  { getMeals }
)(Attend);
