import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4",
  authDomain: "tabsur.firebaseapp.com",
  databaseURL: "https://tabsur.firebaseio.com",
  projectId: "tabsur",
  storageBucket: "tabsur.appspot.com",
  messagingSenderId: "156567484209",
  appId: "1:156567484209:web:811366754f1a296b482210",
  measurementId: "G-TWDTEWH15M"
};

let messaging = null;
try {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
  // To use your VAPID key when requesting a token:
  // getToken(messaging, { vapidKey: "BNJJF1av86BIQPia6y1p4aqlPNRkH4C7IkExrREYb5xyr1EDpUAJtxMrVs0cpCeoIJjP2WEQGIC9FkKDamngxGc" });
} catch (e) {
  console.error(`Firebase initialization failed: ${JSON.stringify(e)}`);
}

export { messaging };