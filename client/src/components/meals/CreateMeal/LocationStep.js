
import React, { useState, useEffect } from 'react';

const LocationStep = props => {

  const update = (e) => {
    props.update(e.target);
  };

  return (
    <div className="wizard-container">

      <label>Location</label>
      <input type='text' className='form-control' id="location"
        onChange={update} />
    </div>
  );
};
export default LocationStep;
