
import React, { Fragment, useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import Grid from '@material-ui/core/Grid';
import locationIcon from "../../../resources/location_icon.svg"
import dateIcon from "../../../resources/date_time_icon.svg"
import servingsIcon from "../../../resources/servings_icon.svg"
const TimeStep = props => {
  
  const [state, updateState] = useState({
  });

  const update = (id, value) => {
    alert(id, value);
    props.update({"id":id, "value":value});
  };


  return (
      <div className="date-div">
      {/* <span><img className="meal-info-icons" src={dateIcon} alt="date" /></span> */}
      <span>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around"><span><img className="meal-info-icons"
            src={dateIcon} alt="date" /></span>
            <KeyboardDatePicker
              variant="dialog"
              ampm={false}
              label="date"
              id="date"
              value={props.selectedDate}
              //onChange={(value) => { updateState({ selectedDate: value }) }}
              onChange={update}
              onError={console.log}
              disablePast
              showTodayButton
              autoOk
              format="yyyy/MM/dd"
            />
          </Grid>

          <Grid container justify="space-around"><span><img className="meal-info-icons"
            src={dateIcon} alt="date" /></span>
            <KeyboardTimePicker
              variant="dialog"
              ampm={false}
              label="date & time"
              id="time"
              value={state.selectedDate}
              //onChange={(value) => { updateState({ selectedDate: value }) }}
              onChange={(e)=>{update("id", e)}}              
              onError={console.log}
              disablePast
              showTodayButton
              autoOk
              format="HH:mm"
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </span>
    </div>
  );
};
export default TimeStep;
