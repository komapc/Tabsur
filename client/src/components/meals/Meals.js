import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import MealListItem from "./MealListItem";
import loadingGIF from "../../resources/animation/loading.gif";
import { Typography } from "@mui/material";

const Meals = (props) => {
 
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = (props) => {
    console.log(`Meals refresh called - authenticated: ${props.auth?.isAuthenticated}, userId: ${props.auth?.user?.id}`);
    
    if (!props.auth.isAuthenticated)
    {
      console.warn(`Get Meals called but user not authenticated, loading public meals`);
      // Load public meals for unauthenticated users
      return getMeals(null)
        .then(res => {
          console.log(`getMeals (public) returned ${JSON.stringify(res.data)}`);
          setMeals(res.data || []);
        })
        .catch(err => {
          console.error(`getMeals (public) error: ${JSON.stringify(err)}`);
          setMeals([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    console.log(`refreshing meal list for authenticated user.`);
    return getMeals(props.auth.user.id)
      .then(res => {
        console.log(`getMeals returned ${JSON.stringify(res.data)}`);
        setMeals(res.data);
      })
      .catch(err => {
        console.error(`getMeals error: ${JSON.stringify(err)}`);
        setMeals([]);
      })
      .finally(() => {
        console.log("loading set to false.");
        setLoading(false);
      });
  }

  useEffect(() => {
    refresh(props);
  }, [props]);
  if (!props.visible)
  {
    return <> </>;
  }
  return <>
    {
      loading ?
        <img src={loadingGIF} alt="loading" /> :
        <>
          {meals.length === 0 ? 
            <div style={{textAlign: 'center', padding: '20px'}}>
              <Typography variant="h6">No meals available</Typography>
              <Typography variant="body2" style={{marginTop: '10px'}}>
                {props.auth?.isAuthenticated ? 
                  'Be the first to create a meal! Click the + button below.' :
                  'Please log in to see meals or create your own.'
                }
              </Typography>
            </div> :
            meals.map(meal =>
              <MealListItem key={meal.id} meal={meal} />
            )}
        </>}
  </>
}

const mapStateToProps = state => ({
  auth: state.auth,

});
const mapDispatchToProps = (dispatch) => ({
  getMeals: (form, history) => getMeals(form, history)(dispatch)
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(Meals);
