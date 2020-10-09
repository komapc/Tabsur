import { TextField, Grid, Box } from '@material-ui/core';
import React from 'react';

const DescriptionStep = props => {

  const update = (e) => {
    props.update(e.target);
  };

  return (
    <div className='row'>

      <Grid container spacing={2}>
        <Box m={2} p={2} width={1}>
          <TextField className='wizard-description' id="description" variant="outlined"
            onChange={update} value={props.form.description}
            placeholder="Describe the meal" label="Description" />
        </Box >
      </Grid>
    </div>
  );
};
export default DescriptionStep;
