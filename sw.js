const CACHE = 'birdpoint-v1';
const LOCAL = [
  './',
  './index.html',
  './birdpoint-data.json',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Cache local files on install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(LOCAL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Remove old caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Always use network for APIs and map tiles
  if (
    url.hostname.includes('openai.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('wikipedia.org') ||
    url.hostname.includes('openfreemap.org') ||
    url.hostname.includes('unpkg.com') ||
    url.hostname.includes('jsdelivr.net')
  ) {
    return; // let browser handle normally
  }

  // Cache-first for local files
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
