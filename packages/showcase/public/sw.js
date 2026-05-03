// Penny Wise I.T showcase — service worker
// Cache strategy:
//   - HTML (Accept: text/html): network-first, fall back to cache, fall back to "/"
//   - Static assets (everything else, same-origin GET): cache-first
//   - Anything containing "/api/": never cached (defensive)

const CACHE_NAME = 'pennywise-showcase-v2';
const PRECACHE_URLS = [
  '/',
  '/apps',
  '/numbers',
  '/roi',
  '/pricing',
  '/about',
  '/faq',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/api/')) return; // never cache API calls

  const accept = req.headers.get('accept') || '';
  const isHtml = req.mode === 'navigate' || accept.includes('text/html');

  if (isHtml) {
    // Network-first for HTML so updates ship immediately.
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone()).catch(() => {});
        return fresh;
      } catch {
        const cached = await caches.match(req);
        if (cached) return cached;
        const root = await caches.match('/');
        if (root) return root;
        return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  // Cache-first for static assets (icons, manifest, etc.)
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      if (fresh.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone()).catch(() => {});
      }
      return fresh;
    } catch {
      const root = await caches.match('/');
      if (root) return root;
      return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});
