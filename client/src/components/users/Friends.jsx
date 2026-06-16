import React, { useState, useEffect } from "react";
import { getUserFollowies, getUserFollowers } from "../../actions/userActions";
import Box from '@mui/material/Box';

import Friend from './Friend';

//list of friends
const UserList = (props) => {
  console.log(`FL props: ${JSON.stringify(props)}`);

  return <Box borderRadius="17px" borderColor="black" border="solid 1px">
    {props.list.map(friend => {
      return <span key={friend.name}> <Friend  {...friend} /></span>
    })
    }
  </Box>
}
const Friends = (props) => {
  const [followies, setFollowies] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (!props.id || isNaN(props.id)) {
      console.log(`Friends: Invalid or missing ID: ${props.id}`);
      return;
    }
    
    console.log(`Friends: Loading data for user ID: ${props.id}`);
    
    getUserFollowies(props.id)
      .then(res => {
        const data = res.data;
        console.log(`Followies data: ${JSON.stringify(data)}`);
        setFollowies(data);
      })
      .catch(err => {
        console.error('Failed to load followies:', err);
        setFollowies([]);
      });

    getUserFollowers(props.id)
      .then(res => {
        const data = res.data;
        console.log(`Followers data: ${JSON.stringify(data)}`);
        setFollowers(data);
      })
      .catch(err => {
        console.error('Failed to load followers:', err);
        setFollowers([]);
      });
  }, [props.id]);


  if (!props.id || isNaN(props.id)) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>User ID not available</p>
      </div>
    );
  }

  return <>
    <div>FOLLOWING</div>
    <UserList list={followies} />
    <div>FOLLOWERS</div>
    <UserList list={followers} />
  </>
}


export { UserList, Friends};