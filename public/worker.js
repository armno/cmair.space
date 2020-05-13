const BUILD_NUMBER = '30';
const cacheName = `cm-aqi-${BUILD_NUMBER}`;
const dataCacheName = `cm-aqi-data-${BUILD_NUMBER}`;
const appShell = [
  '/',
  '/index.html',
  '/app-icon-192.png',
  '/css/main.css',
  '/js/main.js',
];

self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Install');

  // caching appshell
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(appShell);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName && key !== dataCacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  console.log('[ServiceWorker] Fetch', e.request.url);
  const dataUrl = '/api';
  if (e.request.url.indexOf(dataUrl) > -1) {
    console.log('[ServiceWorker] Returning cached API data');
    e.respondWith(
      caches.open(dataCacheName).then((cache) => {
        return fetch(e.request).then((response) => {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    console.log('[ServiceWorker] Requesting ...');
    e.respondWith(
      caches
        .match(e.request, {
          ignoreSearch: true,
        })
        .then((response) => {
          return response || fetch(e.request);
        })
    );
  }
});
