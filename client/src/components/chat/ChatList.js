import React, { Component } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import ChatListItem from "./ChatListItem";

import loadingGIF from "../../resources/animation/loading.gif";
class ChatList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      loading: true,
      id: this.props.auth.user.id || -1
    };
  }

  componentDidMount() {
    getMeals(this.props.auth.user.id)
    .then(res => {
          console.log(res.data);
          this.setState({ meals: res.data, loading: false });
        })
  };
  render() {
    return (
      <div className="main">
        CHAT
        {/* <div className="row">
          {
            this.state.loading ?
              <img src={loadingGIF} alt="loading" /> :
              <div className="map-meal-info">
                {this.state.meals.map(meal =>
                  <div key={meal.id}>
                    <ChatListItem meal={meal} />
                  </div>
                )}
              </div>}
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,

});
const mapDispatchToProps = (dispatch) => ({
  getMeals: (form, history) => getMeals(form, history)(dispatch)
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(ChatList);
