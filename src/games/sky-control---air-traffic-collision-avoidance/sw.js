// Sky Control Self-Unregistering Service Worker
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    self.registration.unregister().then(() => self.clients.matchAll()).then((clients) => {
      clients.forEach(client => {
        if (client.url && 'navigate' in client) {
          // Allow client to continue without SW interception
        }
      });
    }).catch(() => {})
  );
});

self.addEventListener('fetch', (e) => {
  // Let all network requests pass through natively to avoid MIME type or Response conversion errors
  return;
});
