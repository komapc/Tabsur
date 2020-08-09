import SwipeableViews from 'react-swipeable-views';
import React, { Fragment, useState } from "react";
import AppFab from './AppFab';
import { useLocation } from "react-router-dom";
import MyMeals from "../meals/MyMeals"
import MyProfile from "../auth/MyProfile"

import ChatList from "../chat/ChatList"
import Bottom from "./Bottom";
import MealsListMapSwitcher from '../meals/MealsListMapSwitcher'

import withSplashScreen  from "./Splash"

const mainTabs = {
  MEALS: 0,
  MY_PROFILE: 1,
  MY_MEALS: 2,
  CHAT: 3,
}
const Main = () => {
  const location = useLocation();
  const hash = location.hash.slice(1);
  console.log(`location: ${JSON.stringify(location)}`);
  const [index, setIndex] = useState(Number(hash) || 0);
  const [isFabFabVisible, setFabVisibility] = useState(true);
  const [isSwipable, setSwipability] = useState(true);

  const handleChange = (event, value) => {
    setIndex(value);
  };

  return <>
    <AppFab visible={isFabFabVisible} />
    <div className='main-app'>
      <SwipeableViews index={index} onChangeIndex={setIndex} disabled={!isSwipable}>

        <div><MealsListMapSwitcher
          setFabVisibility={setFabVisibility}
          setSwipability={setSwipability} active={index === mainTabs.MEALS} /></div>
        <div><MyProfile active={index === mainTabs.MY_PROFILE}
          setFabVisibility={setFabVisibility}
          setSwipability={setSwipability} /></div>
        <div><MyMeals active={index === mainTabs.MY_MEALS}
          setFabVisibility={setFabVisibility}
          setSwipability={setSwipability} /></div>
        <div><ChatList active={index === mainTabs.CHAT}
          setFabVisibility={setFabVisibility}
          setSwipability={setSwipability} /> </div>
      </SwipeableViews>
    </div>
    <Bottom onChange={handleChange} index={index} />
  </>
};
//withSplashScreen
export default (Main);