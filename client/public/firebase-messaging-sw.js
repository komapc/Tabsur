importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");
firebase.initializeApp({
  messagingSenderId: "156567484209"
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      console.log(JSON.stringify(payload));
      return registration.showNotification(payload.data.title, {
        body: payload.data.body,
        icon: payload.data.icon,
        image: payload.data.image,
        click_action: payload.data.click_action,
        time_to_live: payload.data.time_to_live
      });
    })
    .catch((err) =>
     {
      console.log(JSON.stringify(err));
     });
  return promiseChain;
});
self.addEventListener('notificationclick', function(event) {
  console.log(`notificationclick event fired. Event object: ${JSON.stringify(event)}`);
});
