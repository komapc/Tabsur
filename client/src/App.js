import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { setFirebaseCloudMessagingToken } from "./actions/notifications"
import setMessagesCount from "./actions/MessagesActions"
import {setNotificationsCount, setProfileNotificationsCount} from "./actions/notifications"
import { connect, Provider } from "react-redux";
import store from "./store";

import withSplashScreen  from "./components/layout/Splash"
import Bottom from "./components/layout/Bottom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Meals from "./components/meals/Meals";
import ShowMeal from "./components/meals/ShowMeal";
import ShowUser from "./components/meals/ShowUser";
import MealMap from "./components/meals/MealMap";
import Attend from "./components/meals/Attend";
import CreateMealWizard from "./components/meals/CreateMeal/CreateMealWizard";
import About from "./components/about/About"
import NotificationScreen from "./components/notifications/NotificationScreen"; //Not used yet
import MyMeals from "./components/meals/MyMeals"
import MyProfile from "./components/auth/MyProfile"
import Stats from "./components/users/Stats"
import Profile from "./components/users/Profile"
import ChatList from "./components/chat/ChatList"
import ChatUser from "./components/chat/ChatUser"
import { Helmet } from "react-helmet";
import "./App.css";
import { messaging } from "../src/init-fcm";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import MealsListMapSwitcher from './components/meals/MealsListMapSwitcher'
import AppFab from './components/layout/AppFab'
// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

if ("serfciceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function(registration) {
      console.log(`Firebase Cloud Messaging ServiceWorker registration successful, registration.scope is: ${registration.scope}`);
    })
    .catch(function(err) {
      console.error(`serviceWorker registration error: ${JSON.stringify(err)}.`);
    });
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#13A049',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const tabs = {
  meals: 0,
  myProfile: 1,
  myMeals: 2,
  addMeal: 3,

  mealsList: 0,
  mealsMap: 1
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.auth.user.id || 0,
      notificationsCount: 0,
      profileNotificationsCount: 0,
      messagesCount: 0,
      index: 0,
      disableAppFab: false
    };
  }

  async componentDidMount() {
    const userId = this.state.id;
    messaging.requestPermission()
    .then(async function() {
      const token = await messaging.getToken();
      console.log(`Firebase token is: ${token}`);

      if (!isNaN(userId) && userId > 0) {
        setFirebaseCloudMessagingToken(userId, token);
      } else { 
        console.log(`undefined user.`);
      }
    })
    .catch(function(err) {
      console.error(`Unable to get permission to notify. Error: ${JSON.stringify(err)}`);
    });
    navigator.serviceWorker.addEventListener("message", (message) => {
      let data = message.data['firebase-messaging-msg-data'] ? message.data['firebase-messaging-msg-data'].data : message.data.data;
      console.log(`message.data: ${JSON.stringify(data)}`);
      if(data.type === "0") { //"message"; TODO: use strings vs enums
        store.dispatch(setMessagesCount(++this.state.messagesCount));
      } else if(data.type === "6") {
        store.dispatch(setProfileNotificationsCount(++this.state.profileNotificationsCount));
      } else {
        store.dispatch(setNotificationsCount(++this.state.notificationsCount));
      }
    });
  }


  handleChange = (event, value) => {
    this.setState({
      index: value,
    });
  };

  handleChangeIndex = index => {
    this.setState({
      index,
    });
  };
  setDisableAppFab = (value) => {
    this.setState({
      disableAppFab: value
    });
  }
  isAppFabVisible() {
    // return (this.state.index === tabs.mealsList && !this.state.disableAppFab) || (this.state.index === tabs.mealsMap);
    return this.state.index === tabs.mealsList;
  }
  Main = ()=>
  {
    return <Fragment>
      <AppFab visible={this.isAppFabVisible()}/> 
      <div style={{overflowY:'hidden'}}>
         <SwipeableViews index={this.state.index} onChangeIndex={this.handleChangeIndex}>

          <div style={{height:'85vh'}}><MealsListMapSwitcher setDisableAppFab={this.setDisableAppFab} active={this.state.index==tabs.meals}/></div>
          <div style={{height:'85vh'}}><MyProfile active={this.state.index==tabs.myProfile}/></div>
          <div style={{height:'85vh'}}><MyMeals active={this.state.index==tabs.myMeals} /></div>
          {/* <div style={{height:'85vh'}}><CreateMealWizard active={this.state.index==tabs.addMeal} handleChangeIndex={this.handleChangeIndex}/> </div> */}
          <div style={{height:'85vh'}}><ChatList /> </div>
        </SwipeableViews>
      </div>
     <Bottom onChange={this.handleChange} index={this.state.index}/> 
    </Fragment>
  };

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
        <Router>
        <Switch>

          <Route exact path="/register" component={Register} />
          <Route exact path="/login/:extend?" component={Login} />            
          <Route exact path="/about" component={About} />
          <PrivateRoute exact path="/user/:id"  component={ShowUser} />
          <PrivateRoute exact path="/myProfile" component={MyProfile} />
          <PrivateRoute exact path="/meal" component={ShowMeal} />
          <PrivateRoute exact path="/profile/:id" component={Profile} />
          <PrivateRoute exact path="/Stats/:id" component={Stats} /> 
          <PrivateRoute exact path="/chat"  component={ChatList} />
          <PrivateRoute exact path="/chatUser/:id"  component={ChatUser} />
          <PrivateRoute exact path="/chatUser/:id"  component={ChatUser} />
          <PrivateRoute exact path="/createMealWizard" component={CreateMealWizard}  />
          <PrivateRoute path="/" component={this.Main} />
         
        </Switch>
        </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  notificationsCount: state.notificationsCount,
  profileNotificationsCount: state.profileNotificationsCount,
  messagesCount: state.messagesCount
}))(withSplashScreen(App));