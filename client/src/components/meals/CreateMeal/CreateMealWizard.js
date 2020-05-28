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
import StepWizard from 'react-step-wizard';
import { connect } from "react-redux";
import { addMeal } from "../../../actions/mealActions";
import axios from "axios";
import { GET_ERRORS, USER_LOADING } from "../../../actions/types";
import config from "../../../config";

const CreateMealWizard = ({ auth, dispatch }) => {
  const formatedDate = new Date() + 86400000;
  const history = useHistory();
  const [state, updateState] = useState({
    form: {
      name: auth.user.name + "'s meal",
      description: "",
      date: formatedDate,
      time: formatedDate,
      address: "",
      location: "",
      host_id: auth.user.id,
      guestCount: 3,
      image_path: "#RANDOM"
    },
    transitions: {
    },
    history: history,
    dispatch: dispatch,
    selectedDate: new Date(Date.now() + 86400000)
  });

  const addMealInternal = (userData, history) => {
    console.log("Adding meal");
    axios
      .post(`${config.SERVER_HOST}/api/meals/`, userData)
      .then(res => {
        const meal_id = res.data[0].id;
        console.log(`meal added: ${JSON.stringify(meal_id)}`);
        userData.meal_id = res.meal_id;
        userData.meal_id = meal_id;
        axios.post(`${config.SERVER_HOST}/api/meals/image/`, userData)
          .then(res2 => {
            console.log(`add image: [${JSON.stringify(res2)}]`);
            history.push("/MyMeals");
          })
      })
      .catch(err => {
        console.log(`Error in addMeal: ${JSON.stringify(err)}`);
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      }
      );
  };

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
    var summedDate = new Date(state.form.date);
    summedDate.setHours(state.form.time.getHours());
    summedDate.setMinutes(state.form.time.getMinutes());
    const formatedDate = new Date(summedDate).getTime();
    const newMeal = {
      name: state.form.name,
      description: state.form.description,
      date: formatedDate,
      address: state.form.address,
      location: state.form.location,
      host_id: auth.user.id,
      guestCount: state.form.guestCount,
      image_path: "#RANDOM"
    };
    console.log(JSON.stringify(newMeal));
    //addMeal(newMeal, state.history);debugger;
    addMealInternal(newMeal, state.history);

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
    <div className='container'>
      {SW && <TopHeader SW={SW} />}
      <div className='col-12 col-sm-6 offset-sm-3'>
        <div className="wizard-middle">
          <StepWizard
            onStepChange={onStepChange}
            transitions={state.transitions}
            instance={setInstance}>
            <NameStep update={update} form={state.form} />
            <LocationStep update={update} form={state.form} />
            <TimeStep update={update} form={state.form} />
            <GuestStep update={update} form={state.form} />
            <ImageStep update={update} form={state.form} />
          </StepWizard>
        </div>
      </div>
      {(SW) ? <Navigator SW={SW} submit={submit} /> : <div>Error</div>}
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
      <div className="wizard-progress-container">
        <img src={stepIcons[SW.state.activeStep]} alt={SW.step} className="wizard-icon" /></div>
    </Fragment>)
}

const Navigator = ({ SW, submit }) => {
  const last = SW.state.activeStep < 4;
  const first = SW.state.activeStep > 0;
  return <div className="wizard-bottom">
    {first ?
      <img src={wizard_back} alt="next"
        className={'wizard-bottom-prev'} onClick={SW.previousStep} /> : ""}
    {last ?
      <img src={wizard_next} alt="next"
        className={'wizard-bottom-next'} onClick={SW.nextStep} /> :
      <img src={wizard_done} alt="submit"
        className={'wizard-bottom-last'} onClick={submit} />
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

function mapDispatchToProps(dispatch) {
  return {
    addMealProp: (form, history) => dispatch(addMeal(form, history))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMealWizard);