import React, { Fragment, useState, useEffect } from 'react';
import backArrowIcon from "../../resources/back_arrow.svg"
import imageStep1 from "../../resources/wizard/wizard_1.svg";
import imageStep2 from "../../resources/wizard/wizard_2.svg";
import imageStep3 from "../../resources/wizard/wizard_3.svg";
import imageStep4 from "../../resources/wizard/wizard_4.svg";
import imageStep5 from "../../resources/wizard/wizard_5.svg";

import StepWizard from 'react-step-wizard';
const CreateMealWizard = () => {
  const [state, updateState] = useState({
    form: {}
  });

  const setInstance = SW => updateState({
    ...state,
    SW,
  });
  const submit =(e)=>
  {
    alert(JSON.stringify(this.props));
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
    <div className='main container'>
      {SW && <TopHeader SW={SW} />}
      <div>
        <div className='row'>
          <div className={`col-12 col-sm-6 offset-sm-3 }`}>
            <StepWizard
              transitions={state.transitions}
              instance={setInstance}
            >
              <NameStep  update={update} />
              <LocationStep update={update} />
              <TimeStep update={update} />
              <GuestStep update={update} /> 
            </StepWizard>
          </div>
        </div>
      </div>
      {(SW) ? <Navigator SW={SW} />:<div>Error</div>}
    </div>
  );
};

export default CreateMealWizard;

const TopHeader = ({ SW, onExit }) => (
  <Fragment>
    <img onClick={onExit}
      className="autocomplete-icon" src={backArrowIcon} alt="back" />
    <h4 class="wizard-caption">Create Meal</h4>
    <div class="wizard-progress-container"><img src={imageStep1} alt={SW.step} class="wizard-progress"/></div>
     </Fragment>
);

const Navigator = ({ SW, onExit }) => (
  <Fragment>
   <button className={'btn btn-secondary'} onClick={SW.previousStep}>Prev</button>
        &nbsp;
    <button className={'btn btn-secondary'} onClick={SW.nextStep}>Next</button>
  </Fragment>
);

/** Steps */
const NameStep = props => {
  const update = (e) => {
     props.update(e.target);
  }
  return (
    <div>
      <label>Meal Name</label>
      <input type='text' className='form-control' id="name"
        onChange={update} /> 

      <label>Description</label>
      <input type='text' className='form-control' id="descripion"
        onChange={update} />
    </div>
  );
};
const LocationStep = props => {
  const update = (e) => {
    props.update(e.target);
  };

  return (
    <div>
      <h3 className='text-center  '>Location</h3>

      <label>Location</label>
      <input type='text' className='form-control'
        onChange={update} />
    </div>
  );
};


const GuestStep = props => {
  const update = (e) => {
    props.update(e.target.name, e.target.value);
  };

  return (
    <div>
      <h3 className='text-center'>Number of guests</h3>

      <label>Number of guests</label>
      <input type='text' className='form-control'
        onChange={(e)=>{this.props.update(e)}} />
      <button onClick={(e)=>{this.props.submit(e)}}>submit</button>
    </div>
  );
};

const TimeStep = props => {
  const update = (e) => {
    props.update(e.target.name, e.target.value);
  };

  return (
    <div>
      <h3 className='text-center'>Time and Date</h3>

      <label>Time and Date</label>
      <input type='text' className='form-control'
        onChange={update} />
    </div>
  );
};