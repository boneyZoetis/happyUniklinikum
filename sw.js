/**
 * Service Worker for UMF Expertenstandards & Pflege-Pocketcards
 * Provides high-speed offline access, instant asset loading, and PWA capabilities in clinical environments.
 */

const CACHE_NAME = 'umf-pocketcards-v20261021-07';

const STATIC_ASSETS = [
  './',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'js/parser.js',
  'manifest.json',
  'assets/favicon.svg',
  'assets/umf-logo.jpg',
  'assets/qh-icon-dekubitus.jpg',
  'assets/qh-icon-sturz.jpg',
  'assets/qh-icon-schmerz.jpg',
  'assets/qh-icon-ernaehrung.jpg',
  'assets/qh-icon-zvk.jpg',
  'assets/qh-icon-isolation.jpg',
  'assets/qh-dekubitus.jpg',
  'assets/qh-sturz.jpg',
  'assets/qh-schmerz.jpg',
  'assets/qh-ernaehrung.jpg',
  'assets/qh-zvk.jpg',
  'assets/qh-isolation.jpg',
  'assets/graphic-isolation.jpg',
  'assets/isolation-poster.jpg'
];

// Install: Cache core assets for offline clinical use
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets could not be pre-cached:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate strategy for static resources & network-first for navigation
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Ignore chrome-extension or external third-party non-GET
  if (!req.url.startsWith('http')) return;

  // Navigation requests: Network first with cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('index.html') || caches.match('./'))
    );
    return;
  }

  // Assets (images, css, js, fonts): Cache-first with background network update
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});
