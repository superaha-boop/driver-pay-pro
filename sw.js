const CACHE_NAME = "driver-pay-pro-v37";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles/design-system.css",
  "./manifest.webmanifest",
  "./assets/driver-pay-pro-master-icon.png",
  "./assets/driver-pay-pro-icon-512.png",
  "./assets/driver-pay-pro-icon-192.png",
  "./assets/driver-hero.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const isNavigation = event.request.mode === "navigate";
  const networkRequest = isNavigation
    ? new Request(event.request, { cache: "no-store" })
    : event.request;
  event.respondWith(
    fetch(networkRequest)
      .then(response => {
        if (isNavigation && !response.ok) {
          return caches.match("./index.html").then(cached => cached || response);
        }
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          const cacheKey = isNavigation ? "./index.html" : event.request;
          caches.open(CACHE_NAME).then(cache => cache.put(cacheKey, copy));
        }
        return response;
      })
      .catch(() => isNavigation ? caches.match("./index.html") : caches.match(event.request))
  );
});
