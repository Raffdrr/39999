const CACHE_NAME = 'socialmix-app-cache-v2';
// Expanded list of URLs to cache for a more robust offline experience.
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  'https://placehold.co/192x192/f43f5e/ffffff?text=SM',
  'https://placehold.co/512x512/f43f5e/ffffff?text=SM'
];

// Install event: open cache and add core files.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: implement "network-first, then cache" strategy.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If we get a valid response, clone it, cache it, and return it.
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // If the network request fails (e.g., offline), try to serve from cache.
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // If not in cache either, this would be the place for a fallback offline page if we had one.
          });
      })
  );
});