/**
 * HALİS QR Web Menü — Hakkımızda / Dükkan Bilgisi
 */

import { renderHeader, renderAltbar, showToast } from '../components.js';
import { getMenu, getShopStatus, getTableNumber, loc, t, instagramUrl, mapsUrl } from '../data.js';
import { ik, DEKO, dekoEl } from '../icons.js';
import { sound } from '../audio.js';
import { animateStaggeredEntrance } from '../transitions.js';

export function renderAboutView(container, { onNavigateHome } = {}) {
  const menu = getMenu();
  const dukkan = menu.dukkan || {};
  const tableNo = getTableNumber();
  const status = getShopStatus();
  const statusClass = status.code === 'acik' ? 'durum-acik' : status.code === 'yakinda_kapaniyor' ? 'durum-yakinda' : 'durum-kapali';
  const openStatusBadge = `<span class="rozet ${statusClass}">● ${status.label}</span>`;
  const saatler = dukkan.saatler || [];
  const hasWifi = !!(dukkan.wifi && (dukkan.wifi.ssid || dukkan.wifi.sifre));

  const html = `
    <div class="ekran bilgi-ekran" data-ekran="bilgi">
      ${renderHeader({
        back: false,
        title: t('hakkimizda'),
        showSound: true,
        showTheme: true,
        showSearch: true,
        isTransparent: false
      })}

      <main class="kaydir" id="bilgiKaydir" style="padding-top:10px; padding-bottom:110px">
        <section class="liste-oge" style="margin: 0 16px;">
          <div style="border-radius:var(--r-kart); background:var(--renk-lacivert); color:#fff; padding:24px 20px; position:relative; overflow:hidden; box-shadow:var(--golge-3)">
            ${dekoEl(240, -35, DEKO.daire(70, '#00A3FF'))}
            ${dekoEl(285, 95, DEKO.halka(26, '#FFD850', 8))}
            ${dekoEl(190, 130, DEKO.yildiz(18, '#FFF500'))}
            <div class="etiket" style="color:var(--renk-sari)">${t('hakkimizda')}</div>
            <h1 class="h1" style="margin-top:8px; color:#fff; position:relative; font-size:28px">
              ${loc(dukkan.alt_slogan)}
            </h1>
            <p style="margin-top:10px; font-size:14px; line-height:1.55; opacity:.92; max-width:280px; position:relative">
              ${loc(dukkan.aciklama)}
            </p>
          </div>
        </section>

        <section class="liste-oge" style="margin: 14px 16px 0;">
          <div style="background:var(--yuzey); border-radius:var(--r-kart); padding:18px 20px; box-shadow:var(--golge-1); border:1px solid var(--kenar)">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px">
              <span style="color:var(--baslik)">${ik('saat')}</span>
              <h2 class="h3" style="flex:1">${t('calisma_saatleri')}</h2>
              ${openStatusBadge}
            </div>
            <div style="display:flex; flex-direction:column; gap:10px">
              ${saatler.map(s => `
                <div style="display:flex; justify-content:space-between; font-size:15px; ${s.vurgu ? 'font-weight:800; color:var(--baslik)' : 'font-weight:600'}">
                  <span>${loc(s.gunler)}</span>
                  <span style="font-variant-numeric:tabular-nums">${s.saat || `${s.acilis} – ${s.kapanis}`}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <section class="liste-oge" style="margin: 12px 16px 0; display:grid; grid-template-columns:${hasWifi ? '1fr 1fr' : '1fr'}; gap:12px">
          ${hasWifi ? `<div
            id="wifiKutusu"
            role="button"
            tabindex="0"
            aria-label="${t('wifi')}"
            style="background:var(--renk-sari); border-radius:24px; padding:16px; color:var(--renk-gece); cursor:pointer; box-shadow:var(--golge-1); position:relative"
          >
            <div style="display:flex; justify-content:space-between; align-items:flex-start">
              ${ik('wifi')}
              <span style="opacity:.6">${ik('kopyala')}</span>
            </div>
            <div class="h3" style="margin-top:10px; font-size:16px">${t('wifi')}</div>
            <div style="font-size:13px; font-weight:800; margin-top:2px">
              ${dukkan.wifi?.ssid || ''}
            </div>
            <div style="font-size:12px; opacity:.8; margin-top:2px">
              ${t('sifre')}: <b>${dukkan.wifi?.sifre || ''}</b>
            </div>
          </div>` : ''}
          <a
            id="garsonListeKutusu"
            href="#/listem"
            aria-label="${t('garson_listem')}"
            style="background:var(--renk-mandalina); border-radius:24px; padding:16px; color:var(--renk-gece); cursor:pointer; box-shadow:var(--golge-1); text-decoration:none; color:inherit; display:block"
          >
            <div style="display:flex; justify-content:space-between; align-items:flex-start">
              ${ik('garson')}
            </div>
            <div class="h3" style="margin-top:10px; font-size:16px">${t('garson_listem')}</div>
            <div style="font-size:13px; font-weight:800; margin-top:2px">
              ${tableNo ? `${t('masa')} ${tableNo}` : t('listem')}
            </div>
            <div style="font-size:12px; opacity:.85; margin-top:2px">
              ${t('garson_listem_alt')}
            </div>
          </a>
        </section>

        <section class="liste-oge" style="margin: 12px 16px 0;">
          <a href="#/ozel-siparis" class="ozel-pasta-cta" style="margin:0">
            ${ik('liste')}
            <span>
              <strong>${t('ozel_pasta')}</strong>
              <small>${t('ozel_pasta_aciklama')}</small>
            </span>
          </a>
        </section>

        <section class="liste-oge" style="margin: 12px 16px 0;">
          <div style="background:var(--yuzey); border-radius:var(--r-kart); padding:18px 20px; box-shadow:var(--golge-1); border:1px solid var(--kenar); font-size:14px; font-weight:600; line-height:1.5">
            <div style="display:flex; gap:12px; align-items:flex-start">
              <span style="color:var(--baslik); margin-top:2px">${ik('konum')}</span>
              <span>${dukkan.adres || ''}</span>
            </div>

            <div style="display:flex; gap:12px; align-items:center; margin-top:12px">
              <span style="color:var(--baslik)">${ik('telefon')}</span>
              <a href="tel:${(dukkan.telefon || '').replace(/\\s/g, '')}" style="color:inherit; text-decoration:none">
                ${dukkan.telefon || ''}
              </a>
            </div>

            <div style="display:flex; gap:8px; margin-top:16px">
              <a
                id="yolTarifiBtn"
                href="${mapsUrl(dukkan.adres)}"
                target="_blank"
                rel="noopener"
                class="buton birincil"
                style="flex:1; height:46px; font-size:14px; display:inline-flex; align-items:center; justify-content:center; text-decoration:none"
              >
                ${ik('konum')} ${t('yol_tarifi')}
              </a>
              <a
                href="${instagramUrl(dukkan.instagram)}"
                target="_blank"
                rel="noopener"
                class="buton hayalet"
                style="flex:1; height:46px; font-size:14px; display:inline-flex; align-items:center; justify-content:center"
              >
                ${ik('insta')} ${dukkan.instagram || ''}
              </a>
            </div>
          </div>
        </section>

        <div class="kucuk" style="text-align:center; margin:16px 20px 0; font-size:11px; opacity:.75">
          ${dukkan.temsili_not || ''}
        </div>
      </main>

      ${renderAltbar('bilgi')}
    </div>
  `;

  container.innerHTML = html;
  animateStaggeredEntrance(container, '.liste-oge');

  const wifiEl = container.querySelector('#wifiKutusu');
  if (wifiEl) {
    wifiEl.addEventListener('click', () => {
      sound.play('dokunma');
      const sifre = dukkan.wifi?.sifre || '';
      if (sifre && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(sifre).catch(() => {});
      }
      showToast(t('wifi_kopyalandi'), sifre ? `${t('sifre')}: ${sifre}` : '');
    });
  }

  const garsonEl = container.querySelector('#garsonListeKutusu');
  if (garsonEl) {
    garsonEl.addEventListener('click', () => sound.play('listeye-ekle'));
  }
}
