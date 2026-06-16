
import React from 'react';
import { TextField, Box } from '@mui/material';
const NameStep = props => {

  const update = (e) => {
    props.update(e.target);
  };


  return (
    <div className="wizard-container">
      <Box m={2} p={2} width={1}>
        <TextField width={1}
          onChange={update}
          value={props.form.guest_count}
          error={props.form.guest_count === ""}
          type="Number"
          id="guest_count"
          label="Guest Count"
          placeholder="Guest Count"
          helperText={props.form.guest_count < 0 || props.form.guest_count > 100 ? "Wrong number" : ""}
        />
      </Box>
    </div>
  );
};
export default NameStep;
