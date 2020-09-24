import React, { useState, useEffect } from "react";
import Avatar from '@material-ui/core/Avatar';
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

export default Friend;