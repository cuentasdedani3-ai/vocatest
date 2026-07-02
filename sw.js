// VocaTest Perú — Service Worker
const CACHE = 'vocatest-v2';
const ARCHIVOS = [
  '/',
  '/index.html',
  '/icon-192.png',
  '/icon-512.png',
];

// Instalar y cachear archivos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

// Activar y limpiar caches anteriores
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Servir desde cache — funciona sin internet
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).catch(() =>
        caches.match('/index.html')
      );
    })
  );
});
