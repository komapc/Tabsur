import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMealInfo, editMeal } from "../../actions/mealActions";
import classnames from "classnames";
import { TextField, Grid, Box, Button } from '@mui/material';
import { useHistory } from "react-router-dom";

const EditMeal = (props) => {

  const mealId = props.match.params.id;
  const [meal, setMeal] = useState({ name: "", guest_count: "0", errors: {} });

  const history = useHistory();
  const onSubmit = e => {
    
    e.preventDefault();
    console.log(`New values: ${JSON.stringify(meal)}`);

    return props.editMeal(meal, () => {
     // history.push({ pathname: '/', hash: '#2' });
    }, props.history);
  }
  useEffect(() => {
    console.log(`Meal id: ${mealId}`);

    getMealInfo(mealId, props.auth.user.id)
      .then((res) => {
        setMeal(res.data[0]);
        console.log(res.data[0]);
      })
      .catch(err => {
        console.error(err);
      });

  }, [mealId, props]);


  const errors = meal.errors || {}; //todo
  const { user } = props.auth;
  return (
    <Grid container spacing={2}>
      <Box m={2} width="1">
        <h4>Edit the meal</h4>
      </Box>
      <Box m={2} width="1">
        <TextField
         onChange={n => 
          {
            //alert(JSON.stringify(n.target));
            setMeal({...meal, name:n.target.value});
          }
        }
          value={meal.name}
          error={errors.name}
          id="name"
          type="text"
          className={classnames("", {
            invalid: errors.name
          })}
        />
        <label htmlFor="name">Meal name</label>
        <span className="red-text">{errors.name}</span>
      </Box>
      {/* <Box m={2} width="1">
        <TextField
          onChange={onChange}
          value={meal.date}
          error={errors.password}
          id="date"
          type="date"
          className={classnames("", {
            invalid: errors.password
          })}
        />
      </Box> */}
      {/* <Box m={2} width="1">
      <TextField
        onChange={onChange}
        value={JSON.stringify(meal.location)}
        error={errors.password}
        id="location"
        type="text"

      />
     
      <label htmlFor="location">Location</label>
      <span className="red-text">{errors.name}</span>
       </Box> */}
       
      <Box m={2} p={2} width={1}>
        <TextField width={1}
          onChange={n => 
            {
              //alert(JSON.stringify(n.target));
              setMeal({...meal, guest_count:n.target.value});
            }
          }
          value={meal.guest_count}
          error={meal.guest_count === ""}
          type="Number"
          id="guest_count"
          label="Guest Count"
          placeholder="Guest Count"
          helperText={meal.guest_count < 0 || meal.guest_count > 100 ? "Wrong number" : ""}
        />
      </Box >
      <Button variant="outlined"
        onClick={onSubmit}>   Submit
      </Button>

    </Grid>
  );
}

EditMeal.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = (dispatch) => ({
  editMeal: (form, history) => editMeal(form, history)(dispatch),
});
export default connect(
  mapStateToProps,mapDispatchToProps
)(withRouter(EditMeal));
