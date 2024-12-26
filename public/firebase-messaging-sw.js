importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBxGPWeCoQzbkq1DQNGHr1MeTLbIrbnYmE",
  authDomain: "srmap-93b6e.firebaseapp.com",
  projectId: "srmap-93b6e",
  storageBucket: "srmap-93b6e.firebasestorage.app",
  messagingSenderId: "37171930820",
  appId: "1:37171930820:web:8daa234e5da6077418cb91"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: payload.data?.type || 'notification',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View',
      },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  // Navigate to the appropriate page based on notification type
  const data = event.notification.data;
  let url = '/';

  if (data?.type === 'connection_request' || data?.type === 'connection_accepted') {
    url = `/profile/${data.fromUserId}`;
  } else if (data?.type === 'profile_update') {
    url = `/profile/${data.userId}`;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // If a window is already open, focus it and navigate
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      return clients.openWindow(url);
    })
  );
}); 