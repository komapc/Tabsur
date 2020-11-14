import React from 'react';
import { TextField, Grid, Box } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import 'date-fns';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import dateIcon from "../../../resources/date.svg";

const NameStep = props => {
  const update = (e) => {
    props.update(e.target);
  };

  const updateDate = (id, value) => {
    console.log(id + ", " + value);
    props.update({ "id": id, "value": value });
  };


  return (
    <div className="wizard-container row ">
      <h3 style={{ marginLeft: "40px" }}>Meal Details</h3>
      <Grid container spacing={1}>
        <Box m={2} width="1">
          <TextField variant="outlined"
            className='wizard-description  justify-content-center' id="name"
            onChange={update} value={props.form.name} label="Meal Name" />

        </Box >

        <Box m={2} width="1">
          <TextField variant="outlined" width="1"
            className='wizard-description  justify-content-center'
            onChange={update}
            value={props.form.guest_count}
            error={props.form.guest_count === ""}
            type="Number"
            id="guest_count"
            label="Guest Count"
            placeholder="Guest Count"
            helperText={props.form.guest_count < 0 || props.form.guest_count > 100 ? "Wrong number" : ""}
          />
        </Box >

        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Box m={2} width="1">
            <KeyboardDatePicker style={{ borderColor: "transparent" }}
              variant="dialog"
              ampm={false}
              label="date"
              id="date"
              value={props.form.date}
              onChange={(e) => { updateDate("date", e) }}
              onError={console.log}
              disablePast
              showTodayButton
              autoOk
              format="dd/MM/yyyy"
            />
          </Box>
          <Box m={2} width="1">
            <KeyboardTimePicker
              keyboardIcon={<img className="meal-info-icons"
                src={dateIcon} alt="date" />}
              variant="dialog"
              ampm={false}
              label="time"
              id="time"
              value={props.form.time}
              onChange={(e) => { updateDate("time", e) }}
              onError={console.log}
              disablePast
              autoOk
              format="HH:mm"
            />
          </Box>
        </MuiPickersUtilsProvider>
      </Grid>
    </div>
  );
};
export default NameStep;
