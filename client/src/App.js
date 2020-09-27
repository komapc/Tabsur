import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { setFirebaseCloudMessagingToken } from "./actions/notifications"
import setMessagesCount from "./actions/MessagesActions"
import {setNotificationsCount, setProfileNotificationsCount} from "./actions/notifications"
import { connect, Provider } from "react-redux";
import store from "./store";


import Profile from "./components/users/Profile"
import Main  from "./components/layout/Main"
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import ShowMeal from "./components/meals/ShowMeal";
import ShowUser from "./components/users/ShowUser";
import CreateMealWizard from "./components/meals/CreateMeal/CreateMealWizard";
import About from "./components/about/About"
import Stats from "./components/users/Stats"
import ChatUser from "./components/chat/ChatUser"
import { Helmet } from "react-helmet"; 
import "./App.css";
import { messaging } from "../src/init-fcm";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';


try
{
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
}
catch (e)
{ 
  console.error("");
  console.error(e);
}
const enableMessaging = false;
if (enableMessaging)
{
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./firebase-messaging-sw.js")
      .then(function(registration) {
        console.log(`Firebase Cloud Messaging ServiceWorker registration successful, registration.scope is: ${registration.scope}`);
      })
      .catch(function(err) {
        console.error(`serviceWorker registration error: ${JSON.stringify(err)}.`);
      });
  }
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.auth.user.id || 0,
      notificationsCount: 0,
      profileNotificationsCount: 0,
      messagesCount: 0,
      index: 0
    };
  }

  async componentDidMount() {
    const enableMessaging = false;
    if (enableMessaging)
    {
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
    if (enableMessaging)
    {
      navigator.serviceWorker.addEventListener("message", (message) => {
        let data = message.data['firebase-messaging-msg-data'] ? message.data['firebase-messaging-msg-data'].data : message.data.data;
        console.log(`message.data: ${JSON.stringify(data)}`);
        console.log(`message.data.type: ${JSON.stringify(data["gcm.notification.type"])}`);
        const type=data["gcm.notification.type"];
        if(type === "0") { //"message"; TODO: use strings vs enums 
          store.dispatch(setMessagesCount(++this.state.messagesCount));
        } else if(type === "6") { 
          store.dispatch(setProfileNotificationsCount(++this.state.profileNotificationsCount));
        } else {
          store.dispatch(setNotificationsCount(++this.state.notificationsCount));
        }
      });
  }}
  }


  render() {
    return (
      // <Provider store={store}>
      //   <ThemeProvider theme={theme}>
      //   <Router>
      //   <Helmet>
      //         <meta charSet="utf-8" />
      //         <title>BeMyGuest - food sharing app or food sharing and social dinning</title>
      //         <link rel="canonical" href="https://tabsur.herokuapp.com" />
      //     </Helmet>
      //   <Switch>

      //     <Route exact path="/register" component={Register} />
      //     <Route exact path="/login/:extend?" component={Login} />            
      //     <Route exact path="/about" component={About} />
      //     <PrivateRoute exact path="/user/:id"  component={ShowUser} />
      //     <PrivateRoute exact path="/meal" component={ShowMeal} />
      //     <PrivateRoute exact path="/profile/:id" component={Profile} />
      //     <PrivateRoute exact path="/Stats/:id" component={Stats} /> 
      //     <PrivateRoute exact path="/chatUser/:id"  component={ChatUser} />
      //     <PrivateRoute exact path="/createMealWizard" component={CreateMealWizard}  />
      //     <Route path="/" component={Main} />
         
      //   </Switch>
      //   </Router>
      //   </ThemeProvider>
      // </Provider>
      <h3>EMPTY</h3>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  notificationsCount: state.notificationsCount,
  profileNotificationsCount: state.profileNotificationsCount,
  messagesCount: state.messagesCount
}))(App);