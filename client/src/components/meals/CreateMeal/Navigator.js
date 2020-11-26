import React from 'react';
import { Grid, Box } from '@material-ui/core';

import imageStep1 from "../../../resources/wizard/wizard_1.svg";
import imageStep2 from "../../../resources/wizard/wizard_2.svg";
import imageStep3 from "../../../resources/wizard/wizard_3.svg";
import imageStep4 from "../../../resources/wizard/wizard_4.svg";
import Button from '@material-ui/core/Button';

const Progress = ({ SW }) => {
  const images = [imageStep1, imageStep2, imageStep3, imageStep4];
  return (
    <img src={images[SW.state.activeStep]}
      alt={SW.step} />)
}

const Navigator = ({ SW, submit, uploadingState }) => {
  const last = SW.state.activeStep >= 3;
  const first = SW.state.activeStep > 0;
  return <Grid container alignItems="center" justify="center">
    <Box >
      <Progress SW={SW} />
    </Box>
    <Box alignItems="center"  justify="center" border>
      <Button variant="contained" color="primary"
        onClick={SW.previousStep} disabled={!first}>Back</Button>
      <Button variant="contained" color="secondary"
        onClick={last ? submit : SW.nextStep}
        disabled={uploadingState}>
        {last ? (uploadingState ? "Wait" : "Done") : "Next"}
      </Button>
    </Box>
  </Grid>
}

export default Navigator;