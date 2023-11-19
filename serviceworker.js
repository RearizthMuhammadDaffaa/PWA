const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html'];

const self = this;

// Install SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Found in cache, return the response
        }

        // Not found in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, clonedResponse); // Store the fetched response in cache
              });
            return response;
          })
          .catch(() => caches.match('offline.html')); // If fetching fails, return offline.html
      })
  );
});

// Activate the SW
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (!cacheWhitelist.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});
