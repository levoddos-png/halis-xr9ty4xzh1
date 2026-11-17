/**
 * HALİS QR Web Menü — Ana Sayfa Görünümü
 */

import { renderHeader, renderAltbar, renderHeroCard, renderCategoryCard, renderBestSellerRow } from '../components.js';
import { getCategories, getFeaturedProduct, getBestSellers, getGreeting, getTableNumber, getShopStatus, t, loc } from '../data.js';
import { animateStaggeredEntrance } from '../transitions.js';
import { sound } from '../audio.js';
import { ik } from '../icons.js';

export function renderHomeView(container, { onNavigateProduct, onNavigateCategory }) {
  const categories = getCategories();
  const featured = getFeaturedProduct();
  const bestSellers = getBestSellers();
  const tableNo = getTableNumber();
  const greeting = getGreeting();
  const status = getShopStatus();
  const firstKat = categories[0] ? categories[0].id : '';

  const statusClass = status.code === 'acik' ? 'durum-acik' : status.code === 'yakinda_kapaniyor' ? 'durum-yakinda' : 'durum-kapali';
  const etiket = [
    tableNo ? `${t('masa')} ${tableNo}` : '',
    greeting,
    status.label
  ].filter(Boolean).join(' · ');

  const chipsHtml = `
    <div class="cipler">
      <button class="cip secili" data-cip="hepsi">${t('tumu')}</button>
      ${categories.map(k => `
        <button class="cip" data-cip="${k.id}">
          <span class="renk" style="background:${k.renk}"></span>
          ${loc(k.ad)}
          <span class="sayi">${k.sayi || 0}</span>
        </button>
      `).join('')}
    </div>
  `;

  const html = `
    <div class="ekran anasayfa-ekran" data-ekran="anasayfa">
      ${renderHeader({ back: false, showSound: true, showSearch: true, isTransparent: false })}

      <main class="kaydir" id="anaKaydir">
        <section class="liste-oge" style="padding: 10px 16px 0">
          <div class="etiket vurgu-etiket ${statusClass}">${etiket}</div>
          <h1 class="h1" style="margin-top:6px; color:var(--baslik)">
            ${t('bugun_canin')}<br>${t('ne_cekiyor')}
            <span class="aksan" style="color:var(--renk-mandalina); font-size:28px"> ${t('tatli_mi')}</span>
          </h1>
        </section>

        <section class="liste-oge" style="margin-top:16px">
          ${chipsHtml}
        </section>

        ${featured ? `<section class="liste-oge" style="margin-top:18px">
          ${renderHeroCard(featured)}
        </section>` : ''}

        <section class="liste-oge" style="margin-top:24px">
          <div class="bolum-baslik">
            <h2 class="h2">${t('kategoriler')}</h2>
            <a href="#/kategori/${firstKat}" data-action="tum-kategoriler">${t('tumunu_gor')}</a>
          </div>

          <div class="karusel" id="kategoriKarusel">
            ${categories.map((c, i) => renderCategoryCard(c, i)).join('')}
          </div>

          <div class="noktalar" id="karuselNoktalar" aria-label="${t('kategoriler')}">
            ${categories.map((_, i) => `<i class="${i === 0 ? 'aktif' : ''}" data-index="${i}"></i>`).join('')}
          </div>
        </section>

        ${bestSellers.length ? `<section class="liste-oge" style="margin-top:22px">
          <div class="bolum-baslik">
            <h2 class="h2">${t('cok_satanlar')}</h2>
            <a href="#/kategori/${firstKat}">${t('tumu')}</a>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px; padding:12px 16px 0">
            ${bestSellers.map(u => renderBestSellerRow(u)).join('')}
          </div>
        </section>` : ''}

        <section class="liste-oge" style="margin: 18px 16px 30px">
          <a href="#/ozel-siparis" class="ozel-pasta-cta" data-action="ozel-siparis">
            ${ik('liste')}
            <span>
              <strong>${t('ozel_pasta')}</strong>
              <small>${t('ozel_pasta_aciklama')}</small>
            </span>
          </a>
        </section>
      </main>

      ${renderAltbar('menu')}
    </div>
  `;

  container.innerHTML = html;
  animateStaggeredEntrance(container, '.liste-oge');
  setupCarouselDots(container);
  setupHomeListeners(container, { onNavigateProduct, onNavigateCategory });
}

function setupCarouselDots(container) {
  const karusel = container.querySelector('#kategoriKarusel');
  const noktalar = container.querySelectorAll('#karuselNoktalar i');
  if (!karusel || !noktalar.length) return;

  let lastIndex = 0;

  karusel.addEventListener('scroll', () => {
    const cardWidth = 180;
    const scrollLeft = karusel.scrollLeft;
    const activeIndex = Math.min(noktalar.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
    if (activeIndex !== lastIndex) {
      sound.play('kategori-gecis');
      noktalar.forEach((n, idx) => n.classList.toggle('aktif', idx === activeIndex));
      lastIndex = activeIndex;
    }
  }, { passive: true });

  noktalar.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      karusel.scrollTo({ left: idx * 180, behavior: 'smooth' });
    });
  });
}

function setupHomeListeners(container, { onNavigateProduct, onNavigateCategory }) {
  const heroCard = container.querySelector('.secim');
  if (heroCard) {
    heroCard.addEventListener('click', () => {
      sound.play('kart-acilma');
      if (onNavigateProduct) onNavigateProduct(heroCard.dataset.urun, heroCard);
    });
  }

  container.querySelectorAll('.renk-kart').forEach(card => {
    card.addEventListener('click', () => {
      sound.play('kategori-gecis');
      if (onNavigateCategory) onNavigateCategory(card.dataset.kat);
    });
  });

  container.querySelectorAll('.satir').forEach(card => {
    card.addEventListener('click', () => {
      sound.play('kart-acilma');
      if (onNavigateProduct) onNavigateProduct(card.dataset.urun, card);
    });
  });

  const chips = container.querySelectorAll('.cip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      sound.play('dokunma');
      const target = chip.dataset.cip;
      chips.forEach(c => c.classList.toggle('secili', c === chip));
      if (target === 'hepsi') {
        const karusel = container.querySelector('#kategoriKarusel');
        if (karusel) karusel.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (onNavigateCategory) {
        onNavigateCategory(target);
      }
    });
  });

  const scrollContainer = container.querySelector('#anaKaydir');
  const header = container.querySelector('.ust');
  if (scrollContainer && header) {
    scrollContainer.addEventListener('scroll', () => {
      header.classList.toggle('kaydirilmis', scrollContainer.scrollTop > 20);
    }, { passive: true });
  }
}
