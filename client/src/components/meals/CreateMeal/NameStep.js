import React from 'react';
import { TextField, Grid, Box } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import dateIcon from "../../../resources/date.svg"

const NameStep = props => {
  const update = (e) => {
    props.update(e.target);
  };

  return (
    <div className="wizard-container row ">

      <Grid container spacing={2}>
        <Box m={2} >
          <TextField variant="outlined"
            className='wizard-description  justify-content-center' id="name"
            onChange={update} value={props.form.name} label="Meal Name" />

        </Box >
        <Box m={2} >
          <TextField className='wizard-description' id="description" variant="outlined"
            onChange={update} value={props.form.description}
            placeholder="Describe the meal" label="Description" />
        </Box >
        <Box m={2}>
          <TextField variant="outlined"
            onChange={update}
            value={props.form.guestCount}
            error={props.form.guestCount === ""}
            type="Number"
            id="guestCount"
            label="Guest Count"
            placeholder="Guest Count"
            helperText={props.form.guestCount < 0 || props.form.guestCount > 100 ? "Wrong number" : ""}
          />
        </Box >

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
          </Grid>
   </div>
  );
};
export default NameStep;
