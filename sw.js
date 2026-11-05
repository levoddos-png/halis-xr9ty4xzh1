/**
 * HALİS QR Web Menü — Service Worker v2.0
 * Çevrimdışı çalışma, statik varlıklar ve menu.json önbellekleme,
 * sürümlü önbellek yönetimi ve eski önbellek temizleme.
 * Göreli yollarla çalışır (GitHub Pages alt klasörleri veya yerel sunucu).
 */

const CACHE_NAME = 'halis-qr-v2.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/app.css',
  './data/menu.json',
  './fonts/BricolageGrotesque-VF.ttf',
  './fonts/PlusJakartaSans-VF.ttf',
  './fonts/Shrikhand-Regular.ttf',
  './js/app.js',
  './js/data.js',
  './js/icons.js',
  './js/audio.js',
  './js/components.js',
  './js/transitions.js',
  './js/router.js',
  './js/cart.js',
  './js/theme.js',
  './js/views/home.js',
  './js/views/category.js',
  './js/views/detail.js',
  './js/views/splash.js',
  './js/views/search.js',
  './js/views/about.js',
  './js/views/listem.js',
  './assets/logo/halis-wordmark-acik.svg',
  './assets/logo/halis-wordmark-koyu.svg',
  './assets/logo/halis-wordmark-yalin-acik.svg',
  './assets/logo/halis-wordmark-yalin-koyu.svg',
  './assets/logo/halis-wordmark-animasyon.svg',
  './assets/ikonlar/ikon.svg',
  './assets/ikonlar/favicon-32.png',
  './assets/ikonlar/apple-touch-icon-180.png',
  './assets/ikonlar/ikon-192.png',
  './assets/ikonlar/ikon-512.png',
  './assets/ikonlar/ikon-maskable-192.png',
  './assets/ikonlar/ikon-maskable-512.png',
  './assets/sesler/dokunma.mp3',
  './assets/sesler/dokunma.ogg',
  './assets/sesler/geri.mp3',
  './assets/sesler/geri.ogg',
  './assets/sesler/kart-acilma.mp3',
  './assets/sesler/kart-acilma.ogg',
  './assets/sesler/kategori-gecis.mp3',
  './assets/sesler/kategori-gecis.ogg',
  './assets/sesler/listeye-ekle.mp3',
  './assets/sesler/listeye-ekle.ogg',
  './assets/sesler/ses-acik.mp3',
  './assets/sesler/ses-acik.ogg',
  './assets/urunler/1x1/baklava@600.webp',
  './assets/urunler/1x1/baklava.png',
  './assets/urunler/1x1/sutlac@600.webp',
  './assets/urunler/1x1/profiterol@600.webp',
  './assets/urunler/1x1/kazandibi@600.webp',
  './assets/urunler/1x1/trilece@600.webp',
  './assets/urunler/1x1/maras-dondurmasi@600.webp',
  './assets/urunler/1x1/kulah-dondurma@600.webp',
  './assets/urunler/1x1/fistikli-dondurma@600.webp',
  './assets/urunler/1x1/limon-sorbe@600.webp',
  './assets/urunler/1x1/cikolatali-dondurma@600.webp',
  './assets/urunler/1x1/simit@600.webp',
  './assets/urunler/1x1/peynirli-pogaca@600.webp',
  './assets/urunler/1x1/acma@600.webp',
  './assets/urunler/1x1/kurabiye@600.webp',
  './assets/urunler/1x1/tahinli-corek@600.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Başarısız olabilecek bireysel varlıkların kurulumu engellememesi için tek tek veya allSettled
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (e) {
          // Bazı formatlar veya dosya eksikliklerinde sessiz devam et
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  
  // Sadece GET isteklerini önbellekle
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // menu.json için Stale-While-Revalidate stratejisi (Önce önbellek, arka planda ağ güncellemesi)
  if (url.pathname.endsWith('menu.json')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(req).then((cachedResponse) => {
          const fetchPromise = fetch(req).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(req, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Statik varlıklar için Cache-First stratejisi
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(req).then((networkResponse) => {
        // Geçerli yanıtı önbelleğe al
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Çevrimdışı navigasyon isteğinde ana sayfaya düş
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
