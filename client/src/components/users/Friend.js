import React from "react";
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from 'react-router-dom';
import CardHeader from '@material-ui/core/CardHeader';

//one item of the list
const Friend = (props) => {
  const history = useHistory();
  const handleClick = () => {
    history.push(`user/${props.user_id}`);
  };
  return <div
    style={{ width: '100%', borderBottomColor: 'lightgray', borderBottomWidth: '1px', borderBlockEndStyle: 'solid' }}>
      <CardHeader onClick={handleClick}
        avatar={<Avatar aria-label="recipe" style={{ 
          backgroundColor: 'yellow', 
          color: 'Black',
          border: "solid",
          borderColor: "Black",
          borderWidth: "1px"}}>
          {props.name[0].toUpperCase()}
        </Avatar>}
        title={props.name}>
      </CardHeader>
  </div>
}

export default Friend;