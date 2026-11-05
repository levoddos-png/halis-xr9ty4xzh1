/**
 * HALİS QR Web Menü — Ana Sayfa Görünümü
 * Haftanın seçimi hero kartı, snap karuseli + noktalar, çok satanlar ve kategori çipleri.
 */

import { renderHeader, renderAltbar, renderHeroCard, renderCategoryCard, renderBestSellerRow } from '../components.js';
import { getCategories, getFeaturedProduct, getBestSellers, getGreeting } from '../data.js';
import { animateStaggeredEntrance } from '../transitions.js';
import { sound } from '../audio.js';

export function renderHomeView(container, { onNavigateProduct, onNavigateCategory }) {
  const categories = getCategories();
  const featured = getFeaturedProduct();
  const bestSellers = getBestSellers();

  // URL'den masa numarası (?masa=7)
  const urlParams = new URLSearchParams(window.location.search);
  const tableNo = urlParams.get('masa') || '7';
  const greeting = getGreeting();

  const chipsHtml = `
    <div class="cipler">
      <button class="cip secili" data-cip="hepsi">
        Tümü
      </button>
      ${categories.map(k => `
        <button class="cip" data-cip="${k.id}">
          <span class="renk" style="background:${k.renk}"></span>
          ${k.ad}
          <span class="sayi">${k.sayi || 5}</span>
        </button>
      `).join('')}
    </div>
  `;

  const html = `
    <div class="ekran anasayfa-ekran" data-ekran="anasayfa">
      ${renderHeader({
        back: false,
        showSound: true,
        showSearch: true,
        isTransparent: false
      })}

      <main class="kaydir" id="anaKaydir">
        <!-- Masa & Selamlama -->
        <section class="liste-oge" style="padding: 10px 16px 0">
          <div class="etiket vurgu-etiket">Masa ${tableNo} · ${greeting}</div>
          <h1 class="h1" style="margin-top:6px; color:var(--baslik)">
            Bugün canın<br>ne çekiyor? 
            <span class="aksan" style="color:var(--renk-mandalina); font-size:28px">tatlı mı?</span>
          </h1>
        </section>

        <!-- Kategori Çipleri -->
        <section class="liste-oge" style="margin-top:16px">
          ${chipsHtml}
        </section>

        <!-- Haftanın Seçimi Hero Kartı -->
        <section class="liste-oge" style="margin-top:18px">
          ${renderHeroCard(featured)}
        </section>

        <!-- Kategoriler Snap Karuseli -->
        <section class="liste-oge" style="margin-top:24px">
          <div class="bolum-baslik">
            <h2 class="h2">Kategoriler</h2>
            <a href="#/kategori/tatlilar" data-action="tum-kategoriler">Tümünü gör</a>
          </div>

          <div class="karusel" id="kategoriKarusel">
            ${categories.map((c, i) => renderCategoryCard(c, i)).join('')}
          </div>

          <!-- Sayfa Noktaları -->
          <div class="noktalar" id="karuselNoktalar" aria-label="Karusel sayfaları">
            <i class="aktif" data-index="0"></i>
            <i data-index="1"></i>
            <i data-index="2"></i>
          </div>
        </section>

        <!-- Çok Satanlar -->
        <section class="liste-oge" style="margin-top:22px; padding-bottom:30px">
          <div class="bolum-baslik">
            <h2 class="h2">Çok satanlar</h2>
            <a href="#/kategori/tatlilar">Tümü</a>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px; padding:12px 16px 0">
            ${bestSellers.map(u => renderBestSellerRow(u)).join('')}
          </div>
        </section>
      </main>

      ${renderAltbar('menu')}
    </div>
  `;

  container.innerHTML = html;

  // Staggered giriş animasyonu
  animateStaggeredEntrance(container, '.liste-oge');

  // Karusel sayfa noktaları dinleyicisi
  setupCarouselDots(container);

  // Etkileşim dinleyicileri
  setupHomeListeners(container, { onNavigateProduct, onNavigateCategory });
}

function setupCarouselDots(container) {
  const karusel = container.querySelector('#kategoriKarusel');
  const noktalar = container.querySelectorAll('#karuselNoktalar i');
  if (!karusel || !noktalar.length) return;

  let lastIndex = 0;

  karusel.addEventListener('scroll', () => {
    const cardWidth = 180; // 168px card + 12px gap
    const scrollLeft = karusel.scrollLeft;
    const activeIndex = Math.min(noktalar.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));

    if (activeIndex !== lastIndex) {
      sound.play('kategori-gecis');
      noktalar.forEach((n, idx) => {
        n.classList.toggle('aktif', idx === activeIndex);
      });
      lastIndex = activeIndex;
    }
  }, { passive: true });

  noktalar.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      const cardWidth = 180;
      karusel.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
    });
  });
}

function setupHomeListeners(container, { onNavigateProduct, onNavigateCategory }) {
  // Haftanın seçimi tıklama
  const heroCard = container.querySelector('.secim');
  if (heroCard) {
    heroCard.addEventListener('click', (e) => {
      sound.play('kart-acilma');
      const urunId = heroCard.dataset.urun;
      if (onNavigateProduct) onNavigateProduct(urunId, heroCard);
    });
  }

  // Kategori kartları tıklama
  const catCards = container.querySelectorAll('.renk-kart');
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      sound.play('kategori-gecis');
      const katId = card.dataset.kat;
      if (onNavigateCategory) onNavigateCategory(katId);
    });
  });

  // Çok satanlar satır kartları tıklama
  const rowCards = container.querySelectorAll('.satir');
  rowCards.forEach(card => {
    card.addEventListener('click', () => {
      sound.play('kart-acilma');
      const urunId = card.dataset.urun;
      if (onNavigateProduct) onNavigateProduct(urunId, card);
    });
  });

  // Kategori çipleri tıklama
  const chips = container.querySelectorAll('.cip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      sound.play('dokunma');
      const target = chip.dataset.cip;
      chips.forEach(c => c.classList.toggle('secili', c === chip));
      if (target === 'hepsi') {
        const karusel = container.querySelector('#kategoriKarusel');
        if (karusel) karusel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        if (onNavigateCategory) onNavigateCategory(target);
      }
    });
  });

  // Başlık kaydırma efekti
  const scrollContainer = container.querySelector('#anaKaydir');
  const header = container.querySelector('.ust');
  if (scrollContainer && header) {
    scrollContainer.addEventListener('scroll', () => {
      if (scrollContainer.scrollTop > 20) {
        header.classList.add('kaydirilmis');
      } else {
        header.classList.remove('kaydirilmis');
      }
    }, { passive: true });
  }

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
