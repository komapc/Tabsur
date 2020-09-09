import React, { useState, useEffect } from "react";
import { getUserFollowees } from "../../actions/userActions"
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';

import CardHeader from '@material-ui/core/CardHeader';
const Friend = (props) => {
  return <div 
  style={{width: '100%', borderBottomColor: 'lightgray', borderBottomWidth: '1px', borderBlockEndStyle: 'solid'}}>
   <CardHeader key={props.key} 
    avatar={<Avatar aria-label="recipe" style={{backgroundColor: '#13A049'}}>
      {props.name[0].toUpperCase()}
    </Avatar>}
  title={props.name}>
</CardHeader>
</div>
}
const Friends = (props) => {
  const [friends, setFriends] = useState([]);
  
  useEffect(() => {
    console.log(`useEffect called ${props.id}.`);
    getUserFollowees(props.id)
    .then(res => {
      const data = res.data;
      console.log(`Data: ${JSON.stringify(data)}`); 
      setFriends(data);
      
    })
    .catch(err => {
      console.error(err);
    });
  }, []);

  
  return <Box borderRadius="33px" borderColor="black" border="solid 1px">
     {friends.map(friend => {
         return <Friend key={friend.id}  name={friend.name}/>
        })
      }
    </Box>
}
export default Friends;