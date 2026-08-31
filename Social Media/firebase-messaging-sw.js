/* global importScripts, firebase */
// Service worker for background push notifications.
// MUST live at the site root (/firebase-messaging-sw.js) — the browser
// only allows a service worker to control pages at or below its own path.

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
);

// same web config as the page — safe to expose, these are public identifiers
firebase.initializeApp({
    apiKey: "AIzaSyAeTHtdegOxEO_T4avF0Hjf1a9pXsoOguk",
  authDomain: "social-media-c31b9.firebaseapp.com",
  projectId: "social-media-c31b9",
  storageBucket: "social-media-c31b9.firebasestorage.app",
  messagingSenderId: "826170862253",
  appId: "1:826170862253:web:f162af54e07c49a528f424",
  measurementId: "G-BWEXVKH01Q"
});

const messaging = firebase.messaging();

// fires when a push arrives while the tab is closed or in the background
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] background message:", payload);

  self.registration.showNotification(
    payload.notification?.title ?? "Social App",
    {
      body: payload.notification?.body ?? "",
      data: payload.data,
      requireInteraction: true,
    },
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
