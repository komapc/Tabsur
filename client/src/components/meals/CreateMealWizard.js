import React, { Fragment, useState, useEffect } from 'react';
/* eslint react/prop-types: 0 */

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
    //addMeal
  }
  const update = (e) => {
    //alert(JSON.stringify(SW));
    //updateState({ [e.id]: e.value });
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
      <h3>Create Meal </h3>
      {(SW) ? <Navigator SW={SW} />:<div>No SW?</div>}
      <div>
        <div className='row'>
          <div className={`col-12 col-sm-6 offset-sm-3 }`}>
            <StepWizard
              transitions={state.transitions}
              instance={setInstance}
            >
              <NameStep  update={update} />
              <LocationStep update={update} />
              {/* <TimeStep update={update} />
              <GuestStep update={update} /> */}
            </StepWizard>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CreateMealWizard;

const Navigator = ({ SW }) => (
  <Fragment>
    <h4>....</h4>
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
      <h3 className='text-center  '>Time and Date</h3>

      <label>Time and Date</label>
      <input type='text' className='form-control'
        onChange={update} />
    </div>
  );
};