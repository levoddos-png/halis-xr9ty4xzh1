/**
 * HALİS QR Web Menü — Yeniden Kullanılabilir UI Bileşenleri
 */

import { ik, DEKO, dekoEl } from './icons.js';
import { getProductImage, formatTL, getBadge } from './data.js';
import { sound } from './audio.js';
import { theme } from './theme.js';
import { cart } from './cart.js';

export function renderHeader({
  back = false,
  title = '',
  showSound = true,
  showTheme = true,
  showSearch = false,
  isTransparent = false,
  isCam = false,
  extraClass = ''
} = {}) {
  const soundIcon = sound.isSoundEnabled() ? 'sesAcik' : 'sesKapali';
  const themeIcon = theme.isDark() ? 'gunes' : 'ay';
  const logoSrc = theme.isDark() 
    ? './assets/logo/halis-wordmark-yalin-koyu.svg' 
    : './assets/logo/halis-wordmark-yalin-acik.svg';
  const camClass = isCam ? 'cam' : '';

  return `
    <header class="ust ${isTransparent ? 'seffaf' : 'gecis-arka'} ${extraClass}">
      ${back 
        ? `<button class="ikon-buton ${camClass}" aria-label="Geri" data-action="geri">${ik('geri')}</button>` 
        : `<a href="#/" class="logo-baglanti" aria-label="HALİS Ana Sayfa"><img class="logo" src="${logoSrc}" alt="HALİS"></a>`
      }
      ${title ? `<div class="h3" style="margin-left:6px; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${title}</div>` : ''}
      <div class="bosluk"></div>
      ${showTheme ? `<button class="ikon-buton ${camClass}" aria-label="Temayı Değiştir" data-action="tema-toggle" title="Temayı değiştir">${ik(themeIcon)}</button>` : ''}
      ${showSound ? `<button class="ikon-buton ${camClass}" aria-label="Sesi Aç/Kapat" data-action="ses-toggle" title="Ses">${ik(soundIcon)}</button>` : ''}
      ${showSearch ? `<button class="ikon-buton koyu" aria-label="Ara" data-action="ara" title="Menüde ara">${ik('ara')}</button>` : ''}
    </header>
  `;
}

export function renderAltbar(active = 'menu', count = null) {
  const badgeCount = count !== null ? count : cart.getTotalCount();
  const item = (id, ad, ikon, hash = '#/') => `
    <button class="${active === id ? 'aktif' : ''}" data-nav="${id}" data-hash="${hash}" aria-label="${ad}">
      ${ik(ikon)}
      <span>${ad}</span>
      ${id === 'liste' && badgeCount > 0 ? `<span class="sepet-sayi">${badgeCount}</span>` : ''}
    </button>
  `;

  return `
    <nav class="altbar" aria-label="Alt gezinme çubuğu">
      ${item('menu', 'Menü', 'menu', '#/')}
      ${item('ara', 'Ara', 'ara', '#/arama')}
      ${item('liste', 'Listem', 'liste', '#/listem')}
      ${item('bilgi', 'Bilgi', 'bilgi', '#/bilgi')}
    </nav>
  `;
}

export function renderBadge(badgeKey) {
  const b = getBadge(badgeKey);
  return `<span class="rozet" style="background:${b.zemin}; color:${b.metin}">${b.ad}</span>`;
}

export function renderProductCard(u, i = 0) {
  return `
    <article class="kart" data-urun="${u.id}" data-sira="${i}" role="button" tabindex="0" aria-label="${u.ad}, ${u.fiyat} lira">
      <div class="kare-gorsel">
        <img src="${getProductImage(u.id, '@600.webp')}" alt="${u.ad}" loading="lazy" width="200" height="200">
      </div>
      ${u.rozet && u.rozet.length ? `<div class="rozetler">${u.rozet.slice(0, 1).map(renderBadge).join('')}</div>` : ''}
      <div class="govde">
        <div class="ad">${u.ad}</div>
        <div class="alt">
          <span class="fiyat kucuk-f">${formatTL(u.fiyat)}</span>
          <button class="arti" aria-label="${u.ad} listeme ekle" data-action="hizli-ekle" data-id="${u.id}">
            ${ik('arti')}
          </button>
        </div>
      </div>
    </article>
  `;
}

export function renderCategoryCard(k, i = 0) {
  const temsilUrun = k.temsili_urun || { tatlilar: 'trilece', dondurmalar: 'kulah-dondurma', unlu: 'simit' }[k.id];
  
  // Retro dekorasyonlar
  const dekoHtml = {
    tatlilar: dekoEl(120, -20, DEKO.halka(34, 'rgba(255,255,255,.35)', 8)) + dekoEl(14, 130, DEKO.serpinti('#FFD850', 30)),
    dondurmalar: dekoEl(-24, -24, DEKO.daire(40, 'rgba(255,255,255,.28)')) + dekoEl(136, 120, DEKO.yildiz(18, '#FFF500')),
    unlu: dekoEl(110, 150, DEKO.yarim(40, 'rgba(48,103,58,.18)')) + dekoEl(16, 20, DEKO.serpinti('#E3792F', -30))
  }[k.id] || '';

  return `
    <article class="renk-kart" data-kat="${k.id}" style="background:${k.renk}; color:${k.metin}" role="button" tabindex="0" aria-label="${k.ad} kategorisi">
      ${dekoHtml}
      <div class="tabak">
        <img src="${getProductImage(temsilUrun, '@600.webp')}" alt="${k.ad}" width="112" height="112" loading="lazy">
      </div>
      <div class="ad">${k.ad}</div>
      <div class="sayi">${k.sayi || 5} lezzet</div>
      <div class="ok">${ik('ileri')}</div>
    </article>
  `;
}

export function renderHeroCard(u) {
  return `
    <article class="secim" data-urun="${u.id}" role="button" tabindex="0" aria-label="Haftanın seçimi: ${u.ad}">
      ${dekoEl(150, -40, DEKO.daire(70, 'var(--renk-sari)'))}
      ${dekoEl(140, 150, DEKO.serpinti('#00A3FF', 40))}
      <div class="sol">
        <div class="etiket" style="color:var(--baslik)">★ Haftanın seçimi</div>
        <div class="h2" style="margin-top:8px; font-weight:800; font-size:24px; line-height:1.05">
          ${u.ad.replace(' ', '<br>')}
        </div>
        <div class="kucuk" style="margin-top:6px; max-width:145px; line-height:1.35">
          ${u.kisa}
        </div>
        <div style="margin-top:auto; display:flex; gap:8px; align-items:center; padding-top:10px">
          <span class="fiyat">${formatTL(u.fiyat)}</span>
          ${u.rozet.length ? renderBadge(u.rozet[0]) : ''}
        </div>
      </div>
      <div class="tabak">
        <img src="${getProductImage(u.id, '@600.webp')}" alt="${u.ad}" width="196" height="196">
      </div>
    </article>
  `;
}

export function renderBestSellerRow(u) {
  return `
    <div class="satir" data-urun="${u.id}" role="button" tabindex="0" aria-label="${u.ad}, ${u.fiyat} lira">
      <div class="kare-gorsel">
        <img src="${getProductImage(u.id, '@600.webp')}" alt="${u.ad}" width="76" height="76" loading="lazy">
      </div>
      <div class="ic">
        <div class="ad">${u.ad}</div>
        <div class="kucuk" style="margin-top:3px">${u.kisa}</div>
      </div>
      <span class="fiyat kucuk-f" style="margin-right:6px">${formatTL(u.fiyat)}</span>
    </div>
  `;
}

export function showToast(title = 'Listene eklendi', subtitle = '', imageSrc = '') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    ${imageSrc ? `<span class="tabak"><img src="${imageSrc}" alt=""></span>` : ''}
    <div style="flex:1; min-width:0">
      <div>${title}</div>
      ${subtitle ? `<div style="color:var(--renk-limon); font-size:12px; font-weight:800; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${subtitle}</div>` : ''}
    </div>
  `;

  document.getElementById('app-root').appendChild(toast);

  // Zıpla yayı ile giriş
  toast.animate([
    { opacity: 0, transform: 'translate(-50%, 40px) scale(0.9)' },
    { opacity: 1, transform: 'translate(-50%, 0) scale(1)' }
  ], {
    duration: 492,
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
    fill: 'both'
  });

  setTimeout(() => {
    const fadeOut = toast.animate([
      { opacity: 1, transform: 'translate(-50%, 0)' },
      { opacity: 0, transform: 'translate(-50%, 20px)' }
    ], {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 1, 1)',
      fill: 'both'
    });
    fadeOut.onfinish = () => toast.remove();
  }, 2000);
}

export const BOS_ILLUSTRASYON = `
<svg viewBox="0 0 220 210" width="220" height="210" aria-hidden="true">
  <circle cx="110" cy="105" r="96" fill="var(--renk-fistik)"/>
  <circle cx="40" cy="40" r="10" fill="var(--renk-sari)"/>
  <rect x="176" y="40" width="7" height="22" rx="3.5" fill="var(--renk-mandalina)" transform="rotate(30 180 50)"/>
  <path d="M84 112 L110 196 L136 112 Z" fill="var(--renk-sari)" stroke="var(--renk-gece)" stroke-width="5" stroke-linejoin="round"/>
  <path d="M92 132l34 0M97 150l24 0M102 168l14 0" stroke="var(--renk-mandalina)" stroke-width="5" stroke-linecap="round"/>
  <path d="M70 112c0-30 18-48 40-48s40 18 40 48c-6 0-8 10-14 10s-7-8-13-8-7 14-13 14-7-14-13-14-8 8-14 8-7-10-13-10z" fill="var(--renk-plazma)" stroke="var(--renk-gece)" stroke-width="5" stroke-linejoin="round"/>
  <path d="M120 122c0 10 2 18 6 18s5-8 4-16" fill="var(--renk-plazma)" stroke="var(--renk-gece)" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="98" cy="94" r="5" fill="var(--renk-gece)"/><circle cx="124" cy="94" r="5" fill="var(--renk-gece)"/>
  <path d="M102 110q9-7 18 0" fill="none" stroke="var(--renk-gece)" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="90" cy="104" r="5" fill="var(--renk-mandalina)" opacity=".5"/><circle cx="132" cy="104" r="5" fill="var(--renk-mandalina)" opacity=".5"/>
  <path d="M110 64c-2-10 4-16 12-16" fill="none" stroke="var(--renk-retro-yesil)" stroke-width="5" stroke-linecap="round"/><circle cx="124" cy="46" r="8" fill="var(--renk-mandalina)" stroke="var(--renk-gece)" stroke-width="4"/>
  <circle cx="146" cy="190" r="10" fill="var(--renk-plazma)" opacity=".5"/><circle cx="164" cy="196" r="5" fill="var(--renk-plazma)" opacity=".5"/>
</svg>`;
