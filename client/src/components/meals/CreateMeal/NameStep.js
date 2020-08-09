import React from 'react';
import { TextField, Grid, Box } from '@material-ui/core';
const NameStep = props => {
  const update = (e) => {
    props.update(e.target);
  };

  return (
    <div className="wizard-container row ">

      <Grid container spacing={4}>
        <Box  item  m={2} p={3}>
          <TextField
            className='wizard-description  justify-content-center' id="name" row
            onChange={update} value={props.form.name} label="Meal Name" />

        </Box >
        <Box  item  m={2} p={3}>
          <TextField className='wizard-description' id="description" row 
            onChange={update} value={props.form.description}
            placeholder="Describe the meal" label="Description" />
        </Box >
      </Grid>
    </div>

  );
};
export default NameStep;
