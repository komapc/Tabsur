import React, { Component } from "react";
import { getGuestList } from "../../actions/mealActions";
import { getUserFollowers } from "../../actions/userActions";
import Box from '@material-ui/core/Box';
import Friend from '../users/Friend';
//todo: use GuestList component
class AttenderList extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      guests: [],
      followies: [],
      sorted: ["Loading"], //list of guest with followies first
      userId: this.props ? this.props.userId : props.match.params.id
    };
  }

  getGuests = () => {
    getGuestList(this.props.mealId)
      .then(res => {
        console.log(res.data);
        this.setState({ guests: res.data });
      })
      .catch(err => {
        console.error(err);
      });
  }

  getFollowies = () => {
    const userId = this.state.userId;
    if (!userId)
    {
      this.setState({ followies: [] });
      return;
    }
    getUserFollowers(userId)
      .then(res => {
        console.log(`Followies: ${JSON.stringify(res.data)}`);
        this.setState({ followies: res.data });
      })
      .catch(err => {
        this.setState({ followies: [] });
        console.error(err);
      });
  }
  componentDidMount() {
    this.getFollowies();
    this.getGuests();
  }

  render() {
    let sorted = this.state.guests;
    if ( this.state.guests.length === 0)
      return <> </>;
     
    return (
      <>
        <h3>Guests list</h3>
         {
          sorted.map(guest =>
            <Box key={guest.user_id} m={1}>
              <Friend user_id={guest.user_id} name={guest.name} />
            </Box>
          )
        }
      </>
    );
  }
};
export default AttenderList;