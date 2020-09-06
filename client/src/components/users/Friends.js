import React, { useState, useEffect } from "react";
import { getUserFollowees } from "../../actions/userActions"

import config from "../../config";

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
         return <div key={friend.id}>
           {friend.name}
         </div>
        })
      }
    </>
}
export default Friends;