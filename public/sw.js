const CACHE_NAME = 'srmap-v1';

// Add the URLs you want to cache
const urlsToCache = [
  '/',
  '/mess',
  '/events',
  '/discover',
  '/profile',
  '/offline',
  '/manifest.json',
  '/icons/android/android-launchericon-192-192.png',
  '/icons/android/android-launchericon-512-512.png',
];

// Install event - cache the essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Advanced fetch event with network-first strategy for API calls and cache-first for static assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // API calls - Network first, then cache
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets - Cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));

          return response;
        });
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.mode === 'navigate') {
          return caches.match('/offline');
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncData') {
    event.waitUntil(
      // Implement your sync logic here
      syncData()
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/android/android-launchericon-192-192.png',
    badge: '/icons/android/android-launchericon-72-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/android/android-launchericon-48-48.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/android/android-launchericon-48-48.png'
      },
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SRM AP Connect', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Handle explore action
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 