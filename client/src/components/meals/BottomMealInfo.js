import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import MealListItem from "./MealListItem";
class BottomMealInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      meal: this.props.meal,
      auth: this.props.auth
    };
  }

  componentDidUpdate(prevProps) {
    if(prevProps.meal !== this.props.meal) {
      this.setState({meal: this.props.meal});
    }
  }

  render() {
    const meal = this.state.meal;
    if (typeof meal === 'undefined')
    {
      return <div>Nothing is selected</div>
    } 
    return (
      <div className="meal_props" onClick={this.handleAttend}>
        <MealListItem  meal={meal} />
      </div>
    )
  };
}
const mapStateToProps = state => ({
  auth: state.auth,

});

export default withRouter(connect(mapStateToProps)(BottomMealInfo));
