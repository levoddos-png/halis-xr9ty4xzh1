/**
 * HALİS QR Web Menü — Listem (Garsona Gösterme) Görünümü
 * localStorage kalıcı liste, adet artırma/azaltma, silme, listeyi temizleme,
 * toplam hesaplama ve "Garsona Göster" tam ekran okuma modu.
 * SİPARİŞ VERME VEYA ÖDEME YOKTUR.
 */

import { renderHeader, renderAltbar, showToast } from '../components.js';
import { cart } from '../cart.js';
import { formatTL } from '../data.js';
import { ik } from '../icons.js';
import { sound } from '../audio.js';
import { animateStaggeredEntrance } from '../transitions.js';

export function renderListemView(container, { onNavigateHome, onNavigateProduct } = {}) {
  const urlParams = new URLSearchParams(window.location.search);
  const tableNo = urlParams.get('masa') || '7';

  // Demo / Test parametresi ile örnek liste doldurma
  if ((urlParams.get('demo') === '1' || urlParams.get('ornek') === '1') && cart.getItems().length === 0) {
    cart.addItem({ productId: 'baklava', ad: 'Fıstıklı Baklava', portionIndex: 0, portionName: '4 dilim', unitPrice: 320, quantity: 1, image: './assets/urunler/1x1/baklava@600.webp' });
    cart.addItem({ productId: 'maras-dondurmasi', ad: 'Maraş Dondurması', portionIndex: 0, portionName: '150 g', unitPrice: 120, quantity: 2, image: './assets/urunler/1x1/maras-dondurmasi@600.webp' });
    cart.addItem({ productId: 'simit', ad: 'Susamlı Simit', portionIndex: 0, portionName: 'Adet', unitPrice: 25, quantity: 1, image: './assets/urunler/1x1/simit@600.webp' });
  }

  function render() {
    const items = cart.getItems();
    const totalCount = cart.getTotalCount();
    const totalPrice = cart.getTotalPrice();

    const isBos = items.length === 0;

    const html = `
      <div class="ekran listem-ekran" data-ekran="listem">
        ${renderHeader({
          back: false,
          title: 'Listem',
          showSound: true,
          showTheme: true,
          showSearch: true,
          isTransparent: false
        })}

        <main class="kaydir" id="listemKaydir" style="padding-top:10px; padding-bottom:120px">
          <div style="padding:4px 16px 0">
            <h1 class="h1">Listem</h1>
            <div class="kucuk" style="margin-top:4px">
              Sipariş vermek için listeni garsona göster.
            </div>
          </div>

          ${isBos ? `
            <!-- Boş Liste Durumu -->
            <div style="text-align:center; padding:48px 24px 0" class="liste-oge">
              <div style="width:100px; height:100px; border-radius:50%; background:var(--yuzey-2); display:grid; place-items:center; margin:0 auto; color:var(--metin-2); box-shadow:var(--golge-1)">
                <svg class="ikon" style="width:48px; height:48px" viewBox="0 0 24 24">
                  <rect x="5" y="4" width="14" height="17" rx="3"></rect>
                  <path d="M9 9h6M9 13h6M9 17h3"></path>
                </svg>
              </div>
              <h2 class="h2" style="margin-top:20px; font-weight:800; color:var(--baslik)">Listen henüz boş</h2>
              <div style="margin-top:8px; font-size:15px; line-height:1.5; color:var(--metin-2); max-width:300px; margin-left:auto; margin-right:auto">
                Beğendiğin tatlı, dondurma ve hamur işlerini ekle; garsonuna tek dokunuşla göster.
              </div>
              <button class="buton ikincil" style="margin-top:26px" id="listemMenuDonBtn">
                Menüye Göz At
              </button>
            </div>
          ` : `
            <!-- Dolu Liste Elemanları -->
            <div style="display:flex; flex-direction:column; gap:10px; padding:16px 16px 0" id="listeOgeleri">
              ${items.map(item => `
                <div class="satir" data-key="${item.key}" style="position:relative">
                  <div class="kare-gorsel" style="cursor:pointer" data-action="urun-git" data-id="${item.productId}">
                    <img src="${item.image}" alt="${item.ad}" width="76" height="76" loading="lazy">
                  </div>
                  <div class="ic">
                    <div class="ad" style="cursor:pointer" data-action="urun-git" data-id="${item.productId}">${item.ad}</div>
                    <div class="kucuk" style="margin-top:2px">${item.portionName} · ${formatTL(item.unitPrice)}</div>
                    
                    <!-- Segment Adet Seçici -->
                    <div class="segment" style="width:116px; margin-top:8px; padding:2px">
                      <button data-action="adet-azalt" data-key="${item.key}" aria-label="Adet azalt" style="height:28px">
                        ${ik('eksi')}
                      </button>
                      <button class="secili" style="height:28px; font-size:14px; cursor:default">
                        ${item.quantity}
                      </button>
                      <button data-action="adet-artir" data-key="${item.key}" aria-label="Adet artır" style="height:28px">
                        ${ik('arti')}
                      </button>
                    </div>
                  </div>

                  <!-- Fiyat ve Silme -->
                  <div style="display:flex; flex-direction:column; align-items:flex-end; justify-content:space-between; align-self:stretch; padding:4px 0">
                    <button data-action="oge-sil" data-key="${item.key}" aria-label="${item.ad} sil" style="color:var(--metin-2); padding:4px; border-radius:50%">
                      ${ik('cop')}
                    </button>
                    <span class="fiyat kucuk-f duz" style="margin-right:2px">
                      ${formatTL(item.quantity * item.unitPrice)}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Toplam Alanı -->
            <div class="liste-oge" style="margin:16px 16px 0; border-top:2px dashed var(--kenar); padding-top:14px; display:flex; justify-content:space-between; align-items:center">
              <div>
                <span class="h3">Toplam</span>
                <div class="kucuk" style="margin-top:2px">${totalCount} ürün</div>
              </div>
              <span class="fiyat buyuk">${formatTL(totalPrice)}</span>
            </div>

            <!-- Butonlar -->
            <div class="liste-oge" style="padding:20px 16px 0; display:flex; flex-direction:column; gap:10px">
              <button class="buton ikincil genis" id="garsonaGosterBtn" style="font-size:16px">
                ${ik('garson')} Garsona göster
              </button>
              <button class="buton hayalet genis" id="listeyiTemizleBtn" style="font-size:15px">
                ${ik('temizle')} Listeyi temizle
              </button>
            </div>

            <!-- Bilgilendirme Notu -->
            <div class="kucuk liste-oge" style="text-align:center; margin-top:14px; font-size:12px; padding:0 20px">
              Bu liste yalnızca bu cihazda tutulur; sipariş verilmez veya ödeme alınmaz.
            </div>
          `}
        </main>

        ${renderAltbar('liste', totalCount)}

        <!-- Garsona Göster Tam Ekran Modalı (Başlangıçta gizli) -->
        <div id="garsonModal" style="display:none; position:fixed; inset:0; z-index:100; background:rgba(15,27,61,0.75); backdrop-filter:blur(8px); padding:20px; align-items:center; justify-content:center">
          <div style="background:var(--yuzey); color:var(--metin); border-radius:32px; padding:26px 22px; width:100%; max-width:380px; box-shadow:var(--golge-3); position:relative; max-height:85vh; display:flex; flex-direction:column">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--kenar); padding-bottom:12px">
              <div>
                <span class="etiket" style="color:var(--renk-mandalina-700)">Garson Sipariş Özeti</span>
                <h2 class="h1" style="font-size:24px; margin-top:2px; color:var(--baslik)">Masa ${tableNo}</h2>
              </div>
              <button id="modalKapatBtn" class="ikon-buton" style="box-shadow:none; background:var(--yuzey-2)" aria-label="Kapat">
                ${ik('kapat')}
              </button>
            </div>

            <div style="overflow-y:auto; flex:1; margin:16px 0; display:flex; flex-direction:column; gap:12px; padding-right:4px">
              ${items.map(it => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dashed var(--kenar)">
                  <div>
                    <div style="font-size:17px; font-weight:800; color:var(--metin)">
                      <span style="color:var(--renk-lacivert); font-size:19px; margin-right:4px">${it.quantity} ×</span> ${it.ad}
                    </div>
                    <div style="font-size:13px; color:var(--metin-2); margin-top:2px">
                      ${it.portionName}
                    </div>
                  </div>
                  <div style="font-size:16px; font-weight:800; font-variant-numeric:tabular-nums">
                    ${formatTL(it.quantity * it.unitPrice)}
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="border-top:2px solid var(--kenar); padding-top:14px; display:flex; justify-content:space-between; align-items:baseline">
              <div>
                <div class="etiket" style="color:var(--metin-2)">Genel Toplam</div>
                <div class="h3" style="margin-top:2px">${totalCount} çeşit ürün</div>
              </div>
              <span class="fiyat buyuk">${formatTL(totalPrice)}</span>
            </div>

            <button class="buton birincil genis" id="modalTamamBtn" style="margin-top:16px">
              ${ik('onay')} Ekranı Kapat
            </button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Animasyon
    animateStaggeredEntrance(container, '.liste-oge, .satir');

    // Boş durum buton
    const donBtn = container.querySelector('#listemMenuDonBtn');
    if (donBtn) {
      donBtn.addEventListener('click', () => {
        sound.play('geri');
        if (onNavigateHome) onNavigateHome();
      });
    }

    // Ürün satır tıklama (Detaya git)
    container.querySelectorAll('[data-action="urun-git"]').forEach(el => {
      el.addEventListener('click', () => {
        sound.play('kart-acilma');
        const urunId = el.dataset.id;
        if (onNavigateProduct) onNavigateProduct(urunId);
      });
    });

    // Adet artırma
    container.querySelectorAll('[data-action="adet-artir"]').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.play('dokunma');
        cart.changeQuantity(btn.dataset.key, 1);
        render();
      });
    });

    // Adet azaltma
    container.querySelectorAll('[data-action="adet-azalt"]').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.play('dokunma');
        cart.changeQuantity(btn.dataset.key, -1);
        render();
      });
    });

    // Öğe silme
    container.querySelectorAll('[data-action="oge-sil"]').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.play('geri');
        cart.removeItem(btn.dataset.key);
        showToast('Ürün listeden çıkarıldı');
        render();
      });
    });

    // Listeyi temizle
    const temizleBtn = container.querySelector('#listeyiTemizleBtn');
    if (temizleBtn) {
      temizleBtn.addEventListener('click', () => {
        sound.play('geri');
        cart.clearList();
        showToast('Listen temizlendi');
        render();
      });
    }

    // Garsona göster modalı
    const modalEl = container.querySelector('#garsonModal');
    const garsonaGosterBtn = container.querySelector('#garsonaGosterBtn');
    const modalKapatBtn = container.querySelector('#modalKapatBtn');
    const modalTamamBtn = container.querySelector('#modalTamamBtn');

    if (garsonaGosterBtn && modalEl) {
      garsonaGosterBtn.addEventListener('click', () => {
        sound.play('listeye-ekle');
        modalEl.style.display = 'flex';
      });

      const closeModal = () => {
        sound.play('geri');
        modalEl.style.display = 'none';
      };

      if (modalKapatBtn) modalKapatBtn.addEventListener('click', closeModal);
      if (modalTamamBtn) modalTamamBtn.addEventListener('click', closeModal);
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) closeModal();
      });
    }
  }

  render();
}
