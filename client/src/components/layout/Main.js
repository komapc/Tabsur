import SwipeableViews from 'react-swipeable-views';
import React, { Fragment, useState } from "react";
import AppFab from './AppFab';
import { useLocation } from "react-router-dom";
import MyMeals from "../meals/MyMeals"
import MyProfile from "../auth/MyProfile"

import ChatList from "../chat/ChatList"
import Bottom from "./Bottom";
import MealsListMapSwitcher from '../meals/MealsListMapSwitcher'


const mainTabs = {
  MEALS: 0,
  MY_PROFILE: 1,
  MY_MEALS: 2,
  ADD_MEAL: 3,
}
const Main = (tabs) => {
  const location = useLocation();
  const hash= location.hash.slice(1);
  console.log(`location: ${JSON.stringify(location)}`);
  const [index, setIndex] =  useState(Number(hash)||0);
  const [disableAppFab, setDisableAppFab] = useState(false);

  const isAppFabVisible = () => {
    return index === tabs.mealsList;
  }

  const handleChange = (event, value) => {
    setIndex(value);
  };

  return <>
    <AppFab visible={isAppFabVisible()} />
    <div className='main-app'>
      <SwipeableViews index={index} onChangeIndex={setIndex}>

        <div><MealsListMapSwitcher setDisableAppFab={setDisableAppFab} active={index === tabs.MEALS} /></div>
        <div><MyProfile active={index === tabs.MY_PROFILE} /></div>
        <div><MyMeals active={index === tabs.MY_MEALS} /></div>
        <div ><ChatList /> </div>
      </SwipeableViews>
    </div>
    <Bottom onChange={handleChange} index={index} />
  </>
};

export default Main;