const CACHE_NAME = 'task-list-v2'; // Altere o dado v (ex v1, v2, ...) para atualizar a aplicaçao PWA em smarphones
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'icon-192.png',
    './audio/lofi.mp3' // Adiciona o arquivo de áudio ao cache
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        // Tenta encontrar o recurso no cache primeiro
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', event => {
    // Este evento é acionado quando o novo service worker é ativado.
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName); // Deleta o cache se não estiver na "lista branca"
                }
            })
        ))
    );
});
