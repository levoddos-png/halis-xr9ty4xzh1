/**
 * HALİS QR Web Menü — Ana Uygulama Giriş Noktası
 */

import { loadMenuData, getProduct, getProductImage } from './data.js';
import { router } from './router.js';
import { sound } from './audio.js';
import { theme } from './theme.js';
import { cart } from './cart.js';
import { animateButtonPress } from './transitions.js';
import { showToast } from './components.js';
import { ik } from './icons.js';

// Konsol hatalarını izleme
window.__consoleErrors = [];
window.addEventListener('error', (e) => {
  window.__consoleErrors.push(e.message || String(e));
});
window.addEventListener('unhandledrejection', (e) => {
  window.__consoleErrors.push(e.reason ? (e.reason.message || String(e.reason)) : 'Unhandled rejection');
});

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      // Göreli yol (GitHub Pages alt klasörleri veya yerel sunucu için)
      const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      // Güncelleme kontrolü
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (err) {
      console.warn('Service Worker kaydı yapılamadı (file:// veya izin kısıtı):', err);
    }
  }
}

async function bootstrap() {
  // Menü verisini yükle
  await loadMenuData();

  // PWA Service Worker kaydı
  registerServiceWorker();

  // Genel buton basma mikromimiği ve dokunma sesi
  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('button, .kart, .renk-kart, .secim, .satir, .cip');
    if (btn) {
      if (!btn.hasAttribute('data-action') && !btn.id?.includes('adet') && !btn.closest('[data-nav]')) {
        sound.play('dokunma');
      }
      animateButtonPress(btn);
    }
  }, { passive: true });

  // Global tıklama delegasyonu
  document.addEventListener('click', (e) => {
    // 1) Altbar gezinme
    const navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      e.preventDefault();
      const hash = navBtn.dataset.hash || '#/';
      sound.play('kategori-gecis');
      router.navigate(hash);
      return;
    }

    // 2) Tema değiştirici
    const temaBtn = e.target.closest('[data-action="tema-toggle"]');
    if (temaBtn) {
      e.preventDefault();
      sound.play('dokunma');
      theme.toggleTheme();
      return;
    }

    // 3) Ses aç/kapat
    const sesBtn = e.target.closest('[data-action="ses-toggle"]');
    if (sesBtn) {
      e.preventDefault();
      sound.toggleSound();
      return;
    }

    // 4) Arama butonu
    const araBtn = e.target.closest('[data-action="ara"]');
    if (araBtn) {
      e.preventDefault();
      sound.play('dokunma');
      router.navigate('#/arama');
      return;
    }

    // 5) Geri butonu
    const geriBtn = e.target.closest('[data-action="geri"]');
    if (geriBtn) {
      e.preventDefault();
      sound.play('geri');
      router.goBack();
      return;
    }

    // 6) Hızlı listeye ekle (+) butonu
    const hizliEkleBtn = e.target.closest('[data-action="hizli-ekle"]');
    if (hizliEkleBtn) {
      e.preventDefault();
      e.stopPropagation();
      const pId = hizliEkleBtn.dataset.id;
      const product = getProduct(pId);
      if (product) {
        const portion = product.porsiyon[0] || [product.ad, product.fiyat];
        cart.addItem({
          productId: product.id,
          ad: product.ad,
          portionIndex: 0,
          portionName: portion[0],
          unitPrice: portion[1],
          quantity: 1,
          image: getProductImage(product.id, '@600.webp')
        });
        sound.play('listeye-ekle');
        showToast('Listene eklendi', `1 × ${product.ad} (${portion[0]})`, getProductImage(product.id, '@600.webp'));
      }
      return;
    }
  });

  // Ses durumu değiştiğinde arayüzdeki ses butonlarını güncelle
  sound.onChange((enabled) => {
    const sesButtons = document.querySelectorAll('[data-action="ses-toggle"]');
    sesButtons.forEach(btn => {
      btn.innerHTML = ik(enabled ? 'sesAcik' : 'sesKapali');
    });
  });

  // Tema durumu değiştiğinde arayüzdeki tema butonlarını güncelle
  theme.onChange((themeName) => {
    const isDark = themeName === 'koyu';
    const temaButtons = document.querySelectorAll('[data-action="tema-toggle"]');
    temaButtons.forEach(btn => {
      btn.innerHTML = ik(isDark ? 'gunes' : 'ay');
    });
  });

  // Yönlendiriciyi başlat
  router.init();
}

window.addEventListener('DOMContentLoaded', bootstrap);
