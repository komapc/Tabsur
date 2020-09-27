import * as firebase from "firebase/app";
import "firebase/messaging";

let  messaging = {};
try
{
  const initializedFirebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4",
    authDomain: "tabsur.firebaseapp.com",
    databaseURL: "https://tabsur.firebaseio.com",
    projectId: "tabsur",
    storageBucket: "tabsur.appspot.com",
    messagingSenderId: "156567484209",
    appId: "1:156567484209:web:811366754f1a296b482210",
    measurementId: "G-TWDTEWH15M"
  });
  
  messaging = initializedFirebaseApp.messaging();
  messaging.usePublicVapidKey(
    "BNJJF1av86BIQPia6y1p4aqlPNRkH4C7IkExrREYb5xyr1EDpUAJtxMrVs0cpCeoIJjP2WEQGIC9FkKDamngxGc"
);

}
catch (e)
{
  console.error(e);
}

export { messaging };