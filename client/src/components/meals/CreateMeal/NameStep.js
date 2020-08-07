import React from 'react';
import { Input, InputLabel, TextField  } from '@material-ui/core';

const NameStep = props => {
  const update = (e) => {
    props.update(e.target);
  };

  return (
    <span className="location-input-field input-field col s12 ">
      <div className="wizard-container">
        <InputLabel>Meal Name</InputLabel>
        <Input type='text' className='form-control' id="name"
          onChange={update} value={props.form.name} />

        <InputLabel>Description</InputLabel>
        <div>
          <TextField  className='wizard-description' id="description"
            onChange={update} value={props.form.description} rows="5"
            placeholder="Describe the meal" />
        </div>
      </div>
    </span>

  );
};
export default NameStep;
