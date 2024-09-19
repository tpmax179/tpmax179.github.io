// Название вашего кэша
var CACHE_VERSION = "0.8";
var CACHE_NAME = `my-cache-new-${CACHE_VERSION}`;

// Список ресурсов, которые вы хотите кэшировать
var urlsToCache = [
  '/',
  `/index.html?v=${CACHE_VERSION}`,
  `/style.css?v=${CACHE_VERSION}`,
  `/icon.png?v=${CACHE_VERSION}`
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Открываю новый кэш:', CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаляю старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('Новый сервис-воркер активирован и старые кэши удалены');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Возвращаю ресурс из кэша:', event.request.url);
        return response;
      }
      return fetch(event.request);
    })
  );
});
