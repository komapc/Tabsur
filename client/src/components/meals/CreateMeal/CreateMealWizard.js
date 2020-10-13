import React, { Fragment, useState } from 'react';
import { useHistory } from "react-router-dom";
import NameStep from './NameStep';
import LocationStep from './LocationStep';
import DescriptionStep from './DescriptionStep';
import ImageStep from './ImageStep';

import PropTypes from "prop-types";
import imageStep1 from "../../../resources/wizard/wizard_1.svg";
import imageStep2 from "../../../resources/wizard/wizard_2.svg";
import imageStep3 from "../../../resources/wizard/wizard_3.svg";
import imageStep4 from "../../../resources/wizard/wizard_4.svg";
import Button from '@material-ui/core/Button';

import StepWizard from 'react-step-wizard';
import { connect } from "react-redux";
import { addMeal } from "../../../actions/mealActions";
import BackBarMui from "../../layout/BackBarMui";

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const CreateMealWizard = ({ auth, addMeal }, ...props) => {

  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: '#ffff00',
      },
      primary: {
        main: '#010101',
      },
    },
  });

  const formatedDate = new Date(Date.now() + 86400000);
  const history = useHistory();

  if (!auth.isAuthenticated) {
    history.push({ pathname: '/login' })
  }
  const [state, updateState] = useState({
    form: {
      name: `${auth.user.name}'s meal`,
      description: "",
      date: formatedDate,
      time: formatedDate,
      address: "",
      location: "",
      host_id: auth.user.id,
      guestCount: 3,
      image_id: -1,
    },
    transitions: {
    },
    history: history,
    uploadingState: false
  });

  const setInstance = SW => updateState({
    ...state,
    SW,
  });

  const onStepChange = (stats) => {
    updateState({
      ...state,
      SW
    });
  };

  const submit = (e) => {
    e.preventDefault();
    let summedDate = new Date(state.form.date);
    summedDate.setHours(state.form.time.getHours());
    summedDate.setMinutes(state.form.time.getMinutes());
    const formattedDate = new Date(summedDate).getTime();
    const newMeal = {
      name: state.form.name,
      description: state.form.description,
      date: formattedDate,
      address: state.form.address,
      location: state.form.location,
      host_id: auth.user.id,
      guestCount: state.form.guestCount,
      image_id: state.form.image_id ? state.form.image_id : -2
    };
    console.log(JSON.stringify(newMeal));
    return addMeal(newMeal, () => {
      history.push({ pathname: '/', hash: '#2' });
    });
  }
  const update = (e) => {
    const { form } = state;

    form[e.id] = e.value;
    updateState({
      ...state,
      form,
    });
  };

  const setUploadingState = (newUploadingState) => {
    updateState({ ...state, uploadingState: newUploadingState });
  }
  const { SW } = state;

  return (
    <ThemeProvider theme={theme}>
      
      <h4 className="wizard-caption">Create Meal</h4>
      <BackBarMui history={history} />
       
      <div style={{ width: "100vw", overflow: "scroll" }}>

        <div className='col-12 col-sm-6 offset-sm-3'>
          <div className="wizard-middle">
            <StepWizard
              style={{ alignItems: 'flex-end' }}
              onStepChange={onStepChange}
              transitions={state.transitions}
              instance={setInstance}>
              <NameStep update={update} form={state.form} />
              <LocationStep update={update} form={state.form} />
              <DescriptionStep update={update} form={state.form} />
              <ImageStep update={update} form={state.form} auth={state.auth} setUploadingState={setUploadingState} />
            </StepWizard>
          </div>
        </div>

        {SW && <Navigator SW={SW} submit={submit} uploadingState={state.uploadingState} />}
      </div>
    </ThemeProvider>
  );
};


const Progress = ({ SW }) => {
  const images = [imageStep1, imageStep2, imageStep3, imageStep4];
  return (
    <Fragment style={{textAlign:"center"}}>
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

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
CreateMealWizard.propTypes = {
  addMeal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  addMeal: (form, history) => addMeal(form, history)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateMealWizard);