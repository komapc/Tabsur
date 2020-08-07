import React, { Fragment, useState } from 'react';
import { useHistory } from "react-router-dom";
import TimeStep from './TimeStep';
import NameStep from './NameStep';
import LocationStep from './LocationStep';
import GuestStep from './GuestStep';
import ImageStep from './ImageStep';

import PropTypes from "prop-types";
import backArrowIcon from "../../../resources/back_arrow.svg"
import imageStep1 from "../../../resources/wizard/wizard_1.svg";
import imageStep2 from "../../../resources/wizard/wizard_2.svg";
import imageStep3 from "../../../resources/wizard/wizard_3.svg";
import imageStep4 from "../../../resources/wizard/wizard_4.svg";
import imageStep5 from "../../../resources/wizard/wizard_5.svg";
import wizard_time from "../../../resources/wizard/wizard_time.svg";
import wizard_back from "../../../resources/wizard/wizard_back.svg";
import wizard_date from "../../../resources/wizard/wizard_date.svg";
import wizard_location from "../../../resources/wizard/wizard_location.svg";
import wizard_meal_name from "../../../resources/wizard/wizard_meal_name.svg";
import wizard_next from "../../../resources/wizard/wizard_next.svg";
import wizard_done from "../../../resources/wizard/wizard_done.svg";
import wizard_loading from "../../../resources/animation/loading.gif";
import StepWizard from 'react-step-wizard';
import { connect } from "react-redux";
import { addMeal } from "../../../actions/mealActions";
const CreateMealWizard = ({ auth, addMeal }, ...props) => {
 
  const formatedDate = new Date(Date.now() + 86400000);
  const history = useHistory();

  if (!auth.isAuthenticated)
  {
    history.push({pathname:'/login'})
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
    uploadingState : false
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
  const backToList = () => {
    history.push({pathname:'/',  hash: 0 })
  }
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
    addMeal(newMeal, ()=>{
      history.push({pathname:'/',  hash: '#2' });
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

  const setUploadingState = (newUploadingState) =>
  {
    updateState({...state, uploadingState:newUploadingState});
  }
  const { SW } = state;

  return (
    <div >
      {SW && <TopHeader onExit={backToList} SW={SW} />}

      {SW && <Navigator SW={SW} submit={submit} uploadingState = {state.uploadingState}/>}
      <div className='col-12 col-sm-6 offset-sm-3'>
        <div className="wizard-middle">
          <StepWizard
            style={{ alignItems: 'flex-end', width: 200 }}
            onStepChange={onStepChange}
            transitions={state.transitions}
            instance={setInstance}>
            <NameStep update={update} form={state.form} />
            <LocationStep update={update} form={state.form} />
            <TimeStep update={update} form={state.form} />
            <GuestStep update={update} form={state.form} />
            <ImageStep update={update} form={state.form} auth={state.auth} setUploadingState={setUploadingState}/>
          </StepWizard>
        </div>
      </div>
    </div>
  );
};


const TopHeader = ({ SW, onExit }) => {
  const images = [imageStep1, imageStep2, imageStep3, imageStep4, imageStep5];
  const stepIcons = [wizard_meal_name, wizard_time, wizard_date, wizard_location, wizard_location]
  return (
    <Fragment>
      <img onClick={onExit}
        className="autocomplete-icon" src={backArrowIcon} alt="back" />
      <h4 className="wizard-caption">Create Meal</h4>
      <div className="wizard-progress-container">
        <img src={images[SW.state.activeStep]} alt={SW.step} className="wizard-progress" /></div>

    </Fragment>)
}

const Navigator = ({ SW, submit, uploadingState }) => {
  const last = SW.state.activeStep < 4;
  const first = SW.state.activeStep > 0;
  return <div className="wizard-bottom">
    {first ?
      <img src={wizard_back} alt="next"
        className={'wizard-bottom-prev'} onClick={SW.previousStep} /> :
      <span className={'wizard-bottom-prev'} />}
    {last ?
      <img src={wizard_next} alt="next"
        className={'wizard-bottom-next'} onClick={SW.nextStep} /> :
      <img src={uploadingState?wizard_loading:wizard_done} 
        alt="submit"
        className={'wizard-bottom-last'} onClick={uploadingState?()=>{}:submit} />
    }
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