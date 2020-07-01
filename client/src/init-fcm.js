import * as firebase from "firebase/app";
import "firebase/messaging";
const initializedFirebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCAZiZOlHCuUDhxyQWinLJ91JLubuD-2mY",
    authDomain: "test-813c6.firebaseapp.com",
    databaseURL: "https://test-813c6.firebaseio.com",
    projectId: "test-813c6",
    storageBucket: "test-813c6.appspot.com",
    messagingSenderId: "358654109615",
    appId: "1:358654109615:web:4e421184e1af43f056715a"
});
const messaging = initializedFirebaseApp.messaging();
messaging.usePublicVapidKey(
// Project Settings => Cloud Messaging => Web Push certificates
  "AAAAU4FzZ68:APA91bFbRKzaWX4ZqvrHTBlAUa5rO5YevPiqbo3E-PWxkHRWKAYZVZlBEwBxCHifQSd71xC6RvYGJOCubJYkJOFX6sMdxsE7bgekrKxjzJASQ-K_Slb61ARn6n8aaMxIu21HENpD1JXb"
);
export { messaging };