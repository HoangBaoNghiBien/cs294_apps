let urlToAdd = [
  "./",
  "./BigProject/index.html",
  "./BigProject//manifest.json",
  "./BigProject//chart.html",
  "./BigProject//news.html",
  "./BigProject//quotes.html",
  './BigProject//style.css',
  './BigProject//offline.html'
]


self.addEventListener('install', (event) => {
  event.waitUntill(
    caches.open('SERVICE_WORKER')
      .then((cache) => {
        console.log('cache openend');
        return cache.addAll(urlToAdd);
      })
      .catch(err => {
        console.log(err);
      })
  )
});

self.addEventListener('fetch', (event) => {
  console.log('fetch event');

  if (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request.url).catch(error => {
        // Return the offline page
        return caches.match('./offline.html');
      })
    );
  }
  else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) return response;

          return fetch(event.request);
        })
    )
  }
});

self.addEventListener('activate', (event) => {

  const whiteList = ['SERVICE_WORKER', 'my-page'];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (whiteList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
})