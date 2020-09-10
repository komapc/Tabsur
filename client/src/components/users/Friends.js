import React, { useState, useEffect } from "react";
import { getUserFollowies, getUserFollowers } from "../../actions/userActions"
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';

import CardHeader from '@material-ui/core/CardHeader';

//one item of the list
const Friend = (props) => {
  return <div
    style={{ width: '100%', borderBottomColor: 'lightgray', borderBottomWidth: '1px', borderBlockEndStyle: 'solid' }}>
    <CardHeader key={props.key}
      avatar={<Avatar aria-label="recipe" style={{ backgroundColor: '#13A049' }}>
        {props.name[0].toUpperCase()}
      </Avatar>}
      title={props.name}>
    </CardHeader>
  </div>
}

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
    <h1>FOLLOWING</h1>
    <FriendList id={props.id} list={followies}/>
    <h1>FOLLOWERS</h1>
    <FriendList id={props.id}  list={followers}/>
  </>
}


export default Friends;