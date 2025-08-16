import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "tabsur.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://tabsur.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "tabsur",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "tabsur.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "156567484209",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:156567484209:web:811366754f1a296b482210",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-TWDTEWH15M"
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
      // getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
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