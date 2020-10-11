import { TextField, Grid, Box } from '@material-ui/core';
import React from 'react';

const DescriptionStep = props => {

  const update = (e) => {
    props.update(e.target);
  };

  return (
    <div className='row'>

      <Grid container spacing={2}>
      <h3 style={{marginLeft:"40px"}}>Description</h3>
        <Box m={2} p={2} width={1}>
          <TextField className='wizard-description' id="description" variant="outlined"
          multiline
          rows={4}
          rowsMax={6}
            onChange={update} value={props.form.description}
            placeholder="Describe the meal" label="Description" />
        </Box >
      </Grid>
    </div>
  );
};
export default DescriptionStep;
