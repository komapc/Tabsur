importScripts("https://www.gstatic.com/firebasejs/7.21.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.21.1/firebase-messaging.js");
firebase.initializeApp({
  apiKey: "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4",
  authDomain: "tabsur.firebaseapp.com",
  databaseURL: "https://tabsur.firebaseio.com",
  projectId: "tabsur",
  storageBucket: "tabsur.appspot.com",
  messagingSenderId: "156567484209",
  appId: "1:156567484209:web:811366754f1a296b482210",
  measurementId: "G-TWDTEWH15M"
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  const promiseChain = clients.matchAll({
    type: "window",
    includeUncontrolled: true
  })
  .then(windowClients => {
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      windowClient.postMessage(payload);
    }
    return registration.showNotification(payload.data.title, payload.data);
  })
  .catch((err) => {
    console.error(err);
  });
  return promiseChain;
});

self.addEventListener('notificationclick', function(event) {
  const target = event.notification.data.click_action || '/';
  event.notification.close();
  event.waitUntil(clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === target && 'focus' in client) {
        return client.focus();
      }
    }
    return clients.openWindow(target);
  }));
});
