// Название вашего кэша
var CACHE_NAME = 'my-cache-new-0.1';

// Список ресурсов, которые вы хотите кэшировать
var urlsToCache = [
  '/',
  '/index.html?v=4',
  '/style.css?v=4',
  '/icon.png?v=4'
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
