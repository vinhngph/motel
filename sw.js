const CACHE_NAME = "tro-muoi-v1.1.1";

const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/assets/css/bootstrap.min.css",
    "/assets/js/bootstrap.bundle.min.js",
    "/assets/js/index.js",
    "/assets/icons/motel_192.png",
    "/assets/icons/motel_512.png"
]

self.addEventListener("install", event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    )
})

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        })
    )

    self.clients.claim();
})

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    )
})