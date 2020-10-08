import SwipeableViews from 'react-swipeable-views';
import React, { useState, useEffect } from "react";
import AppFab from './AppFab';
import { useLocation, useHistory } from "react-router-dom";
import MyMeals from "../meals/MyMeals"
import MyProfile from "../auth/MyProfile"
import { connect } from "react-redux";
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

const Main = ({auth}, ...props) => {
  const location = useLocation();
  const hash = location.hash.slice(1);
  console.log(`location: ${JSON.stringify(location)}`);
  const [index, setIndex] = useState(Number(hash) || 0);
  const [isFabFabVisible, setFabVisibility] = useState(true);
  const [isSwipable, setSwipability] = useState(true);
  const history = useHistory();
  const handleChange = (event, value) => {
    if ((value !== 0) && !auth.isAuthenticated)
    {
      history.push(`/Login`);
    }
  
      setIndex(value);
  };

  return <>
    <AppFab visible={isFabFabVisible} />
    <div className='main-app'>
      <SwipeableViews index={index} onChangeIndex={value=>handleChange(null, value)} disabled={!isSwipable}>
   
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
//export default (Main);

export default connect(state => ({
  auth: state.auth
}))(Main);