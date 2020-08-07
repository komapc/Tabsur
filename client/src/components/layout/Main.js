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



const tabs = {

  mealsList: 0,
  mealsMap: 1
}
const Main = () => {
  const location = useLocation();
  const hash = location.hash.slice(1);
  console.log(`location: ${JSON.stringify(location)}`);
  const [index, setIndex] =  useState(Number(hash)||0);
  const [isAppFabVisible, setFabVisibility] = useState(true);
  const [isSwipable, setSwapability] = useState(true);


  const handleChange = (event, value) => {
    setIndex(value);
  };

  return <>
    <AppFab visible={isAppFabVisible} />
    <div className='main-app'>
      <SwipeableViews index={index} onChangeIndex={setIndex}>

        <div><MealsListMapSwitcher 
          setFabVisibility={setFabVisibility} 
          setSwapability = {setSwapability} active={index === mainTabs.MEALS} /></div>
        <div><MyProfile active={index === mainTabs.MY_PROFILE} /></div>
        <div><MyMeals active={index === mainTabs.MY_MEALS} /></div>
        <div><ChatList active={index === mainTabs.MY_MEALS} /> </div>
      </SwipeableViews>
    </div>
    <Bottom onChange={handleChange} index={index} />
  </>
};

export default Main;