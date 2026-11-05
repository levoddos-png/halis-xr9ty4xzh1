/**
 * HALİS QR Web Menü — Kategori Sayfası Görünümü
 * Renkli kategori bandı, yapışkan çipler, kayan hap ve 2 sütunlu ürün ızgarası.
 */

import { renderHeader, renderAltbar, renderProductCard, showToast } from '../components.js';
import { getCategory, getCategories, getProductsByCategory, formatTL } from '../data.js';
import { ik, DEKO, dekoEl } from '../icons.js';
import { animateStaggeredEntrance } from '../transitions.js';
import { sound } from '../audio.js';
import { theme } from '../theme.js';

export function renderCategoryView(container, categoryId = 'tatlilar', { onNavigateProduct, onNavigateHome, onCategoryChange }) {
  const currentCategory = getCategory(categoryId) || getCategory('tatlilar');
  const allCategories = getCategories();
  const products = getProductsByCategory(currentCategory.id);

  // Kategoriye özel retro dekorasyonlar
  const dekoHtml = {
    tatlilar: dekoEl(250, -50, DEKO.daire(90, 'rgba(255,255,255,.22)')) +
              dekoEl(296, 130, DEKO.halka(30, 'rgba(255,255,255,.5)', 8)) +
              dekoEl(30, 195, DEKO.dalga(120, 'rgba(15,27,61,.18)', 5)) +
              dekoEl(220, 90, DEKO.yildiz(20, '#FFF500')),
    dondurmalar: dekoEl(260, -40, DEKO.daire(100, 'rgba(255,255,255,.24)')) +
                 dekoEl(30, 180, DEKO.halka(32, 'rgba(255,255,255,.45)', 8)) +
                 dekoEl(230, 110, DEKO.yildiz(24, '#FFF500')) +
                 dekoEl(140, 200, DEKO.dalga(130, 'rgba(255,255,255,.2)', 5)),
    unlu: dekoEl(240, -50, DEKO.daire(90, 'rgba(48,103,58,.15)')) +
          dekoEl(290, 120, DEKO.halka(28, 'rgba(48,103,58,.25)', 8)) +
          dekoEl(40, 190, DEKO.dalga(120, 'rgba(227,121,47,.22)', 5)) +
          dekoEl(210, 80, DEKO.yildiz(22, '#E3792F'))
  }[currentCategory.id] || '';

  const chipsHtml = `
    <div class="cipler">
      <button class="cip" data-kat="hepsi">Tümü</button>
      ${allCategories.map(k => `
        <button class="cip ${k.id === currentCategory.id ? 'secili' : ''}" data-kat="${k.id}">
          <span class="renk" style="background:${k.renk}"></span>
          ${k.ad}
          <span class="sayi">${k.sayi || 5}</span>
        </button>
      `).join('')}
    </div>
  `;

  const html = `
    <div class="ekran kategori-ekran" data-ekran="kategori" data-kat="${currentCategory.id}">
      <main class="kaydir" id="kategoriKaydir">
        <!-- Renkli Kategori Bandı -->
        <section class="kat-bant" style="background:${currentCategory.renk}; color:${currentCategory.metin}">
          ${dekoHtml}

          <!-- Üst Eylem Butonları -->
          <div style="position:absolute; left:16px; right:16px; top:14px; display:flex; gap:8px; z-index:5">
            <button class="ikon-buton cam" aria-label="Geri" data-action="kategori-geri">
              ${ik('geri')}
            </button>
            <div style="flex:1"></div>
            <button class="ikon-buton cam" aria-label="Temayı Değiştir" data-action="tema-toggle" title="Temayı Değiştir">
              ${ik(theme.isDark() ? 'gunes' : 'ay')}
            </button>
            <button class="ikon-buton cam" aria-label="Ses" data-action="ses-toggle">
              ${ik(sound.isSoundEnabled() ? 'sesAcik' : 'sesKapali')}
            </button>
            <button class="ikon-buton koyu" aria-label="Ara" data-action="ara">
              ${ik('ara')}
            </button>
          </div>

          <!-- Kategori Başlığı -->
          <div class="kat-baslik">
            <div class="etiket" style="opacity:.75">Kategori · ${products.length} lezzet</div>
            <h1 class="h-ekran" style="margin-top:6px">${currentCategory.ad}</h1>
            <div style="margin-top:6px; font-weight:700; font-size:14px; opacity:.85">${currentCategory.aciklama}</div>
          </div>
        </section>

        <!-- Yapışkan Çipler -->
        <section class="kat-cipler" style="margin-top:-22px">
          ${chipsHtml}
        </section>

        <!-- 2 Sütun Ürün Izgarası -->
        <section class="izgara" style="margin-top:18px; padding-bottom:120px" data-izgara>
          ${products.map((u, i) => renderProductCard(u, i)).join('')}
        </section>
      </main>

      ${renderAltbar('menu')}
    </div>
  `;

  container.innerHTML = html;

  // Çiplerin yatay kaydırmasını seçili olana odakla
  const ciplerEl = container.querySelector('.cipler');
  const seciliCip = container.querySelector('.cip.secili');
  if (ciplerEl && seciliCip) {
    ciplerEl.scrollLeft = Math.max(0, seciliCip.offsetLeft - ciplerEl.offsetLeft - 20);
  }

  // Izgara kartları için kademeli (staggered) giriş animasyonu
  const izgara = container.querySelector('.izgara');
  if (izgara) {
    animateStaggeredEntrance(izgara, '.kart');
  }

  // Dinleyicileri bağla
  setupCategoryListeners(container, { onNavigateProduct, onNavigateHome, onCategoryChange });
}

