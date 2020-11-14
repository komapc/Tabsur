
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import Grid from '@material-ui/core/Grid';
import dateIcon from "../../../resources/date.svg";
const TimeStep = (props) => {
  const update = (id, value) => {
    console.log(id + ", " + value);
    props.update({ "id": id, "value": value });
  };

  return (
    <div className="wizard-container">
      <div className="date-div">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker style={{ borderColor: "transparent" }}
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

          <Grid container justify="space-around" style={{ borderColor: "transparent" }}>
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
              autoOk
              format="HH:mm"
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </div>
    </div>
  );
};
export default TimeStep;
