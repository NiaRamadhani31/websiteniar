const CACHE_NAME = 'v1';
const urlsToCache = [
    '/',
    'index.html',
    'about.html',
    'contact.html',
    'style.css',
    'nia.jpg',
    'icon-192x192.png',
    'icon-512x512.png',
    'offline.html'  // Tambahkan halaman offline
];

// Install service worker dan cache file
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Ambil file dari cache atau jaringan
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                return caches.match('offline.html');  // Tampilkan halaman offline jika jaringan tidak tersedia
            });
        })
    );
});

// Menghapus cache yang tidak diperlukan
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
