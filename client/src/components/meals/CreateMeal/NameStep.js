import React from 'react';
import { TextField, Grid, Box } from '@material-ui/core';
const NameStep = props => {
  const update = (e) => {
    props.update(e.target);
  };

  return (
    <div className="wizard-container row ">

      <Grid container spacing={4}>
        <Box m={2} p={1}>
          <TextField variant="outlined"
            className='wizard-description  justify-content-center' id="name"
            onChange={update} value={props.form.name} label="Meal Name" />

        </Box >
        <Box m={2} p={1}>
          <TextField className='wizard-description' id="description"  variant="outlined" 
            onChange={update} value={props.form.description}
            placeholder="Describe the meal" label="Description" />
        </Box >
        <Box m={2} p={1} >
        <TextField variant="outlined"
        width={1}
          onChange={update}
          value={props.form.guestCount}
          error={props.form.guestCount === ""}
          type="Number"
          id="guestCount"
          label="Guest Count"
          placeholder="Guest Count"
          helperText={props.form.guestCount < 0 || props.form.guestCount > 100 ? "Wrong number" : ""}
        />
      </Box >
      </Grid>
    </div>

  );
};
export default NameStep;
