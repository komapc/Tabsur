import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import config from "../../config";

class Stats extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    axios.get(`${config.SERVER_HOST}/api/users/stats/` + 12345)
      .then(res => {
        console.log(res.data);
        this.setState({ users: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="main">
        <div className="row">
          <div className="map-meal-info">
            <table >
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>followers</th>
                  <th>followies</th>
                  <th>meals_hosted</th>
                </tr>
              </thead>
              <tbody>
                {this.state.users.map(user =>
                  <tr key={user.id}>
                    <td>{user.id} </td>
                    <td>{user.name} </td>
                    <td>{user.followers} </td>
                    <td>{user.followies} </td>
                    <td>{user.meals_hosted} </td>
                  </tr>
                )}
              </tbody>
            </table>
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
)(Stats);
