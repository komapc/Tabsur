import React, { useState, useEffect } from "react";
import { getUserFollowies, getUserFollowers  } from "../../actions/userActions"
import Box from '@material-ui/core/Box';

import Friend from './Friend';

//list of friends
const FriendList = (props) => {
  console.log(`FL props: ${JSON.stringify(props)}`);
  
  return <Box borderRadius="17px" borderColor="black" border="solid 1px">
    {props.list.map(friend => {
      return <Friend key={friend.id} name={friend.name} />
    })
    }
  </Box>
}
const Friends = (props) => {
  const [followies, setFollowies] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    console.log(`useEffect called ${props.id}.`);
    getUserFollowies(props.id)
      .then(res => {
        const data = res.data;
        console.log(`Data: ${JSON.stringify(data)}`);
        setFollowies(data);

      })
      .catch(err => {
        console.error(err);
      });
  
  getUserFollowers(props.id)
      .then(res => {
        const data = res.data;
        console.log(`Data: ${JSON.stringify(data)}`);
        setFollowers(data);

      })
      .catch(err => {
        console.error(err);
      });
    }, []);


  return <>
    <h3>FOLLOWING</h3>
    <FriendList id={props.id} list={followies}/>
    <h3>FOLLOWERS</h3>
    <FriendList id={props.id}  list={followers}/>
  </>
}


export default Friends;