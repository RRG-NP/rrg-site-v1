/*
 * RRG Tech service worker — conservative caching for installability + offline.
 *
 * Strategy (chosen to never serve stale content):
 *   - Navigations (HTML)      → network-first, fall back to cache, then /offline.html
 *   - Hashed static assets    → cache-first w/ background refresh (safe: content-hashed)
 *   - Everything else (GET)    → network-first, fall back to cache
 *   - /api/* and cross-origin  → not intercepted (always hit the network)
 *
 * Bump CACHE_VERSION to force a clean rollover on the next visit.
 */
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `rrg-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `rrg-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

const PRECACHE = [OFFLINE_URL, '/favicon-32x32.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isHashedStatic(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/fonts/') ||
    /\.(?:woff2?|ttf|otf|png|jpg|jpeg|webp|avif|svg|ico)$/.test(url.pathname)
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GETs. Leave POSTs, APIs and cross-origin to the network.
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // HTML navigations: network-first so content is always fresh; offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        return cached || (await caches.match(OFFLINE_URL));
      }),
    );
    return;
  }

  // Content-hashed assets: cache-first, refresh in the background.
  if (isHashedStatic(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  // Other GETs: network-first, fall back to whatever we have cached.
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
