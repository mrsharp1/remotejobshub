self.addEventListener('push', function (event) {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();
    
    const title = data.title || 'Remote Jobs Hub';
    const options = {
      body: data.body || 'You have a new notification.',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png', // Optional, standard for Android
      vibrate: [100, 50, 100], // Vibration pattern
      data: {
        url: data.url || '/',
        notification_id: data.notification_id || Date.now().toString(),
        type: data.type || 'system'
      },
      // You can also specify tags to replace existing notifications of the same type
      tag: data.notification_id || 'system-notification',
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('Error parsing push notification data:', err);
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const targetUrl = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Find ANY open window of our origin
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          return client.focus().then(c => {
             return c.navigate(targetUrl);
          });
        }
      }
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
