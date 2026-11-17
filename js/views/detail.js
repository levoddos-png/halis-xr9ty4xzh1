/**
 * HALİS QR Web Menü — Ürün Detay Sayfası Görünümü
 * Parallax kaydırma, porsiyon ve adet seçimi, ürünler arası yatay swipe ve ters geçiş.
 */

import { renderBadge, showToast, renderLangButton, renderTukendiBadge } from '../components.js';
import {
  getProduct, getCategory, getProductsByCategory, formatTL, getProductImage,
  loc, t, getProductSizes, getProductExtras, computeItemPrice, getAllergenLabel
} from '../data.js';
import { ik, DEKO, dekoEl } from '../icons.js';
import { sound } from '../audio.js';
import { theme } from '../theme.js';
import { cart } from '../cart.js';
import { animateButtonPress, transitionDetailToPrevious } from '../transitions.js';

export function renderDetailView(container, productId = 'baklava', { onNavigateBack, onSwitchProduct }) {
  const product = getProduct(productId);
  if (!product || product.gizli) {
    container.innerHTML = `<div class="ekran" style="padding:40px 24px;text-align:center">
      <h1 class="h1">${t('gizli_urun')}</h1>
      <button class="buton ikincil" style="margin-top:20px" data-action="geri">${t('geri')}</button>
    </div>`;
    return;
  }
  const category = getCategory(product.kat) || { ad: '', renk: '#1A49AF', metin: '#0F1B3D', acik: 'var(--yuzey-2)' };
  const categoryProducts = getProductsByCategory(product.kat);
  const currentIndex = categoryProducts.findIndex(p => p.id === product.id);
  const sizes = getProductSizes(product);
  const extras = getProductExtras(product);
  const ad = loc(product.ad);

  let selectedPortionIndex = 0;
  let quantity = 1;
  const unitPrice = sizes[0] ? sizes[0].fiyat : product.fiyat;
  const totalPrice = unitPrice * quantity;

  // Dekorasyonlar
  const dekoHtml = `
    ${dekoEl(-40, 60, DEKO.daire(70, 'rgba(255,255,255,.2)'))}
    ${dekoEl(290, 300, DEKO.halka(44, 'rgba(255,255,255,.45)', 10))}
    ${dekoEl(40, 380, DEKO.serpinti('#FFF500', 30))}
    ${dekoEl(320, 110, DEKO.yildiz(24, '#FFF500'))}
    ${dekoEl(60, 330, DEKO.yildiz(14, '#0F1B3D'))}
  `;

  const portionsHtml = `
    <div class="segment" id="porsiyonSegment">
      ${sizes.map((p, idx) => `
        <button class="${idx === selectedPortionIndex ? 'secili' : ''}" data-idx="${idx}" data-boy="${p.id}">
          ${loc(p.ad)}
          <small>${formatTL(p.fiyat)}</small>
        </button>
      `).join('')}
    </div>
  `;

  const extrasHtml = extras.length ? `
        <div class="kademe" style="margin-top:16px">
          <div class="etiket" style="color:var(--metin-2); margin-bottom:8px">${t('ekstra')}</div>
          <div class="ekstra-liste" id="ekstraListe">
            ${extras.map(e => `
              <label class="ekstra-satir">
                <input type="checkbox" data-ekstra="${e.id}" value="${e.id}">
                <span>${loc(e.ad)}</span>
                <span class="fiyat kucuk-f duz">+${formatTL(e.fiyat)}</span>
              </label>
            `).join('')}
          </div>
        </div>` : '';

  const allergenIds = product.alerjen && product.alerjen.length ? product.alerjen : [];
  const allergenLabels = allergenIds.length ? allergenIds.map(getAllergenLabel) : [t('alerjen_yok')];

  const html = `
    <div class="ekran detay-ekran" data-ekran="detay" style="background:${category.renk}">
      <!-- Üst Renkli Alan (Parallax & Morf Katmanı) -->
      <div class="detay-ust" style="background:${category.renk}" id="detayUst">
        ${dekoHtml}
        
        <!-- Ürün Görseli Tabak -->
        <div class="detay-tabak-alani">
          <div class="tabak detay-tabak" id="detayTabak" title="Sağa veya sola kaydırarak diğer ürünlere geçebilirsiniz">
            <img src="${getProductImage(product.id)}" alt="${ad}" id="detayGorsel">
          </div>
        </div>
      </div>

      <!-- Üst Çubuk Butonları (Geri, Başlık, Tema, Ses, Favori) -->
      <header class="detay-butonlar">
        <button class="ikon-buton cam" aria-label="Geri Dön" data-action="detay-geri">
          ${ik('geri')}
        </button>
        <div class="detay-baslik-gizli" id="detayGizliBaslik" style="color:${category.metin}">
          ${ad}
        </div>
        <div style="flex:1"></div>
        ${renderLangButton(true)}
        <button class="ikon-buton cam" aria-label="Tema" data-action="tema-toggle" title="Tema">
          ${ik(theme.isDark() ? 'gunes' : 'ay')}
        </button>
        <button class="ikon-buton cam" aria-label="Ses" data-action="ses-toggle">
          ${ik(sound.isSoundEnabled() ? 'sesAcik' : 'sesKapali')}
        </button>
        <button class="ikon-buton cam" aria-label="Favorilere Ekle" id="detayKalpBtn" style="color:var(--renk-mandalina)">
          ${ik('kalp')}
        </button>
      </header>

      <!-- Aşağıdan Yukarı Kayar Beyaz Panel -->
      <div class="panel" id="detayPanel">
        <div class="tutamac"></div>

        <!-- Rozetler -->
        <div class="kademe">
          <div class="rozetler">
            ${product.tukendi ? renderTukendiBadge() : ''}
            ${(product.rozet || []).map(renderBadge).join('')}
            <span class="rozet" style="background:${category.acik}; color:var(--renk-gece)">${loc(category.ad)}</span>
          </div>
        </div>

        <!-- Başlık & Fiyat -->
        <div class="kademe" style="display:flex; align-items:flex-start; gap:12px; margin-top:12px">
          <h1 class="h1" style="flex:1; color:var(--baslik)">${ad}</h1>
          <span class="fiyat buyuk" id="detayFiyatBadge" style="margin-top:2px">${formatTL(unitPrice)}</span>
        </div>

        <!-- Kısa Açıklama -->
        <div class="kademe" style="margin-top:8px; font-size:15px; line-height:1.5; color:var(--metin-2); font-weight:500">
          ${loc(product.kisa)}
        </div>

        <!-- Porsiyon Seçimi -->
        <div class="kademe" style="margin-top:18px">
          <div class="etiket" style="color:var(--metin-2); margin-bottom:8px">${sizes.length > 1 ? t('boy') : t('porsiyon')}</div>
          ${portionsHtml}
        </div>
        ${extrasHtml}

        <!-- Kaydırınca Açılan Gizli İçerik (Alerjen & İçindekiler) -->
        <div class="kademe gizli-icerik" style="margin-top:22px">
          <div class="etiket" style="color:var(--metin-2); margin-bottom:8px">${t('alerjenler')}</div>
          <div style="display:flex; flex-wrap:wrap; gap:6px">
            ${allergenLabels.map(a => `<span class="alerjen"><b>${(a || '?')[0]}</b>${a}</span>`).join('')}
          </div>

          <div class="etiket" style="color:var(--metin-2); margin:18px 0 6px">${t('icindekiler')}</div>
          <div style="font-size:14px; line-height:1.55; color:var(--metin)">
            ${loc(product.icindekiler)}
          </div>

          <div class="kucuk" style="margin-top:12px; font-size:12px; opacity:.8">
            ${t('alerjen_not')}
          </div>
        </div>
      </div>

      <!-- Sabit Alt CTA Çubuğu (Adet & Listeme Ekle) -->
      <footer class="cta-sabit">
        <div style="display:flex; gap:10px; align-items:center">
          <!-- Adet Seçici -->
          <div class="segment" style="width:122px; flex:none; background:var(--yuzey-2)">
            <button id="adetEksi" aria-label="Adet azalt">${ik('eksi')}</button>
            <button class="secili" id="adetSayi" style="font-size:16px; cursor:default">${quantity}</button>
            <button id="adetArti" aria-label="Adet artır">${ik('arti')}</button>
          </div>

          <!-- Listeme Ekle Butonu -->
          ${product.tukendi ? `
          <button class="buton birincil" id="detayEkleBtn" style="flex:1" disabled>
            <span>${t('tukendi')}</span>
          </button>` : `
          <button class="buton birincil" id="detayEkleBtn" style="flex:1">
            ${ik('liste')}
            <span>${t('listeme_ekle')}</span>
            <span class="ayrac"></span>
            <span id="detayToplamFiyat">${formatTL(totalPrice)}</span>
          </button>`}
        </div>
      </footer>
    </div>
  `;

  container.innerHTML = html;

  // Parallax ve Scroll Dinleyicisi
  setupParallaxScroll(container);

  // Yatay Swipe / Sürükleme Dinleyicisi
  setupHorizontalSwipe(container, {
    onPrev: () => {
      const prevIdx = (currentIndex - 1 + categoryProducts.length) % categoryProducts.length;
      if (onSwitchProduct) onSwitchProduct(categoryProducts[prevIdx].id, 'prev');
    },
    onNext: () => {
      const nextIdx = (currentIndex + 1) % categoryProducts.length;
      if (onSwitchProduct) onSwitchProduct(categoryProducts[nextIdx].id, 'next');
    }
  });

  // Etkileşimler
  setupDetailListeners(container, {
    product,
    onNavigateBack: () => {
      transitionDetailToPrevious(() => {
        if (onNavigateBack) onNavigateBack();
      });
    }
  });
}

