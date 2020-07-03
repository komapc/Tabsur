import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Bottom from "./components/layout/Bottom";
import Menu from "./components/layout/Menu";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Meals from "./components/meals/Meals";
import ShowMeal from "./components/meals/ShowMeal";
import ShowUser from "./components/meals/ShowUser";
import MealMap from "./components/meals/MealMap";
import Attend from "./components/meals/Attend";
//import Create from "./components/meals/CreateMeal";
import CreateMealWizard from "./components/meals/CreateMeal/CreateMealWizard";
import About from "./components/about/About"
import NotificationScreen from "./components/notifications/NotificationScreen"; //Not used yet
import MyMeals from "./components/meals/MyMeals"
import MyProfile from "./components/auth/MyProfile"
import Stats from "./components/users/Stats"
import Profile from "./components/users/Profile"
import { Helmet } from "react-helmet";
import "./App.css";
import { messaging } from "../src/init-fcm";
import axios from "axios";
import config from "./config";

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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function(registration) {
      console.log(`ServiceWorker registration successful, registration.scope is: ${registration.scope}`);
    })
    .catch(function(err) {
      console.error(`Service worker registration failed. Error: ${JSON.stringify(err)}`);
    });
}

class App extends Component {
  async componentDidMount() {
    messaging.requestPermission()
      .then(async function() {
        const token = await messaging.getToken();
        console.log(`Firebase token is: ${token}`);
        const userId = 0; // ?
        axios.post(`${config.SERVER_HOST}/api/notifications/token/${userId}`, {
          token: token
        });
      })
      .catch(function(err) {
        console.error(`Unable to get permission to notify. Error: ${JSON.stringify(err)}`);
      });
    navigator.serviceWorker.addEventListener("message", (message) => {
      console.log(`Message recieved: ${JSON.stringify(message)}`);
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="app">
            <Helmet>
              <meta charSet="utf-8" />
              <title>Coolanu - food sharing app or food sharing and social dinning</title>
              <link rel="canonical" href="https://coolanu.com" />
            </Helmet>
            <Switch>{/*screens without top bar */}
              <PrivateRoute exact path="/createMealWizard" component={CreateMealWizard}  />
              <PrivateRoute exact path="/user/:id" component={ShowUser} />
              <Navbar />
            </Switch>
              <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login/:extend?" component={Login} />            
                <Route exact path="/about" component={About} />
                <Route exact path="/menu" component={Menu} />
                <PrivateRoute exact path="/meals" component={Meals} />
                <PrivateRoute exact path="/meal" component={ShowMeal} />
                <PrivateRoute exact path="/mealMap/:meal_id?" component={MealMap} />
                <PrivateRoute exact path="/myMeals" component={MyMeals} />
                <PrivateRoute exact path="/attend/:id" component={Attend} />
                <PrivateRoute exact path="/notifications" component={NotificationScreen} /> 
                <PrivateRoute exact path="/myProfile" component={MyProfile} />
                <PrivateRoute exact path="/profile/:id" component={Profile} />
                <PrivateRoute exact path="/Stats/:id" component={Stats} /> 
                <PrivateRoute exact path="/createMealWizard"  component={() => { return <span/>}} />
                <PrivateRoute exact path="/user/:id"  component={() => { return <span/>}} />
                <Route path="/" component={Meals} />
              </Switch>
              <Switch>{/* Bottom menu for everybody except the wizard                */}
                <PrivateRoute exact path="/createMealWizard" component={() => { return <span/>}}  />
                <PrivateRoute exact path="/user/:id" component={() => { return <span/>}}  />
                <Bottom />
              </Switch> 
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
