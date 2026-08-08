const CACHE_NAME = 'sadka-cache-v1';

// قائمة بجميع ملفات المشروع التي سيتم حفظها للعمل بدون إنترنت
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './apple-touch-icon.png',
  './icon-72.png',
  './icon-96.png',
  './icon-128.png',
  './icon-144.png',
  './icon-152.png',
  './icon-192.png',
  './icon-384.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

// 1. التثبيت وحفظ جميع الملفات في الكاش عند فتح الموقع لأول مرة
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('جاري حفظ ملفات التطبيق للعمل بدون إنترنت...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. تفعيل السيرفيس وركر وتحديث الكاش القديم إن وجد
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('حذف الكاش القديم:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. عرض الملفات المحفوظة عند انقطاع الإنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان الملف محفوظاً يعرضه، وإلا يحاول إحضاره من الإنترنت
        return response || fetch(event.request);
      })
  );
});