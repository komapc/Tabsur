
import React, { useState, useEffect } from 'react';

const NameStep = props => {

  const [state, updateState] = useState({
  });

  const update = (e) => {
    props.update(  e.target );
  };


  return (
    <div className="wizard-container">
    
        <label>Meal Name</label>
        <input type='text' className='form-control' id="name"
          onChange={update} value={props.mealName}/>

        <label>Description</label>
        <input type='text' className='form-control' id="description"
          onChange={update} value={props.description}/>
      </div>
  );
};
export default NameStep;
