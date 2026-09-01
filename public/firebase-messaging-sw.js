importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Configuration will be injected automatically or loaded from URL params,
// but for standard Firebase Hosting it auto-discovers.
// Since this is custom hosted, we need to initialize app. 
// However, the best practice is to pass the config or use the default `firebase.initializeApp()` 
// if it's magically injected. Without hosting, we have to supply it. 
// Wait, passing it via URL query string during registration is one way, 
// but typically we can just define it here.

// It's safer to let the frontend service worker registration handle this, 
// or since we don't want secrets in git, we can use a generic script or 
// fetch the config from an API. But Firebase apiKey is safe to expose in frontend!
// I'll leave a placeholder here, but it's better to just use standard messaging.

const firebaseConfig = new URL(location).searchParams.get("config");
if (firebaseConfig) {
  firebase.initializeApp(JSON.parse(firebaseConfig));
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    

    const notificationTitle = payload.data?.title || 'New Notification';
    const notificationOptions = {
      body: payload.data?.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      silent: payload.data?.silent === 'true',
      data: {
        url: payload.data?.url || payload.data?.targetUrl || '/'
      }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification clicks for background messages
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          return client.focus().then((c) => c.navigate(targetUrl));
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
