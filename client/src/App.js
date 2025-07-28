import { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { setFirebaseCloudMessagingToken } from "./actions/notifications";
import setMessagesCount from "./actions/MessagesActions";
import {
  setNotificationsCount,
  setProfileNotificationsCount,
} from "./actions/notifications";
import { connect, Provider } from "react-redux";
import store from "./store";

import Profile from "./components/users/Profile";
import Main from "./components/layout/Main";
import Register from "./components/auth/Register";
import Settings from "./components/auth/Settings";
import Login from "./components/auth/Login";
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRoute from "./components/private-route/PrivateRoute";
import ShowMeal from "./components/meals/ShowMeal";
import EditMeal from "./components/meals/EditMeal";
import ShowUser from "./components/users/ShowUser";
import CreateMealWizard from "./components/meals/CreateMeal/CreateMealWizard";
import About from "./components/about/About";
import Stats from "./components/users/Stats";
import ChatUser from "./components/chat/ChatUser";
import { Helmet } from "react-helmet";
import "./App.css";
import { messaging } from "../src/init-fcm";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppFab from "./components/layout/AppFab"; 

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

try {
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
} catch (e) {
  console.error(`Local storage init failed: ${JSON.stringify(e)}`);
}

const googleKey = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";
const enableMessaging = true;
if (enableMessaging) {
  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./firebase-messaging-sw.js")
        .then(function (registration) {
          console.log(
            `Firebase Cloud Messaging ServiceWorker registration successful, registration.scope is: ${registration.scope}`
          );
        })
        .catch(function (err) {
          console.error(
            `serviceWorker registration error: ${JSON.stringify(err)}.`
          );
        });
    }
  } catch (e) {
    console.error(`Messaging registration failed with: ${JSON.stringify(e)}`);
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.auth.user.id || 0,
      notificationsCount: 0,
      profileNotificationsCount: 0,
      messagesCount: 0,
      index: 0,
    };

    // Bind the event listener
    this.handleMessage = this.handleMessage.bind(this);
  }

  // Separate the event listener logic into a function
  handleMessage(message) {
    let data = message.data["firebase-messaging-msg-data"]
      ? message.data["firebase-messaging-msg-data"].data
      : message.data.data;
    console.log(`message.data: ${JSON.stringify(data)}`);
    console.log(`message.data.type: ${JSON.stringify(data["gcm.notification.type"])}`);
    const type = data["gcm.notification.type"];

    switch (type) {
      case "0":
        this.setState(prevState => ({ messagesCount: prevState.messagesCount + 1 }), () => {
          store.dispatch(setMessagesCount(this.state.messagesCount));
        });
        break;
      case "6":
        this.setState(prevState => ({ profileNotificationsCount: prevState.profileNotificationsCount + 1 }), () => {
          store.dispatch(setProfileNotificationsCount(this.state.profileNotificationsCount));
        });
        break;
      default:
        this.setState(prevState => ({ notificationsCount: prevState.notificationsCount + 1 }), () => {
          store.dispatch(setNotificationsCount(this.state.notificationsCount));
        });
        break;
    }
  }


  async componentDidMount() {
    if (enableMessaging) {
      try {
        const userId = this.state.id;
        messaging
          .requestPermission()
          .then(async function () {
            const token = await messaging.getToken();
            console.log(`Firebase token is: ${token}`);

            if (!isNaN(userId) && userId > 0) {
              setFirebaseCloudMessagingToken(userId, token);
            } else {
              console.error(`setFirebaseCloudMessagingToken:undefined user.`);
            }
          })
          .catch(function (err) {
            console.error(
              `Unable to get permission to notify. Error: ${JSON.stringify(err)}`
            );
          });

        // Add event listener in componentDidMount
        navigator.serviceWorker.addEventListener("message", this.handleMessage);

      } catch (e) {
        console.error(`Messaging initialization failed with: ${JSON.stringify(e)}`);
      }
    }
  }

  componentWillUnmount() {
    // Remove the event listener when the component unmounts to prevent memory leaks
    navigator.serviceWorker.removeEventListener("message", this.handleMessage);
  }

  render() {
    try {
      return (
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <GoogleOAuthProvider clientId={googleKey}>  
              <Router>
                <Helmet>
                  <meta charSet="utf-8" />
                  <title>
                    BeMyGuest - food sharing app or food sharing and social
                    dinning
                  </title>
                  <link rel="canonical" href="https://www.bemyguest.app" />
                </Helmet>
                {/* <AppFab visible={true} /> */}
                <Switch>
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login/:extend?" component={Login} />
                  <Route exact path="/about" component={About} />
                  <PrivateRoute exact path="/user/:id" component={ShowUser} />
                  <Route exact path="/meal/:id" component={ShowMeal} />
                  <PrivateRoute exact path="/profile/:id" component={Profile} />
                  <PrivateRoute exact path="/Stats/:id" component={Stats} />
                  <PrivateRoute exact path="/chatUser/:id" component={ChatUser} />
                  <PrivateRoute exact path="/settings" component={Settings} />
                  <PrivateRoute exact path="/EditMeal/:id" component={EditMeal} />
                  <PrivateRoute
                    exact
                    path="/createMealWizard"
                    component={CreateMealWizard}
                  />
                  <Route path="/" component={Main} />
                </Switch>
              </Router>
            </GoogleOAuthProvider>
          </ThemeProvider>
        </Provider>
      );
    } catch (e) {
      return <h3>{e}</h3>;
    }
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  notificationsCount: state.notificationsCount,
  profileNotificationsCount: state.profileNotificationsCount,
  messagesCount: state.messagesCount,
});

export default connect(mapStateToProps)(App);