function setupCategoryListeners(container, { onNavigateProduct, onNavigateHome, onCategoryChange }) {
  // Geri butonu
  const geriBtn = container.querySelector('[data-action="kategori-geri"]');
  if (geriBtn) {
    geriBtn.addEventListener('click', () => {
      sound.play('geri');
      if (onNavigateHome) onNavigateHome();
    });
  }

  // Kart tıklamaları (Detay sayfasına shared-element geçiş)
  const cards = container.querySelectorAll('.kart');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Hızlı ekle artı butonuna tıklandıysa detaya gitme
      if (e.target.closest('[data-action="hizli-ekle"]')) return;
      sound.play('kart-acilma');
      const urunId = card.dataset.urun;
      if (onNavigateProduct) onNavigateProduct(urunId, card);
    });
  });

  // Hızlı ekle (+) butonları
  const artiButtons = container.querySelectorAll('[data-action="hizli-ekle"]');
  artiButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.play('listeye-ekle');
      const card = btn.closest('.kart');
      const ad = card ? card.querySelector('.ad')?.textContent : 'Ürün';
      const imgSrc = card ? card.querySelector('img')?.src : '';
      showToast('Listene eklendi', `1 × ${ad}`, imgSrc);
    });
  });

  // Kategori çipleri tıklama (Kategori değiştirme)
  const chips = container.querySelectorAll('.cip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      sound.play('kategori-gecis');
      const targetKat = chip.dataset.kat;
      if (targetKat === 'hepsi') {
        if (onNavigateHome) onNavigateHome();
      } else {
        if (onCategoryChange) onCategoryChange(targetKat);
      }
    });
  });

  // Ses butonu tıklama
  const sesBtn = container.querySelector('[data-action="ses-toggle"]');
  if (sesBtn) {
    sesBtn.addEventListener('click', () => {
      sound.toggleSound();
      sesBtn.innerHTML = sound.isSoundEnabled()
        ? '<svg class="ikon" viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18.3 6.4a8 8 0 0 1 0 11.2"/></svg>'
        : '<svg class="ikon" viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
    });
  }
}
