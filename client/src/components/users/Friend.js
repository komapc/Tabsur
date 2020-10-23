import React from "react";
import Avatar from "../layout/Avatar"
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
        avatar={<Avatar class="list" user={{name: props.name, id: props.user_id}}/>}
        title={props.name}>
      </CardHeader>
  </div>
}

export default Friend;