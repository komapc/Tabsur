import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import MealListItem from "./MealListItem";
class BottomMealInfo extends React.Component {

  constructor(props) {
    super(props);
    console.log("bottom: " + JSON.stringify(props));
    this.state = {
      meal: props.meal
    };
  }

  render() {
    const meal = this.props.meal;
    if (typeof meal === 'undefined')
    {
      return <div>Nothing is selected</div>
    }
    
    return (
      <div className="meal_props" onClick={this.handleAttend}>
        <MealListItem  meal={meal} onAttend={()=>{}}/>
      </div>
    )
  };
}
const mapStateToProps = state => ({
  auth: state.auth,

});

export default withRouter(connect(mapStateToProps)(BottomMealInfo));
