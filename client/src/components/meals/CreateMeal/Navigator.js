import React, { Fragment, useState } from 'react';

import imageStep1 from "../../../resources/wizard/wizard_1.svg";
import imageStep2 from "../../../resources/wizard/wizard_2.svg";
import imageStep3 from "../../../resources/wizard/wizard_3.svg";
import imageStep4 from "../../../resources/wizard/wizard_4.svg";
import Button from '@material-ui/core/Button';

const Progress = ({ SW }) => {
  const images = [imageStep1, imageStep2, imageStep3, imageStep4];
  return (
    <Fragment style={{ textAlign: "center" }}>
      <img src={images[SW.state.activeStep]}
        alt={SW.step} className="wizard-progress" />

    </Fragment>)
}

const Navigator = ({ SW, submit, uploadingState }) => {
  const last = SW.state.activeStep >= 3;
  const first = SW.state.activeStep > 0;
  return <div style={{ textAlign: "center" }} className="wizard-progress-container">
    <Progress SW={SW} />
    <Button variant="contained" color="primary"
      onClick={SW.previousStep} disabled={!first}>Back</Button>
    <Button variant="contained" color="secondary"
      onClick={last ? submit : SW.nextStep}
      disabled={uploadingState}>
      {last ? (uploadingState ? "Wait" : "Done") : "Next"}
    </Button>
  </div>
}

export default Navigator;