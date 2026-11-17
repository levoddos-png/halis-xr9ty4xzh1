/**
 * HALİS QR Web Menü — Özel pasta talebi (WhatsApp)
 */

import { renderHeader, renderAltbar, showToast } from '../components.js';
import {
  t, loc, getMenu, buildCakeWhatsAppMessage, whatsappLink, whatsappNumber
} from '../data.js';
import { sound } from '../audio.js';

export function renderSiparisView(container, { onNavigateHome } = {}) {
  const dukkan = getMenu().dukkan || {};
  const hasNumber = !!whatsappNumber();

  const html = `
    <div class="ekran siparis-ekran" data-ekran="siparis">
      ${renderHeader({
        back: true,
        title: t('ozel_form_baslik'),
        showSound: true,
        showTheme: true,
        showSearch: false,
        isTransparent: false
      })}

      <main class="kaydir" style="padding: 12px 16px 110px">
        <h1 class="h1">${t('ozel_form_baslik')}</h1>
        <p class="kucuk" style="margin-top:6px; margin-bottom:18px">${t('ozel_pasta_aciklama')}</p>

        ${!hasNumber ? `<div class="uyari-kutu">${t('whatsapp_yok')}</div>` : ''}

        <form id="pastaForm" class="ozel-form" autocomplete="on">
          <label>${t('adin')}
            <input name="ad" type="text" required maxlength="80">
          </label>
          <label>${t('telefonun')}
            <input name="telefon" type="tel" maxlength="20">
          </label>
          <label>${t('pasta_turu')}
            <input name="tur" type="text" required maxlength="80" placeholder="${loc(dukkan.ad)}">
          </label>
          <label>${t('kac_kisilik')}
            <input name="kisilik" type="text" maxlength="20">
          </label>
          <label>${t('istenen_tarih')}
            <input name="tarih" type="date">
          </label>
          <label>${t('notun')}
            <textarea name="not" rows="3" maxlength="400"></textarea>
          </label>
          <button type="submit" class="buton birincil genis" id="waGonder">
            ${t('whatsapp_gonder')}
          </button>
          <button type="button" class="buton hayalet genis" id="mesajKopyala">
            ${t('mesaji_kopyala')}
          </button>
        </form>
      </main>

      ${renderAltbar('bilgi')}
    </div>
  `;

  container.innerHTML = html;

  const form = container.querySelector('#pastaForm');

  function collect() {
    const fd = new FormData(form);
    return {
      ad: String(fd.get('ad') || '').trim(),
      telefon: String(fd.get('telefon') || '').trim(),
      tur: String(fd.get('tur') || '').trim(),
      kisilik: String(fd.get('kisilik') || '').trim(),
      tarih: String(fd.get('tarih') || '').trim(),
      not: String(fd.get('not') || '').trim()
    };
  }

  function messageOrWarn() {
    const data = collect();
    if (!data.ad || !data.tur) {
      showToast(t('form_eksik'));
      return null;
    }
    return buildCakeWhatsAppMessage(data);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = messageOrWarn();
    if (!msg) return;
    sound.play('listeye-ekle');
    const url = whatsappLink(msg);
    window.open(url, '_blank', 'noopener');
  });

  container.querySelector('#mesajKopyala').addEventListener('click', () => {
    const msg = messageOrWarn();
    if (!msg) return;
    sound.play('dokunma');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).catch(() => {});
    }
    showToast(t('mesaj_kopyalandi'));
  });
}
