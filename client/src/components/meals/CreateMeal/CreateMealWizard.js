import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import NameStep from './NameStep';
import LocationStep from './LocationStep';
import DescriptionStep from './DescriptionStep';
import ImageStep from './ImageStep';

import PropTypes from "prop-types";
import Navigator from "./Navigator";
import StepWizard from 'react-step-wizard';
import { connect } from "react-redux";
import { addMeal } from "../../../actions/mealActions";
import BackBarMui from "../../layout/BackBarMui";

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
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
        <Box p={2}>
            <StepWizard
              onStepChange={onStepChange}
              transitions={state.transitions}
              instance={setInstance}>
              <NameStep update={update} form={state.form} />
              <LocationStep update={update} form={state.form} />
              <DescriptionStep update={update} form={state.form} />
              <ImageStep update={update} form={state.form} auth={state.auth} setUploadingState={setUploadingState} />
            </StepWizard>
        </Box>

        {SW && <Navigator SW={SW} submit={submit} uploadingState={state.uploadingState} />}
     </ThemeProvider>
  );
};

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