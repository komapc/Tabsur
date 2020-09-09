import React, { useState, useEffect } from "react";
import { getUserFollowees } from "../../actions/userActions"

import config from "../../config";

const Friend = (props) => {
  return <div key={props.key}>
  {props.name}
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

  
  return <>
     {friends.map(friend => {
         return <Friend key={friend.id}  name={friend.name}/>
        })
      }
    </>
}
export default Friends;