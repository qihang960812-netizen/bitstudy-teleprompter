'use strict';

const scope = self.registration.scope;
const cachePrefix = 'bitstudy-teleprompter:' + scope + ':';
const cacheName = cachePrefix + 'v1';
const shell = [
  './', './index.html', './follow.js', './manifest.webmanifest',
  './bit-study-brand.png', './bit-study-home-180.png', './bit-study-home-192.png',
  './bit-study-home-512.png', './bit-study-home-maskable.png', './speech/mic.js'
];
const speech = [
  './speech/vosk-local-v2.js', './speech/vosk.wasm',
  './speech/mandarin-0.bin', './speech/mandarin-1.bin', './speech/mandarin-2.bin'
];
const appUrl = path => new URL(path, scope).href;
const knownAssets = new Set([...shell, ...speech].map(appUrl));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(shell.map(path => new Request(appUrl(path), { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(cachePrefix) && name !== cacheName)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !url.href.startsWith(scope) || request.headers.has('Range')) return;
  const navigatesToApp = request.mode === 'navigate' && (
    url.pathname === new URL(scope).pathname || url.pathname === new URL('index.html', scope).pathname
  );
  if (!navigatesToApp && !knownAssets.has(url.href)) return;

  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const key = navigatesToApp ? scope : request;
    const saved = await cache.match(key);
    if (saved) return saved;
    const response = await fetch(request);
    if (response.ok) await cache.put(key, response.clone()).catch(() => {});
    return response;
  })());
});
