/**
 * HALİS QR Web Menü — Hakkımızda / Dükkan Bilgisi Görünümü
 * Adres, telefon, Wi-Fi bilgisi (tek tıkla şifre kopyalama),
 * çalışma saatleri, dinamik açık/kapalı rozeti ve garson çağırma.
 */

import { renderHeader, renderAltbar, showToast } from '../components.js';
import { getMenu } from '../data.js';
import { ik, DEKO, dekoEl } from '../icons.js';
import { sound } from '../audio.js';
import { animateStaggeredEntrance } from '../transitions.js';

/**
 * Mevcut saat ve güne göre dükkanın açık olup olmadığını kontrol eder
 */
function isShopOpen() {
  const now = new Date();
  const day = now.getDay(); // 0 = Pazar, 6 = Cumartesi, 1-5 = Hafta içi
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  if (day >= 1 && day <= 5) {
    // Pazartesi - Cuma: 07:00 (420 dk) - 22:00 (1320 dk)
    return currentTime >= 7 * 60 && currentTime < 22 * 60;
  } else if (day === 6) {
    // Cumartesi: 08:00 (480 dk) - 23:00 (1380 dk)
    return currentTime >= 8 * 60 && currentTime < 23 * 60;
  } else {
    // Pazar: 08:00 (480 dk) - 22:00 (1320 dk)
    return currentTime >= 8 * 60 && currentTime < 22 * 60;
  }
}

