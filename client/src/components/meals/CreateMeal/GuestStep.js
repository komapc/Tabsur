
import React from 'react';

const NameStep = props => {

  const update = (e) => {
    props.update(  e.target );
  };


  return (
    <span className="location-input-field input-field col s12 ">
    <div className="wizard-container">
        <label>Number of guests</label>
        
        <input type='number' className='form-control' id="guestCount"
        onChange={update} value={props.form.guestCount} />
      </div>
        </span>
  );
};
export default NameStep;
