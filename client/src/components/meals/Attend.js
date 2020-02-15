import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import axios from 'axios';
import { useHistory, withRouter } from 'react-router-dom';
import {BrowserRouter} from 'react-router';

class Attend extends Component {
    constructor(props) {
        super(props);
        this.state = {
          meal_id: this.props.match.params.id
    };
  }

  componentDidMount() {
    axios.get('/api/attends/get/' +this.props.match.params.id)
      .then(res => {
        console.log(res);
        this.setState({ meals: res.data });
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
              Meal info:  ({this.state.meal_id}) 
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
}

const mapStateToProps = state => ({
  auth: state.auth,
 
});

export default connect(
  mapStateToProps,
  { getMeals }
)(Attend);
