import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getMeals } from "../../actions/mealActions";
import MealMapShow from './MealMapShow';
import BottomMealInfo from './BottomMealInfo'
const MealMap = (props) => {

  const position = { lng: 31.808, lat: 32.09 };
  let selected = 0;
  const params = props.match ? props.match.params : {};
  if (props.selectedMeal > 0) {
    selected = props.selectedMeal;
  }
  else if (!isNaN(params.meal_id)) {
    selected = params.meal_id;
  };

  const [meals, setMeals] = useState([]);
  
  const [defaultLocation, setDefaultLocation] = useState(position);
  const [isSelected, setIsSelected] = useState(selected > 0);
  const [selectedMealId, setSelectedMealId] = useState(selected);
  const [meal, setMeal] = useState({});


  const onMapClicked = (event) => {
    console.log(`Map clicked`);
    setIsSelected(false);
    setSelectedMealId({});
  }

  const onMarkerClicked = (event) => {
    
    setIsSelected(true);
    setMeal(event);
    setSelectedMealId(event.id);
    console.log(`onMarkerClicked: ${JSON.stringify(selectedMealId)}`);
  }

  // useEffect(() =>
  // {

  // })
  useEffect(() => {
    console.log("MealMap, use effects");
    getMeals(props.auth.user.id)
      .then(res => {
        console.log(res);
        setMeals(res.data);
        if (!isSelected) {
          return;
        }
        const obj = meals.filter(m => {
          return m.id === parseInt(selectedMealId);
        })
        console.log(`componentDidMount: ${JSON.stringify(obj)}`);
        setMeal( obj[0]);
      })
      .catch(err => {
        console.error(`Failed: ${err}`);
      });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {

        const p = { lng: position.coords.longitude, lat: position.coords.latitude };

        console.log(`geolocation is ${JSON.stringify(p)}`);
        setDefaultLocation(p);
      });
    }
    else {
      console.log("geolocation is not available.");
    }
  }, []);



  console.log("Selected meal: " + JSON.stringify(meal));
  return (
    <div className={isSelected ? 'meals-map-info' : 'meals-map'}>

      <MealMapShow
        meals={meals}
        defaultLocation={defaultLocation}
        onMarkerClick={onMarkerClicked}
        onMapClick={onMapClicked}
        userId={props.auth.user.id}
        selectedMeal={0} //selectedMealId
      />

      <BottomMealInfo
        meal={meal} />
    </div>

  );
}

const mapStateToProps = state => ({
  auth: state.auth,

});

export default connect(
  mapStateToProps,
  { getMeals }
)(MealMap);
