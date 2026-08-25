importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

const urlParams = new URLSearchParams(self.location.search);

const firebaseConfig = {
  apiKey: urlParams.get('apiKey') || 'AIzaSyAEJgyo236nSN3o10MJ4XEcK1rJEeMAQEk',
  authDomain: urlParams.get('authDomain') || 'raksha-ai-5e91e.firebaseapp.com',
  projectId: urlParams.get('projectId') || 'raksha-ai-5e91e',
  storageBucket: urlParams.get('storageBucket') || 'raksha-ai-5e91e.appspot.com',
  messagingSenderId: urlParams.get('messagingSenderId') || '1008970376200',
  appId: urlParams.get('appId') || '1:1008970376200:web:5cc9d85dcb578b9cae5dbd'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

// Handle Background Push Notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Push Received:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || '🚨 RAKSHA AI — LANDSLIDE WARNING';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'EXTREME landslide risk detected in Zone 4. Please move to a safe location.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'raksha-ai-disaster-alert',
    data: payload.data || {},
    vibrate: [200, 100, 200, 100, 400],
    requireInteraction: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle Notification Click Action
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
