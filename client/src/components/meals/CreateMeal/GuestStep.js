
import React, { useState, useEffect } from 'react';

const NameStep = props => {

  const [state, updateState] = useState({
  });

  const update = (e) => {
    props.update(  e.target );
  };


  return (
    <div className="wizard-container">
    
        <label>Number of guests</label>
        
        <input type='number' className='form-control' id="guests"
          onChange={update} value={props.guests}/>
      </div>
  );
};
export default NameStep;
