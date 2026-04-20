// MatchOps Planner service worker — network-first, cache is an offline fallback only.
// Bump CACHE_VERSION any time you want to wipe older clients proactively;
// the combination of network-first + no-cache HTTP headers on HTML/SW means
// updates propagate on the first fetch, not after browser cache TTL.

const CACHE_VERSION = 'v14';
const CACHE_NAME = `matchops-planner-${CACHE_VERSION}`;
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
];

// Install: pre-cache the shell so first offline load works
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting(); // activate new SW right away
});

// Activate: nuke all old caches so stale versions can't linger
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim()) // take over open pages immediately
  );
});

// Fetch: network-first. Falls back to cache only if offline.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Only handle same-origin requests; let the browser handle everything else
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Fresh response — update cache in the background for offline use
        if (res && res.status === 200 && res.type !== 'opaque') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req)) // offline → serve cached copy if we have one
  );
});

// Allow the page to tell the SW to skip waiting / activate now
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
