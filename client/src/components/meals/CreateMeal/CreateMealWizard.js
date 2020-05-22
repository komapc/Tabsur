import React, { Fragment, useState, useEffect } from 'react';
import TimeStep from './TimeStep';
import NameStep from './NameStep';
import LocationStep from './LocationStep';
import GuestStep from './GuestStep';
import ImageStep from './ImageStep';

import backArrowIcon from "../../../resources/back_arrow.svg"
import imageStep1 from "../../../resources/wizard/wizard_1.svg";
import imageStep2 from "../../../resources/wizard/wizard_2.svg";
import imageStep3 from "../../../resources/wizard/wizard_3.svg";
import imageStep4 from "../../../resources/wizard/wizard_4.svg";
import imageStep5 from "../../../resources/wizard/wizard_5.svg";
import wizard_time from "../../../resources/wizard/wizard_time.svg";
import wizard_back from "../../../resources/wizard/wizard_back.svg";
import wizard_back_arrow from "../../../resources/wizard/wizard_back_arrow.svg";
import wizard_date from "../../../resources/wizard/wizard_date.svg";
import wizard_done from "../../../resources/wizard/wizard_done.svg";
import wizard_location from "../../../resources/wizard/wizard_location.svg";
import wizard_meal_name from "../../../resources/wizard/wizard_meal_name.svg";
import wizard_next from "../../../resources/wizard/wizard_next.svg";
import transitions from './transitions.css';
import StepWizard from 'react-step-wizard';
const CreateMealWizard = () => {
  const [state, updateState] = useState({
    form: {},
    transitions: {
    },
    selectedDate: new Date(Date.now() + 86400000)
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
    alert(JSON.stringify(state.form));
    //todo: addMeal
  }
  const update = (e) => {
    const { form } = state;

    form[e.id] = e.value;
    updateState({
      ...state,
      form,
    });
  };

  const { SW } = state;

  return (
    <div className=' container'>
      {SW && <TopHeader SW={SW} />}
      <div className=' col-12 col-sm-6 offset-sm-3'>
        <div className="wizard-middle">
          <StepWizard
            onStepChange={onStepChange}
            transitions={state.transitions}
            instance={setInstance}>
            <NameStep update={update} mealName="My meal" />
            <LocationStep update={update} />
            <TimeStep update={update} form={state.form} />
            <GuestStep update={update} />
            <ImageStep update={update} submit={submit} selectedDate={state.selectedDate} />
          </StepWizard>
        </div>
      </div>
      {(SW) ? <Navigator SW={SW} /> : <div>Error</div>}
    </div>
  );
};

export default CreateMealWizard;

const TopHeader = ({ SW, onExit }) => {
  const images = [imageStep1, imageStep2, imageStep3, imageStep4, imageStep5];
  return (
    <Fragment>
      <img onClick={onExit}
        className="autocomplete-icon" src={backArrowIcon} alt="back" />
      <h4 className="wizard-caption">Create Meal</h4>
      <div className="wizard-progress-container">
        <img src={images[SW.state.activeStep]} alt={SW.step} className="wizard-progress" /></div>
    </Fragment>)
}

const Navigator = ({ SW }) => (
  <div className="wizard-bottom">
    {SW.state.activeStep > 0 ?
      <img src={wizard_back} alt="next"
        className={'wizard-bottom-prev'} onClick={SW.previousStep} /> : ""}
    {SW.state.activeStep < 4 ?
      <img src={wizard_next} alt="next"
        className={'wizard-bottom-next'} onClick={SW.nextStep} /> : ""}
  </div>
);