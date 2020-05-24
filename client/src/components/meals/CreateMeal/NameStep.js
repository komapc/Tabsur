
import React, { useState, useEffect } from 'react';

import { TextInput } from 'react';

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
          onChange={update} value={props.form.name}/>

        <label>Description</label>
        <div>
        <textarea className='wizard-description' id="description" 
          onChange={update} value={props.form.description} rows="5"
          placeholder="Describe the meal"/>
        </div>
    </div>
  );
};
export default NameStep;
