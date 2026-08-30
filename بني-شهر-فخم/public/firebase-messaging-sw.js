// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyCn3ODA1matl61SIT-fSdmsc9qKfobASwE",
  authDomain: "hip-bebop-wlcf1.firebaseapp.com",
  projectId: "hip-bebop-wlcf1",
  storageBucket: "hip-bebop-wlcf1.firebasestorage.app",
  messagingSenderId: "258135154675",
  appId: "1:258135154675:web:f459da594f656b1d857c86"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'إشعار جديد - منصة ديار بني شهر';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'لديك تنبيه فوري جديد في المنصة.',
    icon: payload.notification?.icon || '/src/assets/images/app_icon_logo_1787489594079.jpg',
    badge: '/src/assets/images/app_icon_logo_1787489594079.jpg',
    dir: 'rtl',
    lang: 'ar',
    tag: payload.data?.tag || 'bani_shahr_push_' + Date.now(),
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.actionUrl || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
