const CACHE_NAME = 'noisy-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/main.js',
  './js/audio/audioEngine.js',
  './js/audio/noiseGen.js',
  './js/audio/sineComposer.js',
  './js/viz/waveform.js',
  './js/viz/fftBars.js',
  './js/ui/noiseControls.js',
  './js/ui/clockMode.js',
  './js/ui/composerControls.js',
  './worklets/noise-processor.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// Install: cache all assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
