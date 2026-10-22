/* Detailing Empire PWA, v1.1.0 */
const CACHE = 'detailing-empire-v1.1.0';
const ASSETS = ['./', './index.html', './styles.css?v=1.1.0', './game.js?v=1.1.0', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('detailing-empire-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if(event.data && event.data.type === 'SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if(request.method !== 'GET')return;
  const url = new URL(request.url);
  if(url.origin !== self.location.origin)return;
  if(request.mode === 'navigate'){
    event.respondWith(fetch(request).then(response => {
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put('./index.html',copy)))}
      return response;
    }).catch(async () => (await caches.match('./index.html')) || (await caches.match('./')) || Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)))}
    return response;
  })));
});
