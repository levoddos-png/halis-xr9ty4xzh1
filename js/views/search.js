/**
 * HALİS QR Web Menü — Canlı Arama Görünümü
 * Türkçe karakter duyarsız (ı/i, ş/s, vb. normalize), canlı filtreleme,
 * sonuç ekranı, popüler aramalar ve boş sonuç durumu.
 */

import { renderAltbar, BOS_ILLUSTRASYON } from '../components.js';
import { getProducts, getCategories, formatTL, getProductImage } from '../data.js';
import { ik } from '../icons.js';
import { sound } from '../audio.js';
import { animateStaggeredEntrance } from '../transitions.js';

/**
 * Türkçe karakterleri normalize eden arama yardımcısı
 */
export function normalizeTr(text) {
  if (!text) return '';
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Metin içindeki arama terimlerini <mark> ile vurgular
 */
function highlightText(text, query) {
  if (!query || !text) return escapeHtml(text || '');
  const cleanQ = query.trim();
  if (!cleanQ) return escapeHtml(text);

  try {
    // Normalizasyon haritasına göre regex deseni
    const pattern = cleanQ.split('').map(char => {
      const lower = char.toLocaleLowerCase('tr-TR');
      if (lower === 'i' || lower === 'ı') return '[iıİI]';
      if (lower === 's' || lower === 'ş') return '[sşSŞ]';
      if (lower === 'c' || lower === 'ç') return '[cçCÇ]';
      if (lower === 'g' || lower === 'ğ') return '[gğGĞ]';
      if (lower === 'u' || lower === 'ü') return '[uüUÜ]';
      if (lower === 'o' || lower === 'ö') return '[oöOÖ]';
      return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('');

    const regex = new RegExp(`(${pattern})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
  } catch (e) {
    return escapeHtml(text);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderSearchView(container, { onNavigateProduct, onNavigateHome } = {}) {
  const allProducts = getProducts();
  const allCategories = getCategories();
  
  let currentQuery = '';
  let selectedCategoryFilter = 'hepsi';

  const html = `
    <div class="ekran arama-ekran" data-ekran="arama">
      <!-- Üst Arama Çubuğu -->
      <header class="ust arama-ust" style="gap:10px; background:var(--zemin)">
        <button class="ikon-buton" aria-label="Geri" data-action="arama-geri">
          ${ik('geri')}
        </button>
        <div class="arama-kutu" style="flex:1">
          ${ik('ara')}
          <input 
            type="search" 
            id="aramaGirdi" 
            placeholder="Menüde ara (baklava, simit, sorbe...)" 
            autocomplete="off" 
            autocorrect="off" 
            autocapitalize="off" 
            spellcheck="false"
            aria-label="Menüde ara"
          >
          <button class="ikon-buton" id="aramaTemizle" style="width:36px; height:36px; box-shadow:none; background:var(--yuzey-2); display:none" aria-label="Aramayı temizle">
            ${ik('kapat')}
          </button>
        </div>
      </header>

      <!-- Arama İçerik Alanı -->
      <main class="kaydir" id="aramaKaydir" style="padding-top:74px; padding-bottom:96px">
        <div id="aramaIcerik">
          <!-- Dinamik Sonuçlar Buraya Gelecek -->
        </div>
      </main>

      ${renderAltbar('ara')}
    </div>
  `;

  container.innerHTML = html;

  const inputEl = container.querySelector('#aramaGirdi');
  const clearBtn = container.querySelector('#aramaTemizle');
  const contentEl = container.querySelector('#aramaIcerik');
  const geriBtn = container.querySelector('[data-action="arama-geri"]');

  if (geriBtn) {
    geriBtn.addEventListener('click', () => {
      sound.play('geri');
      if (onNavigateHome) onNavigateHome();
    });
  }

  function filterProducts(query) {
    const qNorm = normalizeTr(query);
    if (!qNorm) return [];

    return allProducts.filter(u => {
      const adNorm = normalizeTr(u.ad);
      const kisaNorm = normalizeTr(u.kisa);
      const icindekilerNorm = normalizeTr(u.icindekiler || '');
      const kat = allCategories.find(c => c.id === u.kat);
      const katAdNorm = normalizeTr(kat ? kat.ad : '');
      const rozetlerNorm = (u.rozet || []).map(r => normalizeTr(r)).join(' ');

      return adNorm.includes(qNorm) || 
             kisaNorm.includes(qNorm) || 
             icindekilerNorm.includes(qNorm) || 
             katAdNorm.includes(qNorm) ||
             rozetlerNorm.includes(qNorm);
    });
  }

  function updateView() {
    const query = inputEl.value.trim();
    currentQuery = query;

    if (query.length > 0) {
      clearBtn.style.display = 'grid';
    } else {
      clearBtn.style.display = 'none';
      renderInitialSuggestions();
      return;
    }

    const filtered = filterProducts(query);
    
    if (filtered.length === 0) {
      renderEmptyState(query);
    } else {
      renderResults(filtered, query);
    }
  }

  function renderInitialSuggestions() {
    const popülerler = [
      'Baklava', 
      'Maraş Dondurması', 
      'Susamlı Simit', 
      'Fırın Sütlaç', 
      'Profiterol',
      'Vegan', 
      'Glutensiz', 
      'Trileçe',
      'Poğaça'
    ];

    contentEl.innerHTML = `
      <div style="padding:16px 16px 0">
        <div class="etiket" style="color:var(--metin-2)">Popüler aramalar</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:12px">
          ${popülerler.map(t => `
            <button class="cip pop-cip" data-terim="${t}">
              ${ik('ara')}
              <span>${t}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div style="padding:28px 16px 0">
        <div class="etiket" style="color:var(--metin-2)">Kategorilere göre keşfet</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:12px">
          ${allCategories.map(k => `
            <a href="#/kategori/${k.id}" class="cip" style="justify-content:flex-start; padding:0 14px; height:46px; border-radius:20px">
              <span class="renk" style="background:${k.renk}"></span>
              <span style="font-weight:700">${k.ad}</span>
              <span class="sayi" style="margin-left:auto">${k.sayi || 5}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;

    // Popüler arama tıklamaları
    contentEl.querySelectorAll('.pop-cip').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.play('dokunma');
        inputEl.value = btn.dataset.terim;
        updateView();
      });
    });
  }

  function renderEmptyState(query) {
    contentEl.innerHTML = `
      <div style="text-align:center; padding:24px 24px 0" class="liste-oge">
        <div style="position:relative; width:220px; height:210px; margin:0 auto">
          ${BOS_ILLUSTRASYON}
        </div>
        <h2 class="h2" style="margin-top:16px; font-weight:800; font-size:24px; color:var(--baslik)">
          Bu lezzeti bulamadık
        </h2>
        <div style="margin-top:8px; font-size:15px; line-height:1.5; color:var(--metin-2); max-width:320px; margin-left:auto; margin-right:auto">
          “<b>${escapeHtml(query)}</b>” için sonuç yok. Yazımı kontrol et ya da şunlara bir göz at:
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:18px">
          ${['Baklava', 'Maraş Dondurması', 'Simit', 'Vegan', 'Sütlaç'].map(t => `
            <button class="cip bos-oneri" data-terim="${t}">${t}</button>
          `).join('')}
        </div>
        <button class="buton ikincil" style="margin-top:24px" id="aramaMenuDonBtn">
          Tüm menüye dön
        </button>
      </div>
    `;

    const donBtn = contentEl.querySelector('#aramaMenuDonBtn');
    if (donBtn) {
      donBtn.addEventListener('click', () => {
        sound.play('geri');
        if (onNavigateHome) onNavigateHome();
      });
    }

    contentEl.querySelectorAll('.bos-oneri').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.play('dokunma');
        inputEl.value = btn.dataset.terim;
        updateView();
      });
    });
  }

  function renderResults(results, query) {
    // Kategori filtrelerini hesapla
    const counts = { hepsi: results.length };
    allCategories.forEach(k => {
      counts[k.id] = results.filter(u => u.kat === k.id).length;
    });

    const currentResults = selectedCategoryFilter === 'hepsi'
      ? results
      : results.filter(u => u.kat === selectedCategoryFilter);

    const filterChipsHtml = `
      <div style="padding:0 16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center">
        <div class="etiket" style="color:var(--metin-2)">${results.length} sonuç</div>
      </div>
      <div class="cipler" style="margin-bottom:14px">
        <button class="cip ${selectedCategoryFilter === 'hepsi' ? 'secili' : ''}" data-kat-filtre="hepsi">
          Tümü <span class="sayi">${counts.hepsi}</span>
        </button>
        ${allCategories.map(k => `
          <button class="cip ${selectedCategoryFilter === k.id ? 'secili' : ''}" data-kat-filtre="${k.id}">
            <span class="renk" style="background:${k.renk}"></span>
            ${k.ad}
            <span class="sayi">${counts[k.id] || 0}</span>
          </button>
        `).join('')}
      </div>
    `;

    const resultsListHtml = `
      <div style="display:flex; flex-direction:column; gap:10px; padding:0 16px" id="sonucListesi">
        ${currentResults.map(u => `
          <div class="satir" data-urun="${u.id}" role="button" tabindex="0" aria-label="${u.ad}, ${u.fiyat} lira">
            <div class="kare-gorsel">
              <img src="${getProductImage(u.id, '@600.webp')}" alt="${u.ad}" width="76" height="76" loading="lazy">
            </div>
            <div class="ic">
              <div class="ad">${highlightText(u.ad, query)}</div>
              <div class="kucuk" style="margin-top:3px">${highlightText(u.kisa, query)}</div>
            </div>
            <span class="fiyat kucuk-f duz" style="margin-right:4px">${formatTL(u.fiyat)}</span>
            <button class="arti" data-action="hizli-ekle" data-id="${u.id}" aria-label="${u.ad} listeme ekle" style="margin-left:4px">
              ${ik('arti')}
            </button>
          </div>
        `).join('')}
      </div>
    `;

    contentEl.innerHTML = filterChipsHtml + resultsListHtml;

    // Kategori filtre çipleri
    contentEl.querySelectorAll('[data-kat-filtre]').forEach(chip => {
      chip.addEventListener('click', () => {
        sound.play('dokunma');
        selectedCategoryFilter = chip.dataset.katFiltre;
        renderResults(results, query);
      });
    });

    // Satır tıklama (Detay ekranına yönlendirme)
    contentEl.querySelectorAll('.satir').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="hizli-ekle"]')) return;
        sound.play('kart-acilma');
        const urunId = card.dataset.urun;
        if (onNavigateProduct) onNavigateProduct(urunId, card);
      });
    });

    // Sonuçlar için yumuşak giriş animasyonu
    const listEl = contentEl.querySelector('#sonucListesi');
    if (listEl) {
      animateStaggeredEntrance(listEl, '.satir');
    }
  }

  // Arama girdisi olayları
  inputEl.addEventListener('input', () => {
    selectedCategoryFilter = 'hepsi';
    updateView();
  });

  clearBtn.addEventListener('click', () => {
    sound.play('dokunma');
    inputEl.value = '';
    inputEl.focus();
    updateView();
  });

  // URL'den başlangıç sorgusu (?q=fıstık)
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q');
  if (initialQuery) {
    inputEl.value = initialQuery;
    updateView();
  } else {
    // İlk yüklemede popüler aramalar gösterilir ve input odaklanır
    renderInitialSuggestions();
  }
  setTimeout(() => inputEl.focus(), 150);
}
