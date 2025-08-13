const fetch = require('node-fetch');

function sendNotification(body) {
  return fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': 'key=' + process.env.GOOGLE_FIREBASE_CLOUD_MESSAGING_SERVER_KEY,
      'Content-Type': 'application/json'
    },
    body: body
  });
}

module.exports.sendNotification = sendNotification;