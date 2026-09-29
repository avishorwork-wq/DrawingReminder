const CACHE_NAME = "drawing-reminder-v2";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

/* =========================================================
   FIREBASE CLOUD MESSAGING
   ========================================================= */

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


/* =========================================================
   BACKGROUND NOTIFICATIONS
   ========================================================= */

messaging.onBackgroundMessage(function(payload) {

  console.log(
    "[service-worker.js] Background message:",
    payload
  );

  const title =
    payload.notification?.title ||
    "🎨 Drawing Reminder";

  const body =
    payload.notification?.body ||
    "Time to draw! ✏️";

  const options = {
    body: body,

    icon: "./icon-192.png",

    badge: "./icon-192.png",

    tag: "drawing-reminder",

    renotify: true
  };

  self.registration.showNotification(
    title,
    options
  );

});


/* =========================================================
   NOTIFICATION CLICK
   ========================================================= */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true
      })

      .then(clientList => {

        for (const client of clientList) {

          if (
            "focus" in client
          ) {

            return client.focus();

          }

        }

        if (
          clients.openWindow
        ) {

          return clients.openWindow(
            "./"
          );

        }

      })

    );

  }
);


/* =========================================================
   PWA CACHE
   ========================================================= */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(cache => {

          return cache.addAll(
            FILES
          );

        })

    );

    self.skipWaiting();

  }
);


self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(keys => {

          return Promise.all(

            keys

              .filter(
                key =>
                  key !== CACHE_NAME
              )

              .map(
                key =>
                  caches.delete(key)
              )

          );

        })

        .then(() =>
          self.clients.claim()
        )

    );

  }
);


/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener(
  "fetch",
  event => {

    if (
      event.request.method !== "GET"
    ) {
      return;
    }

    event.respondWith(

      caches
        .match(event.request)
        .then(cached => {

          if (cached) {
            return cached;
          }

          return fetch(
            event.request
          );

        })

    );

  }
);
