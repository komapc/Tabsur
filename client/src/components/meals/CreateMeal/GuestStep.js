
import React from 'react';
import { TextField, Grid, Box } from '@material-ui/core';
const NameStep = props => {

  const update = (e) => {
    props.update(e.target);
  };


  return (
    <div className="wizard-container">
      <Box item m={2} p={2} width={1} row>
        <TextField row width={1}
          onChange={update}
          value={props.form.guestCount}
          error={props.form.guestCount == ""}
          type="Number"
          id="guestCount"
          label="Guest Count"
          placeholder="Guest Count"
          helperText={props.form.guestCount < 0 || props.form.guestCount > 100 ? "Wrong number" : ""}
        />
      </Box >
    </div>
  );
};
export default NameStep;
