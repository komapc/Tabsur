import React from 'react';
import { 
  TextField, 
  Box, 
  Grid
} from '@mui/material';

const NameStep = props => {
  const update = (e) => {
    props.update(e.target);
  };

  return (
    <div className="wizard-container row ">
      <h3 style={{ marginLeft: "40px" }}>Meal Details</h3>
      <Grid container spacing={1}>
        <Box m={2} width="1">
          <TextField variant="outlined"
            className='wizard-description  justify-content-center' id="name"
            onChange={update} value={props.form.name} label="Meal Name" />

        </Box >

        <Box m={2} width="1">
          <TextField variant="outlined" width="1"
            className='wizard-description  justify-content-center'
            onChange={update}
            value={props.form.guest_count}
            error={props.form.guest_count === ""}
            type="Number"
            id="guest_count"
            label="Guest Count"
            placeholder="Guest Count"
            helperText={props.form.guest_count < 0 || props.form.guest_count > 100 ? "Wrong number" : ""}
          />
        </Box >
      </Grid>
    </div>
  );
};
export default NameStep;
