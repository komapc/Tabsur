import { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import SwipeableViews from 'react-swipeable-views-react-18-fix'; // Keep this import

// import AppFab from "./AppFab"; 
import MyMeals from "../meals/MyMeals";
import MyProfile from "../auth/MyProfile";
import ChatList from "../chat/ChatList";
import Bottom from "./Bottom";
import MealsListMapSwitcher from '../meals/MealsListMapSwitcher';

import withSplashScreen from "./Splash";

const mainTabs = {
  MEALS: 0,
  MY_PROFILE: 1,
  MY_MEALS: 2,
  CHAT: 3,
};

const Main = ({ auth }) => {
  const location = useLocation();
  const history = useHistory();

  // Use a default value of 0 if there's no hash or the hash is invalid
  const initialIndex = parseInt(location.hash.slice(1), 10) || 0;
  const [index, setIndex] = useState(initialIndex);

  const [isFabFabVisible, setFabVisibility] = useState(true);
  const [isSwipable, setSwipability] = useState(true);

  const handleChange = (event, value) => {
    if ((value !== 0) && !auth.isAuthenticated) {
      history.push(`/Login`);
      return; // Prevent the index from changing if the user is not authenticated
    }

    setIndex(value);
    // Update the URL hash to reflect the current index
    history.push(`#${value}`);
  };


  return (
    <>
      {/* <AppFab visible={isFabFabVisible} /> */}
      <div className='main-app'>
        <SwipeableViews index={index} onChangeIndex={value => handleChange(null, value)} disabled={!isSwipable}>
          <MealsListMapSwitcher
            setFabVisibility={setFabVisibility}
            setSwipability={setSwipability}
            active={index === mainTabs.MEALS}
          />
          <MyProfile
            active={index === mainTabs.MY_PROFILE}
            setFabVisibility={setFabVisibility}
            setSwipability={setSwipability}
          />
          <MyMeals
            active={index === mainTabs.MY_MEALS}
            setFabVisibility={setFabVisibility}
            setSwipability={setSwipability}
          />
          <ChatList
            active={index === mainTabs.CHAT}
            setFabVisibility={setFabVisibility}
            setSwipability={setSwipability}
          />
        </SwipeableViews>
      </div>
      <Bottom onChange={handleChange} index={index} />
    </>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Main);
