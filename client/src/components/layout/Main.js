import SwipeableViews from 'react-swipeable-views';
import React, { Fragment, useState } from "react";
import AppFab from './AppFab';

import MyMeals from "../meals/MyMeals"
import MyProfile from "../auth/MyProfile"

import ChatList from "../chat/ChatList"
import Bottom from "./Bottom";
import MealsListMapSwitcher from '../meals/MealsListMapSwitcher'

const Main = (tabs) => {
  const [index, setIndex] = useState(0);
  const [disableAppFab, setDisableAppFab] = useState(false);

  const isAppFabVisible = () => {
    return index === tabs.mealsList;
  }

  const handleChange = (event, value) => {
    setIndex(value);
  };

  const handleChangeIndex = index => {
    setIndex(index);
  };

  return <>
    <AppFab visible={isAppFabVisible()} />
    <div className='main-app'>
      <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>

        <div ><MealsListMapSwitcher setDisableAppFab={setDisableAppFab} active={index === tabs.meals} /></div>
        <div ><MyProfile active={index === tabs.myProfile} /></div>
        <div ><MyMeals active={index === tabs.myMeals} /></div>
        {/* <div><CreateMealWizard active={index===tabs.addMeal} handleChangeIndex={this.handleChangeIndex}/> </div> */}
        <div ><ChatList /> </div>
      </SwipeableViews>
    </div>
    <Bottom onChange={handleChange} index={index} />
  </>
};

export default Main;