import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "tabsur.firebaseapp.com",
  databaseURL: "https://tabsur.firebaseio.com",
  projectId: "tabsur",
  storageBucket: "tabsur.appspot.com",
  messagingSenderId: "156567484209",
  appId: "1:156567484209:web:811366754f1a296b482210",
  measurementId: "G-TWDTEWH15M"
};

let messaging = null;

// Check if Firebase messaging is supported in this browser
const initializeFirebase = async () => {
  try {
    const app = initializeApp(firebaseConfig);
    
    // Check if messaging is supported before initializing
    const messagingSupported = await isSupported();
    
    if (messagingSupported) {
      messaging = getMessaging(app);
      console.log('Firebase messaging initialized successfully');
      // To use your VAPID key when requesting a token:
      // getToken(messaging, { vapidKey: "BNJJF1av86BIQPia6y1p4aqlPNRkH4C7IkExrREYb5xyr1EDpUAJtxMrVs0cpCeoIJjP2WEQGIC9FkKDamngxGc" });
    } else {
      console.log('Firebase messaging not supported in this browser - notifications will be disabled');
    }
  } catch (e) {
    console.warn('Firebase initialization failed - notifications will be disabled:', e.message);
  }
};

// Initialize Firebase
initializeFirebase();

export { messaging };