function setupParallaxScroll(container) {
  const panel = container.querySelector('#detayPanel');
  const tabak = container.querySelector('#detayTabak');
  const gizliBaslik = container.querySelector('#detayGizliBaslik');
  if (!panel || !tabak) return;

  panel.addEventListener('scroll', () => {
    const scrollTop = panel.scrollTop;
    // 0 - 300px aralığında parallax oranı
    const s = Math.min(1, Math.max(0, scrollTop / 260));

    // Üst görsel translateY 0 -> -110px, scale 1 -> 0.68
    const gorselY = -s * 110;
    const gorselOlcek = 1 - s * 0.32;

    tabak.style.transform = `translateY(${gorselY}px) scale(${gorselOlcek})`;

    // Başlıkta ürün adı belirir (60-80px aralığı)
    if (gizliBaslik) {
      if (scrollTop > 60) {
        gizliBaslik.style.opacity = String(Math.min(1, (scrollTop - 60) / 40));
      } else {
        gizliBaslik.style.opacity = '0';
      }
    }
  }, { passive: true });
}

function setupHorizontalSwipe(container, { onPrev, onNext }) {
  const plateArea = container.querySelector('.detay-tabak-alani');
  const tabak = container.querySelector('#detayTabak');
  if (!plateArea || !tabak) return;

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let isSwiping = false;

  const onPointerDown = (e) => {
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    currentX = startX;
    isSwiping = true;
  };

  const onPointerMove = (e) => {
    if (!isSwiping) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = x - startX;
    const dy = y - startY;

    // Dikey kaydırma baskınsa iptal et
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 20) {
      isSwiping = false;
      tabak.style.transform = '';
      return;
    }

    currentX = x;
    // Hafif sürükleme geri bildirimi
    const clampedDx = Math.max(-100, Math.min(100, dx));
    tabak.style.transform = `translateX(${clampedDx}px) scale(${1 - Math.abs(clampedDx) * 0.001})`;
  };

  const onPointerUp = () => {
    if (!isSwiping) return;
    isSwiping = false;
    const dx = currentX - startX;
    const threshold = 55; // Piksel eşiği

    if (dx < -threshold) {
      // Sola swipe -> Sonraki ürün
      sound.play('kategori-gecis');
      tabak.animate([
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(-120px)', opacity: 0 }
      ], { duration: 160, easing: 'ease-in' }).onfinish = onNext;
    } else if (dx > threshold) {
      // Sağa swipe -> Önceki ürün
      sound.play('kategori-gecis');
      tabak.animate([
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(120px)', opacity: 0 }
      ], { duration: 160, easing: 'ease-in' }).onfinish = onPrev;
    } else {
      // Geri yaylanma
      tabak.animate([
        { transform: tabak.style.transform },
        { transform: 'none' }
      ], { duration: 250, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.1)' });
    }
  };

  plateArea.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
}

