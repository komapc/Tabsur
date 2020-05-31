
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import Grid from '@material-ui/core/Grid';
import dateIcon from "../../../resources/date_time_icon.svg"
const TimeStep = (props) => {
  const update = (id, value) => {    
    console.log(id + ", " + value);
    props.update({ "id": id, "value": value });
  };

  return (
    <div className="wizard-container">
      <div className="date-div">
        <span>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around"> 
              <KeyboardDatePicker
                variant="dialog"
                ampm={false}
                label="date"
                id="date"
                value={props.form.date}
                onChange={(e) => { update("date", e) }}
                onError={console.log}
                disablePast
                showTodayButton
                autoOk
                format="dd/MM/yyyy"
              />
            </Grid>

            <Grid container justify="space-around"> 
              <KeyboardTimePicker
                 keyboardIcon={<img className="meal-info-icons"
                 src={dateIcon} alt="date" />}
                variant="dialog"
                ampm={false}
                label="time"
                id="time"
                value={props.form.time}
                onChange={(e) => { update("time", e) }}
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
    </div>
  );
};
export default TimeStep;
