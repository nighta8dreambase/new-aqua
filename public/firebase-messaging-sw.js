// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDzef8AiE3Fw8jPGnvJZHEreKYgl4kGWp0",
  authDomain: "aqua-dashboard.firebaseapp.com",
  databaseURL: "https://aqua-dashboard.firebaseio.com",
  projectId: "aqua-dashboard",
  storageBucket: "aqua-dashboard.appspot.com",
  messagingSenderId: "515081409051",
  appId: "1:515081409051:web:e5ecb915c3c9818f405ebe",
  measurementId: "G-RRXEWY2CJD"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