function setupDetailListeners(container, { product, onNavigateBack }) {
  let quantity = 1;
  let selectedPortionIndex = 0;
  const sizes = getProductSizes(product);
  const extras = getProductExtras(product);

  const fiyatBadge = container.querySelector('#detayFiyatBadge');
  const toplamFiyatEl = container.querySelector('#detayToplamFiyat');
  const adetSayiEl = container.querySelector('#adetSayi');
  const adetEksiBtn = container.querySelector('#adetEksi');
  const adetArtiBtn = container.querySelector('#adetArti');
  const ekleBtn = container.querySelector('#detayEkleBtn');
  const kalpBtn = container.querySelector('#detayKalpBtn');
  const geriBtn = container.querySelector('[data-action="detay-geri"]');
  const sesBtn = container.querySelector('[data-action="ses-toggle"]');
  const portionButtons = container.querySelectorAll('#porsiyonSegment button');

  const selectedExtras = () =>
    [...container.querySelectorAll('#ekstraListe input[data-ekstra]:checked')].map(i => i.value);

  const unit = () => {
    const boyId = (sizes[selectedPortionIndex] || sizes[0] || {}).id;
    return computeItemPrice(product, boyId, selectedExtras());
  };

  const updatePriceDisplay = () => {
    const unitPrice = unit();
    const total = unitPrice * quantity;
    if (fiyatBadge) fiyatBadge.textContent = formatTL(unitPrice);
    if (toplamFiyatEl) toplamFiyatEl.textContent = formatTL(total);
    if (adetSayiEl) adetSayiEl.textContent = String(quantity);
  };

  // Porsiyon seçimi
  portionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.play('dokunma');
      animateButtonPress(btn);
      portionButtons.forEach(b => b.classList.remove('secili'));
      btn.classList.add('secili');
      selectedPortionIndex = parseInt(btn.dataset.idx, 10);
      updatePriceDisplay();
    });
  });

  container.querySelectorAll('#ekstraListe input[data-ekstra]').forEach(inp => {
    inp.addEventListener('change', () => {
      sound.play('dokunma');
      updatePriceDisplay();
    });
  });

  // Adet artırma
  if (adetArtiBtn) {
    adetArtiBtn.addEventListener('click', () => {
      sound.play('dokunma');
      animateButtonPress(adetArtiBtn);
      quantity++;
      updatePriceDisplay();
    });
  }

  // Adet azaltma
  if (adetEksiBtn) {
    adetEksiBtn.addEventListener('click', () => {
      if (quantity > 1) {
        sound.play('dokunma');
        animateButtonPress(adetEksiBtn);
        quantity--;
        updatePriceDisplay();
      }
    });
  }

  // Listeme ekle
  if (ekleBtn && !product.tukendi) {
    ekleBtn.addEventListener('click', () => {
      sound.play('listeye-ekle');
      animateButtonPress(ekleBtn, () => {
        const size = sizes[selectedPortionIndex] || sizes[0];
        const portionName = loc(size.ad);
        const ekstraIds = selectedExtras();
        const extraNames = extras.filter(e => ekstraIds.includes(e.id)).map(e => loc(e.ad));
        const unitPrice = unit();
        const label = [portionName, ...extraNames].filter(Boolean).join(', ');

        cart.addItem({
          productId: product.id,
          ad: loc(product.ad),
          portionIndex: selectedPortionIndex,
          portionName: label,
          boyId: size.id,
          ekstraIds,
          ekstraAd: extraNames.join(', '),
          unitPrice,
          quantity,
          image: getProductImage(product.id)
        });

        showToast(
          t('listene_eklendi'),
          `${quantity} × ${loc(product.ad)} (${label})`,
          getProductImage(product.id)
        );
      });
    });
  }

  // Favori Kalp Butonu
  let isFavorite = false;
  if (kalpBtn) {
    kalpBtn.addEventListener('click', () => {
      sound.play('dokunma');
      isFavorite = !isFavorite;
      animateButtonPress(kalpBtn);
      kalpBtn.style.background = isFavorite ? 'var(--renk-mandalina)' : 'rgba(255,255,255,.92)';
      kalpBtn.style.color = isFavorite ? '#FFFFFF' : 'var(--renk-mandalina)';
    });
  }

  // Geri butonu
  if (geriBtn) {
    geriBtn.addEventListener('click', () => {
      sound.play('geri');
      animateButtonPress(geriBtn, onNavigateBack);
    });
  }

  // Ses butonu
  if (sesBtn) {
    sesBtn.addEventListener('click', () => {
      sound.toggleSound();
      sesBtn.innerHTML = sound.isSoundEnabled()
        ? '<svg class="ikon" viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18.3 6.4a8 8 0 0 1 0 11.2"/></svg>'
        : '<svg class="ikon" viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
    });
  }
}