export function renderAboutView(container, { onNavigateHome } = {}) {
  const menu = getMenu();
  const dukkan = menu.dukkan || {};
  const urlParams = new URLSearchParams(window.location.search);
  const tableNo = urlParams.get('masa') || '7';

  const isOpen = isShopOpen();
  const openStatusBadge = isOpen
    ? `<span class="rozet" style="background:var(--renk-yesil-100); color:var(--renk-retro-yesil)">● Şu an açık</span>`
    : `<span class="rozet" style="background:var(--yuzey-2); color:var(--metin-2)">● Şu an kapalı</span>`;

  const saatler = dukkan.saatler || [
    { gunler: 'Pazartesi – Cuma', saat: '07:00 – 22:00', vurgu: false },
    { gunler: 'Cumartesi', saat: '08:00 – 23:00', vurgu: true },
    { gunler: 'Pazar', saat: '08:00 – 22:00', vurgu: false }
  ];

  const html = `
    <div class="ekran bilgi-ekran" data-ekran="bilgi">
      ${renderHeader({
        back: false,
        title: 'Hakkımızda',
        showSound: true,
        showTheme: true,
        showSearch: true,
        isTransparent: false
      })}

      <main class="kaydir" id="bilgiKaydir" style="padding-top:10px; padding-bottom:110px">
        <!-- Hero Hakkımızda Kartı -->
        <section class="liste-oge" style="margin: 0 16px;">
          <div style="border-radius:var(--r-kart); background:var(--renk-lacivert); color:#fff; padding:24px 20px; position:relative; overflow:hidden; box-shadow:var(--golge-3)">
            ${dekoEl(240, -35, DEKO.daire(70, '#00A3FF'))}
            ${dekoEl(285, 95, DEKO.halka(26, '#FFD850', 8))}
            ${dekoEl(190, 130, DEKO.yildiz(18, '#FFF500'))}
            <div class="etiket" style="color:var(--renk-sari)">Hakkımızda</div>
            <h1 class="h1" style="margin-top:8px; color:#fff; position:relative; font-size:28px">
              ${dukkan.alt_slogan || 'Mahallenin<br>tatlı köşesi'}
            </h1>
            <p style="margin-top:10px; font-size:14px; line-height:1.55; opacity:.92; max-width:280px; position:relative">
              ${dukkan.aciklama || 'Sabah simidinden akşam dondurmasına, her şeyi kendi fırınımızda, her gün taze hazırlıyoruz.'}
            </p>
          </div>
        </section>

        <!-- Çalışma Saatleri -->
        <section class="liste-oge" style="margin: 14px 16px 0;">
          <div style="background:var(--yuzey); border-radius:var(--r-kart); padding:18px 20px; box-shadow:var(--golge-1); border:1px solid var(--kenar)">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px">
              <span style="color:var(--baslik)">${ik('saat')}</span>
              <h2 class="h3" style="flex:1">Çalışma saatleri</h2>
              ${openStatusBadge}
            </div>

            <div style="display:flex; flex-direction:column; gap:10px">
              ${saatler.map(s => `
                <div style="display:flex; justify-content:space-between; font-size:15px; ${s.vurgu ? 'font-weight:800; color:var(--baslik)' : 'font-weight:600'}">
                  <span>${s.gunler}</span>
                  <span style="font-variant-numeric:tabular-nums">${s.saat}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- 2 Sütun Hızlı İşlemler: Wi-Fi ve Garson -->
        <section class="liste-oge" style="margin: 12px 16px 0; display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <!-- Wi-Fi Kutusu -->
          <div 
            id="wifiKutusu"
            role="button"
            tabindex="0"
            aria-label="Wi-Fi şifresini kopyala"
            style="background:var(--renk-sari); border-radius:24px; padding:16px; color:var(--renk-gece); cursor:pointer; box-shadow:var(--golge-1); position:relative"
          >
            <div style="display:flex; justify-content:space-between; align-items:flex-start">
              ${ik('wifi')}
              <span style="opacity:.6">${ik('kopyala')}</span>
            </div>
            <div class="h3" style="margin-top:10px; font-size:16px">Wi-Fi</div>
            <div style="font-size:13px; font-weight:800; margin-top:2px">
              ${dukkan.wifi?.ssid || 'HALIS-Misafir'}
            </div>
            <div style="font-size:12px; opacity:.8; margin-top:2px">
              Şifre: <b>${dukkan.wifi?.sifre || 'tatli2026'}</b>
            </div>
          </div>

          <!-- Garson Çağır Kutusu -->
          <div 
            id="garsonCagirKutusu"
            role="button"
            tabindex="0"
            aria-label="Garson çağır"
            style="background:var(--renk-mandalina); border-radius:24px; padding:16px; color:var(--renk-gece); cursor:pointer; box-shadow:var(--golge-1)"
          >
            <div style="display:flex; justify-content:space-between; align-items:flex-start">
              ${ik('garson')}
            </div>
            <div class="h3" style="margin-top:10px; font-size:16px">Garson çağır</div>
            <div style="font-size:13px; font-weight:800; margin-top:2px">
              Masa ${tableNo}
            </div>
            <div style="font-size:12px; opacity:.85; margin-top:2px">
              Tek dokunuşla çağır
            </div>
          </div>
        </section>

        <!-- Adres ve İletişim Kartı -->
        <section class="liste-oge" style="margin: 12px 16px 0;">
          <div style="background:var(--yuzey); border-radius:var(--r-kart); padding:18px 20px; box-shadow:var(--golge-1); border:1px solid var(--kenar); font-size:14px; font-weight:600; line-height:1.5">
            <div style="display:flex; gap:12px; align-items:flex-start">
              <span style="color:var(--baslik); margin-top:2px">${ik('konum')}</span>
              <span>${dukkan.adres || 'Örnek Mah. Lezzet Sok. No: 7<br>Kadıköy / İstanbul'}</span>
            </div>

            <div style="display:flex; gap:12px; align-items:center; margin-top:12px">
              <span style="color:var(--baslik)">${ik('telefon')}</span>
              <a href="tel:${dukkan.telefon?.replace(/\s/g, '') || ''}" style="color:inherit; text-decoration:none">
                ${dukkan.telefon || '0 (216) 000 00 00'}
              </a>
            </div>

            <div style="display:flex; gap:8px; margin-top:16px">
              <button class="buton birincil" style="flex:1; height:46px; font-size:14px" id="yolTarifiBtn">
                ${ik('konum')} Yol tarifi
              </button>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener"
                class="buton hayalet" 
                style="flex:1; height:46px; font-size:14px; display:inline-flex; align-items:center; justify-content:center"
              >
                ${ik('insta')} ${dukkan.instagram || '@halispastane'}
              </a>
            </div>
          </div>
        </section>

        <!-- Temsili Veri Dipnotu -->
        <div class="kucuk" style="text-align:center; margin:16px 20px 0; font-size:11px; opacity:.75">
          ${dukkan.temsili_not || 'Adres, telefon ve Wi-Fi bilgileri örnektir (Örnek Veri).'}
        </div>
      </main>

      ${renderAltbar('bilgi')}
    </div>
  `;

  container.innerHTML = html;

  // Staggered animasyon
  animateStaggeredEntrance(container, '.liste-oge');

  // Wi-Fi şifresi kopyalama
  const wifiEl = container.querySelector('#wifiKutusu');
  if (wifiEl) {
    wifiEl.addEventListener('click', () => {
      sound.play('dokunma');
      const sifre = dukkan.wifi?.sifre || 'tatli2026';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(sifre).catch(() => {});
      }
      showToast('Wi-Fi şifresi kopyalandı', `Şifre: ${sifre}`);
    });
  }

  // Garson çağırma
  const garsonEl = container.querySelector('#garsonCagirKutusu');
  if (garsonEl) {
    garsonEl.addEventListener('click', () => {
      sound.play('listeye-ekle');
      showToast(`Masa ${tableNo} için garson çağrıldı!`, 'Personelimize haber iletildi.');
    });
  }

  // Yol tarifi butonu
  const yolTarifiBtn = container.querySelector('#yolTarifiBtn');
  if (yolTarifiBtn) {
    yolTarifiBtn.addEventListener('click', () => {
      sound.play('dokunma');
      showToast('Kadıköy şubemize bekleriz!', dukkan.adres || 'Örnek Mah. Lezzet Sok. No: 7');
    });
  }
}
