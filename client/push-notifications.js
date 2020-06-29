var senderId = '358654109615';
var firebaseToken;

firebase.initializeApp({
    messagingSenderId: senderId
});

var messaging = firebase.messaging();

if (
    'Notification' in window && 
    'serviceWorker' in navigator && // ?
    'postMessage' in window // ?
) { 
    messaging.onMessage(function(payload) {
        console.log('Message received', payload);
    
        // register fake ServiceWorker for show notification on mobile devices
        navigator.serviceWorker.register('/serviceworker/firebase-messaging-sw.js');
        Notification.requestPermission(function(permission) {
            if (permission === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                    // Copy data object to get parameters in the click handler
                    payload.data.data = JSON.parse(JSON.stringify(payload.data)); // ?
                    registration.showNotification(payload.data.title, payload.data); // ?
    
                    // ...
                }).catch(function(error) {
                    console.error('ServiceWorker registration failed', error);
                });
            }
        });
    });
    
    messaging.onTokenRefresh(function() {
        messaging.getToken()
            .then(function(refreshedToken) {
                console.log('Token refreshed');
                firebaseToken = refreshedToken;
            })
            .catch(function(error) {
                console.error('Unable to retrieve refreshed token', error);
            });
    });

    // if (Notification.permission === 'granted') {
    getToken();
    // }
} else {
    if (!('Notification' in window)) {
        console.warn('Notification not supported');
    } else if (!('serviceWorker' in navigator)) {
        console.warn('ServiceWorker not supported');
    } else if (!('postMessage' in window)) {
        console.warn('postMessage not supported');
    }

    console.warn('This browser does not support desktop notification.');
    console.log('Is HTTPS', window.location.protocol === 'https:');
    console.log('Support Notification', 'Notification' in window);
    console.log('Support ServiceWorker', 'serviceWorker' in navigator);
    console.log('Support LocalStorage', 'localStorage' in window);
    console.log('Support fetch', 'fetch' in window);
    console.log('Support postMessage', 'postMessage' in window);
}

function getToken() {
    messaging.requestPermission() // ?
        .then(function() {
            messaging.getToken()
                .then(function(currentToken) {
                    if (currentToken) {
                        firebaseToken = currentToken;

                        console.log('Token for push notifications', firebaseToken);
                        // TODO: send token to our server to SAVE it for this userId
                    } else {
                        firebaseToken = null;
                    }
                })
                .catch(function(error) {
                    console.error('An error occurred while retrieving token. ' + error);
                });
        })
        .catch(function(error) {
            console.error('Unable to get permission to notify. ' + error);
        });
}

function deleteToken() {
    messaging.getToken()
    .then(function(currentToken) {
        messaging.deleteToken(currentToken)
            .then(function() {
                console.log('Token deleted');
                // TODO: send token to our server to DELETE it for this userId
                firebaseToken = null;
            })
            .catch(function(error) {
                console.error('Unable to delete token', error);
            });
    })
    .catch(function(error) {
        console.error('Error retrieving Instance ID token', error);
    });
}