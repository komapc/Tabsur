import React from "react";
import { Link } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';


import CardHeader from '@material-ui/core/CardHeader';

//one item of the list
const Friend = (props) => {
  return <div 
    style={{ width: '100%', borderBottomColor: 'lightgray', borderBottomWidth: '1px', borderBlockEndStyle: 'solid' }}>
     <Link to={`user/${props.user_id}`} >
      <CardHeader
        avatar={<Avatar aria-label="recipe" style={{ backgroundColor: '#13A049' }}>
          {props.name[0].toUpperCase()}
        </Avatar>}
        title={props.name}>
      </CardHeader>
       </Link> 
     </div>
}

export default Friend;