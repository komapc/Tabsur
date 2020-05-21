
import React, { useState, useEffect } from 'react';
const ImageStep = props => {
  const update = (e) => {
    props.update(e.target);
  };

  const submit = (e) => {
    props.submit(e);
  };

  return (
    <div className="wizard-container">
      <label>Upload image</label>
      <input type='text' className='form-control' id="image"
        onChange={(e) => { update(e) }} />
      <button onClick={(e) => { submit(e) }}>submit</button>
    </div>
  );
};
export default ImageStep;
