const CACHE_NAME = 'task-list-v1.2'; // Incrementar a versão para forçar a atualização
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    './audio/lofi.mp3',
    './img/icon-192.png',
    './img/icon-512.png',
    './img/maskable-icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    // Estratégia "Stale-While-Revalidate"
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                // Retorna o cache imediatamente se disponível
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    // Atualiza o cache com a nova versão
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                // Retorna o cache antigo enquanto a rede busca a nova versão
                return response || fetchPromise;
            });
        })
    );
});

self.addEventListener('activate', event => {
    
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName); 
                }
            })
        ))
    );
});