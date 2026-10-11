const CACHE = "maalam-shell-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      fetch(new Request("./", { cache: "reload" }))
        .then((response) => cache.put("./", response))
        .catch(() => undefined),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      ),
    ]),
  );
});

// Cached shell first: repeat launches feel immediate, like an installed app.
// A fresh copy is fetched in the background and used on the next launch.
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  const refresh = caches.open(CACHE).then((cache) =>
    fetch(event.request).then((response) => {
      if (response.ok) void cache.put("./", response.clone());
      return response;
    }),
  );
  event.waitUntil(refresh.catch(() => undefined));
  event.respondWith(
    caches.match("./").then((cached) => cached || refresh).catch(() => Response.error()),
  );
});