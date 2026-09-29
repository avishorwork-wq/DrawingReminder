importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCnBht8Ivsc3sAS-RQ8imzZuqB6TA5txFM",
  authDomain: "drawing-app-reminder.firebaseapp.com",
  projectId: "drawing-app-reminder",
  storageBucket: "drawing-app-reminder.firebasestorage.app",
  messagingSenderId: "698327080230",
  appId: "1:698327080230:web:6dc19d338a0af044d2b5e7"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  console.log(
    "[firebase-messaging-sw.js] Background message:",
    payload
  );

  const title =
    payload.notification?.title ||
    "🎨 Drawing Reminder";

  const options = {
    body:
      payload.notification?.body ||
      "Time to draw! ✏️",
    icon: "./icon-192.png",
    badge: "./icon-192.png"
  };

  self.registration.showNotification(
    title,
    options
  );

});
