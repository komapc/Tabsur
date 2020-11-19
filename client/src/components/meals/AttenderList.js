import React, { useState, useEffect } from "react";
import { getGuestList } from "../../actions/mealActions";
import { getUserFollowers } from "../../actions/userActions";
import Box from '@material-ui/core/Box';
import { UserList } from '../users/Friends';
//todo: use GuestList component
const AttenderList = (props) => {
  const userId = props.userId;// props.match.params.id;
  const [guests, setGuests] = useState([]);
  const [followies, setfollowies] = useState([]);
  //const [sorted, setSorted] = useState(["Loading"]);

  const getGuests = (mealId) => {
    getGuestList(mealId)
      .then(res => {
        console.log(`mealId: ${mealId}, getGuests: ${res.data}`);
        setGuests(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getFollowies = (userId) => {
    if (!userId) {
      setfollowies([]);
      return;
    }
    getUserFollowers(userId)
      .then(res => {
        console.log(`Followies: ${JSON.stringify(res.data)}`);
        setfollowies(res.data);
      })
      .catch(err => {
        setfollowies([]);
        console.error(err);
      });
  };

  useEffect(() => {
    
    getFollowies(userId);
    getGuests(props.mealId);
  }, [userId, props.mealId]);

  const sorted = guests;
  if ( guests.length === 0)
    return <> </>;
    //todo: use followies and put them first
  return (
    
    <>
      <h3>Guests list</h3>
      <UserList list={sorted} />
    </>
  );
};
export default AttenderList;