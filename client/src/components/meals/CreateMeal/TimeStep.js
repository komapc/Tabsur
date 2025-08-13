
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';

import Grid from '@mui/material/Grid';
import dateIcon from "../../../resources/date.svg";
const TimeStep = (props) => {
  const update = (id, value) => {
    console.log(id + ", " + value);
    props.update({ "id": id, "value": value });
  };

  return (
    <div className="wizard-container">
      <div className="date-div">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container justify="space-around">
            <DatePicker
              label="date"
              value={props.form.date}
              onChange={(e) => { update("date", e) }}
              disablePast
              format="dd/MM/yyyy"
            />
          </Grid>

          <Grid container justify="space-around" style={{ borderColor: "transparent" }}>
            <TimePicker
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
        </LocalizationProvider>
      </div>
    </div>
  );
};
export default TimeStep;
