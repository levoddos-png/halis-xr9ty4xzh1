/**
 * HALİS yönetim paneli — sunucusuz, GitHub Contents / Git Data API
 * Jeton asla koda gömülmez; yalnızca bu tarayıcıda tutulur.
 */

import {
  DATA_BACKEND, loadMenuData, getMenu, setMenuData, serializeMenu,
  loc, slugify, bilingual, formatTL, getProductImage, siteUrl, getSiteRoot,
  getAdminToken, setAdminToken, clearAdminSession, hasRememberedToken, hasPin,
  setAdminPin, verifyAdminPin, verifyAdminToken, saveMenuAndFiles,
  imageFileToWebp, productImagePath, applyCategoryPriceRaise
} from '../../js/data.js';

const root = document.getElementById('admin-root');
const pendingImages = new Map(); // id -> { base64, ext, preview }

const state = {
  view: 'urunler',
  menu: null,
  dirty: false,
  editingId: null,
  editingKat: null,
  status: '',
  error: '',
  filterKat: 'hepsi',
  qrFrom: 1,
  qrTo: 20
};

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

function markDirty() {
  state.dirty = true;
  render();
}

function publicBase() {
  return `${location.origin}${getSiteRoot()}`;
}

function masaUrl(n) {
  const base = publicBase();
  const u = new URL(base);
  u.searchParams.set('masa', String(n));
  return u.toString();
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function field(name, label, value, attrs = '') {
  return `<label class="alan">${label}<input name="${name}" value="${escapeHtml(value ?? '')}" ${attrs}></label>`;
}

/* ——— Giriş ——— */

function renderLogin({ pinMode = false, error = '' } = {}) {
  root.innerHTML = `
    <div class="giris-sarici">
      <div class="giris-kart">
        <h1>HALİS Yönetim</h1>
        <div class="alt">Menüyü buradan düzenlersin. Jeton yalnızca bu tarayıcıda saklanır; koda yazılmaz.</div>
        ${error ? `<div class="hata">${escapeHtml(error)}</div>` : ''}
        ${pinMode ? `
          <form id="pinForm">
            <label class="alan">PIN
              <input name="pin" type="password" inputmode="numeric" autocomplete="off" required>
            </label>
            <button class="btn btn-ana" type="submit">Giriş</button>
            <button class="btn btn-hayalet" type="button" id="pinVazgec" style="width:100%;margin-top:8px">Jetonu yeniden gir</button>
          </form>
        ` : `
          <form id="tokenForm">
            <label class="alan">GitHub ince ayarlı jeton
              <input name="token" type="password" autocomplete="off" required placeholder="github_pat_…">
            </label>
            <label class="satir-secim"><input type="checkbox" name="remember"> Bu cihazda hatırla</label>
            <label class="alan">İsteğe bağlı PIN (hatırlanan giriş için)
              <input name="pin" type="password" inputmode="numeric" autocomplete="off" placeholder="Boş bırakılabilir">
            </label>
            <button class="btn btn-ana" type="submit">Devam et</button>
          </form>
        `}
        <p class="kucuk" style="margin-top:16px">Jeton nasıl alınır? <a href="./OKU.md" target="_blank" rel="noopener">admin/OKU.md</a></p>
      </div>
    </div>
  `;

  const pinForm = root.querySelector('#pinForm');
  if (pinForm) {
    pinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pin = new FormData(pinForm).get('pin');
      if (!(await verifyAdminPin(pin))) {
        renderLogin({ pinMode: true, error: 'PIN doğrulanamadı.' });
        return;
      }
      await enterApp();
    });
    root.querySelector('#pinVazgec').addEventListener('click', () => {
      clearAdminSession({ keepPin: true });
      renderLogin();
    });
  }

  const tokenForm = root.querySelector('#tokenForm');
  if (tokenForm) {
    tokenForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(tokenForm);
      const token = String(fd.get('token') || '').trim();
      const remember = fd.get('remember') === 'on';
      const pin = String(fd.get('pin') || '').trim();
      try {
        await verifyAdminToken(token);
        setAdminToken(token, remember);
        if (pin) await setAdminPin(pin);
        await enterApp();
      } catch (err) {
        renderLogin({ error: err.message || 'Jeton doğrulanamadı. İzinleri ve depoyu kontrol et.' });
      }
    });
  }
}

async function enterApp() {
  state.error = '';
  state.status = 'Menü yükleniyor…';
  root.innerHTML = `<div class="giris-sarici"><div class="giris-kart"><h1>Yükleniyor</h1></div></div>`;
  try {
    await loadMenuData({ fresh: true });
    state.menu = deepClone(getMenu());
    state.qrTo = state.menu.dukkan.masa_sayisi || 20;
    state.status = '';
    state.dirty = false;
    pendingImages.clear();
    render();
  } catch (err) {
    renderLogin({ error: err.message || 'Menü yüklenemedi.' });
  }
}

/* ——— Kabuk ——— */

function render() {
  if (!state.menu) return;
  const nav = (id, label) =>
    `<button class="${state.view === id ? 'aktif' : ''}" data-view="${id}">${label}</button>`;

  root.innerHTML = `
    <div class="kabuk">
      <aside class="yan">
        <div class="logo">HALİS</div>
        ${nav('urunler', 'Ürünler')}
        ${nav('kategoriler', 'Kategoriler')}
        ${nav('vitrin', 'Vitrin')}
        ${nav('dukkan', 'Dükkan')}
        ${nav('qr', 'Masa QR')}
        <div class="alt-yan">
          <a href="${publicBase()}" target="_blank" rel="noopener">Menüyü aç</a>
          <a href="./OKU.md" target="_blank" rel="noopener">Yardım</a>
          <button id="cikisBtn">Çıkış</button>
        </div>
      </aside>
      <div>
        <div class="ustcuk">
          <h2>${baslik(state.view)}</h2>
          ${state.dirty ? '<span class="uyari" style="margin:0">Kaydedilmedi</span>' : ''}
          <button class="btn btn-ana" id="kaydetBtn" ${state.dirty ? '' : 'disabled'} style="width:auto">Kaydet ve yayınla</button>
        </div>
        <div class="icerik">
          ${state.error ? `<div class="hata">${escapeHtml(state.error)}</div>` : ''}
          ${state.status ? `<div class="ok">${escapeHtml(state.status)}</div>` : ''}
          ${renderView()}
        </div>
      </div>
    </div>
  `;

  root.querySelectorAll('[data-view]').forEach((b) => {
    b.addEventListener('click', () => { state.view = b.dataset.view; state.editingId = null; render(); });
  });
  root.querySelector('#cikisBtn').addEventListener('click', () => {
    clearAdminSession({ keepPin: true });
    state.menu = null;
    renderLogin();
  });
  root.querySelector('#kaydetBtn').addEventListener('click', saveAll);
  bindView();
}

function baslik(v) {
  return { urunler: 'Ürünler', kategoriler: 'Kategoriler', vitrin: 'Vitrin', dukkan: 'Dükkan bilgileri', qr: 'Masa QR kodları' }[v] || '';
}

function renderView() {
  if (state.view === 'urunler') return renderProducts();
  if (state.view === 'kategoriler') return renderCategories();
  if (state.view === 'vitrin') return renderVitrin();
  if (state.view === 'dukkan') return renderShop();
  if (state.view === 'qr') return renderQr();
  return '';
}

/* ——— Ürünler ——— */

function productPreview(id) {
  const pend = pendingImages.get(id);
  if (pend?.preview) return pend.preview;
  const p = state.menu.urunler.find((u) => u.id === id);
  if (p?.gorsel) {
    if (p.gorsel.startsWith('blob:') || p.gorsel.startsWith('data:')) return p.gorsel;
    return siteUrl(p.gorsel);
  }
  return '';
}

function renderProducts() {
  const cats = state.menu.kategoriler;
  const list = state.menu.urunler.filter((u) => state.filterKat === 'hepsi' || u.kat === state.filterKat);

  if (state.editingId === '__yeni__' || (state.editingId && state.menu.urunler.some((u) => u.id === state.editingId))) {
    return renderProductForm(state.editingId);
  }

  return `
    <div class="araclar">
      <select id="filtreKat">
        <option value="hepsi">Tüm kategoriler</option>
        ${cats.map((k) => `<option value="${k.id}" ${state.filterKat === k.id ? 'selected' : ''}>${escapeHtml(loc(k.ad))}</option>`).join('')}
      </select>
      <button class="btn btn-ana" id="yeniUrun" style="width:auto">Yeni ürün</button>
    </div>
    <div class="kart-form">
      <h3>Kategoriye toplu zam</h3>
      <div class="araclar">
        <select id="zamKat">
          ${cats.map((k) => `<option value="${k.id}">${escapeHtml(loc(k.ad))}</option>`).join('')}
        </select>
        <input id="zamYuzde" type="number" step="0.1" value="10" style="width:90px" title="Yüzde">
        <span>%</span>
        <button class="btn btn-ikincil" id="zamUygula" style="width:auto">Uygula (henüz kaydetmez)</button>
      </div>
      <div class="kucuk">Seçilen kategorideki vitrin fiyatı ve tüm boy fiyatları yuvarlanarak artar. Extralar değişmez.</div>
    </div>
    <table class="tablo">
      <thead><tr><th></th><th>Ürün</th><th>Kategori</th><th>Fiyat</th><th>Durum</th><th></th></tr></thead>
      <tbody>
        ${list.map((u) => {
          const kat = cats.find((k) => k.id === u.kat);
          const img = productPreview(u.id);
          return `<tr>
            <td>${img ? `<img src="${img}" alt="">` : '<div class="bos-gorsel">görsel yok</div>'}</td>
            <td><strong>${escapeHtml(u.ad.tr)}</strong><div class="kucuk">${escapeHtml(u.ad.en)}</div></td>
            <td>${escapeHtml(kat ? loc(kat.ad) : u.kat)}</td>
            <td>${formatTL(u.fiyat)}${u.ornek_fiyat ? ' <span class="kucuk">örnek</span>' : ''}</td>
            <td>
              ${u.tukendi ? '<span class="rozet rozet-tukendi">Tükendi</span> ' : ''}
              ${u.gizli ? '<span class="rozet rozet-gizli">Gizli</span>' : ''}
            </td>
            <td><button class="btn btn-ikincil" data-edit="${u.id}" style="height:36px;width:auto">Düzenle</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
}

function emptyProduct() {
  const firstKat = state.menu.kategoriler[0]?.id || '';
  return {
    id: '',
    kat: firstKat,
    ad: { tr: '', en: '' },
    kisa: { tr: '', en: '' },
    icindekiler: { tr: '', en: '' },
    fiyat: 0,
    rozet: [],
    alerjen: [],
    boy: [{ id: 'standart', ad: { tr: 'Standart', en: 'Standard' }, fiyat: 0 }],
    ekstra: [],
    gorsel: '',
    tukendi: false,
    gizli: false,
    ornek_fiyat: true
  };
}

function renderProductForm(id) {
  const isNew = id === '__yeni__';
  const u = isNew ? emptyProduct() : deepClone(state.menu.urunler.find((x) => x.id === id));
  const img = isNew ? (pendingImages.get('__yeni__')?.preview || '') : productPreview(u.id);
  const alerjenler = Object.entries(state.menu.alerjenler || {});
  const rozetler = Object.entries(state.menu.rozetler || {});
  const katalog = state.menu.ekstra_katalog || [];

  return `
    <div class="araclar"><button class="btn btn-ikincil" id="formIptal" style="width:auto">← Listeye dön</button></div>
    <form id="urunForm" class="kart-form">
      <h3>${isNew ? 'Yeni ürün' : escapeHtml(u.ad.tr || u.id)}</h3>
      <div class="izgara-2">
        ${field('id', 'Kimlik (id, kalıcı)', u.id, isNew ? 'required pattern="[a-z0-9-]+"' : 'readonly')}
        <label class="alan">Kategori
          <select name="kat">${state.menu.kategoriler.map((k) => `<option value="${k.id}" ${k.id === u.kat ? 'selected' : ''}>${escapeHtml(k.ad.tr)}</option>`).join('')}</select>
        </label>
        ${field('ad_tr', 'Ad (TR)', u.ad.tr, 'required')}
        ${field('ad_en', 'Ad (EN)', u.ad.en)}
        ${field('kisa_tr', 'Kısa açıklama (TR)', u.kisa.tr)}
        ${field('kisa_en', 'Kısa açıklama (EN)', u.kisa.en)}
        ${field('ic_tr', 'İçindekiler (TR)', u.icindekiler.tr)}
        ${field('ic_en', 'İçindekiler (EN)', u.icindekiler.en)}
        ${field('fiyat', 'Vitrin fiyatı (₺)', u.fiyat, 'type="number" min="0" step="1"')}
      </div>
      <label class="satir-secim"><input type="checkbox" name="ornek_fiyat" ${u.ornek_fiyat ? 'checked' : ''}> Örnek fiyat</label>
      <label class="satir-secim"><input type="checkbox" name="tukendi" ${u.tukendi ? 'checked' : ''}> Tükendi</label>
      <label class="satir-secim"><input type="checkbox" name="gizli" ${u.gizli ? 'checked' : ''}> Gizle (menüde görünmesin)</label>

      <h3 style="margin-top:18px">Görsel</h3>
      <div class="gorsel-alani">
        ${img ? `<img id="gorselOnizleme" src="${img}" alt="">` : '<div class="bos-gorsel" id="gorselOnizleme">yok</div>'}
        <div>
          <input type="file" id="gorselDosya" accept="image/*">
          <div class="kucuk">Yüklenince otomatik küçültülür ve WebP yapılır. Dosya adı ürün id’sidir.</div>
        </div>
      </div>

      <h3 style="margin-top:18px">Boy / porsiyon</h3>
      <div id="boyListesi">
        ${(u.boy || []).map((b, i) => boyRow(b, i)).join('')}
      </div>
      <button type="button" class="btn btn-ikincil" id="boyEkle" style="width:auto;height:36px">Boy ekle</button>

      <h3 style="margin-top:18px">Ekstralar</h3>
      <div id="ekstraListesi">
        ${katalog.map((e) => `
          <label class="satir-secim">
            <input type="checkbox" name="ekstra" value="${e.id}" ${u.ekstra.includes(e.id) ? 'checked' : ''}>
            ${escapeHtml(e.ad.tr)} (${formatTL(e.fiyat)})
          </label>`).join('') || '<div class="kucuk">Katalog boş. Vitrin sekmesinden ekstra ekleyebilirsin.</div>'}
      </div>

      <h3 style="margin-top:18px">Alerjenler</h3>
      ${alerjenler.map(([id, ad]) => `
        <label class="satir-secim">
          <input type="checkbox" name="alerjen" value="${id}" ${u.alerjen.includes(id) ? 'checked' : ''}>
          ${escapeHtml(ad.tr)} / ${escapeHtml(ad.en)}
        </label>`).join('')}

      <h3 style="margin-top:18px">Rozetler</h3>
      ${rozetler.map(([id, r]) => `
        <label class="satir-secim">
          <input type="checkbox" name="rozet" value="${id}" ${u.rozet.includes(id) ? 'checked' : ''}>
          ${escapeHtml(r.ad.tr)}
        </label>`).join('')}

      <div class="araclar" style="margin-top:20px">
        <button class="btn btn-ana" type="submit" style="width:auto">Ürünü kaydet (taslak)</button>
        ${isNew ? '' : '<button class="btn btn-tehlike" type="button" id="urunSil" style="width:auto">Ürünü sil</button>'}
      </div>
    </form>
  `;
}

function boyRow(b, i) {
  return `<div class="boy-satir" data-i="${i}">
    <input data-f="id" placeholder="id" value="${escapeHtml(b.id)}">
    <input data-f="ad_tr" placeholder="Ad TR" value="${escapeHtml(b.ad?.tr || '')}">
    <input data-f="fiyat" type="number" min="0" step="1" value="${b.fiyat ?? 0}">
    <button type="button" data-boy-sil="${i}" class="btn btn-hayalet">×</button>
    <input data-f="ad_en" placeholder="Ad EN" value="${escapeHtml(b.ad?.en || '')}" style="grid-column:1/-2">
  </div>`;
}

function collectBoys(form) {
  return [...form.querySelectorAll('#boyListesi .boy-satir')].map((row) => {
    const g = (f) => row.querySelector(`[data-f="${f}"]`)?.value || '';
    const adTr = g('ad_tr');
    return {
      id: slugify(g('id') || adTr) || 'boy',
      ad: bilingual({ tr: adTr, en: g('ad_en') }),
      fiyat: Number(g('fiyat')) || 0
    };
  });
}

function bindProductForm() {
  const form = root.querySelector('#urunForm');
  if (!form) return;
  root.querySelector('#formIptal')?.addEventListener('click', () => { state.editingId = null; render(); });
  root.querySelector('#boyEkle')?.addEventListener('click', () => {
    const box = root.querySelector('#boyListesi');
    const i = box.children.length;
    box.insertAdjacentHTML('beforeend', boyRow({ id: '', ad: { tr: '', en: '' }, fiyat: 0 }, i));
    bindBoySil();
  });
  bindBoySil();

  root.querySelector('#gorselDosya')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const conv = await imageFileToWebp(file);
      const preview = URL.createObjectURL(conv.blob);
      const key = state.editingId === '__yeni__' ? '__yeni__' : state.editingId;
      pendingImages.set(key, { base64: conv.base64, ext: conv.ext, preview });
      const el = root.querySelector('#gorselOnizleme');
      if (el.tagName === 'IMG') el.src = preview;
      else el.outerHTML = `<img id="gorselOnizleme" src="${preview}" alt="">`;
    } catch (err) {
      state.error = err.message || 'Görsel dönüştürülemedi.';
      render();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    let id = String(fd.get('id') || '').trim();
    if (state.editingId === '__yeni__') {
      id = slugify(id || fd.get('ad_tr'));
      if (state.menu.urunler.some((u) => u.id === id)) {
        state.error = `Bu id zaten var: ${id}`;
        render();
        return;
      }
    } else {
      id = state.editingId;
    }
    const boy = collectBoys(form);
    const fiyat = Number(fd.get('fiyat'));
    const product = {
      id,
      kat: String(fd.get('kat')),
      ad: bilingual({ tr: fd.get('ad_tr'), en: fd.get('ad_en') }),
      kisa: bilingual({ tr: fd.get('kisa_tr'), en: fd.get('kisa_en') }),
      icindekiler: bilingual({ tr: fd.get('ic_tr'), en: fd.get('ic_en') }),
      fiyat: Number.isFinite(fiyat) ? fiyat : (boy[0]?.fiyat || 0),
      rozet: [...form.querySelectorAll('[name=rozet]:checked')].map((i) => i.value),
      alerjen: [...form.querySelectorAll('[name=alerjen]:checked')].map((i) => i.value),
      boy: boy.length ? boy : [{ id: 'standart', ad: bilingual('Standart', 'Standard'), fiyat: Number(fd.get('fiyat')) || 0 }],
      ekstra: [...form.querySelectorAll('[name=ekstra]:checked')].map((i) => i.value),
      gorsel: state.menu.urunler.find((u) => u.id === id)?.gorsel || `./img/products/${id}.webp`,
      tukendi: fd.get('tukendi') === 'on',
      gizli: fd.get('gizli') === 'on',
      ornek_fiyat: fd.get('ornek_fiyat') === 'on'
    };
    const pend = pendingImages.get(state.editingId === '__yeni__' ? '__yeni__' : id);
    if (pend) {
      pendingImages.delete(state.editingId === '__yeni__' ? '__yeni__' : id);
      pendingImages.set(id, pend);
      product.gorsel = `./${productImagePath(id, pend.ext)}`;
    }
    const idx = state.menu.urunler.findIndex((u) => u.id === id);
    if (idx >= 0) state.menu.urunler[idx] = product;
    else state.menu.urunler.push(product);
    state.editingId = null;
    state.error = '';
    markDirty();
  });

  root.querySelector('#urunSil')?.addEventListener('click', () => {
    if (!confirm('Bu ürün silinsin mi?')) return;
    state.menu.urunler = state.menu.urunler.filter((u) => u.id !== state.editingId);
    if (state.menu.haftanin_secimi === state.editingId) state.menu.haftanin_secimi = '';
    state.menu.cok_satanlar = state.menu.cok_satanlar.filter((x) => x !== state.editingId);
    pendingImages.delete(state.editingId);
    state.editingId = null;
    markDirty();
  });
}

function bindBoySil() {
  root.querySelectorAll('[data-boy-sil]').forEach((b) => {
    b.onclick = () => b.closest('.boy-satir')?.remove();
  });
}

/* ——— Kategoriler ——— */

function renderCategories() {
  if (state.editingKat === '__yeni__' || (state.editingKat && state.menu.kategoriler.some((k) => k.id === state.editingKat))) {
    return renderCategoryForm(state.editingKat);
  }
  return `
    <div class="araclar"><button class="btn btn-ana" id="yeniKat" style="width:auto">Yeni kategori</button></div>
    <div class="kucuk" style="margin-bottom:10px">Sıra, menüdeki görünen sıradır. Oklarla değiştir.</div>
    ${state.menu.kategoriler.map((k, i) => `
      <div class="kat-satir" data-id="${k.id}">
        <span class="renk-nokta" style="background:${k.renk}"></span>
        <div><strong>${escapeHtml(k.ad.tr)}</strong><div class="kucuk">${escapeHtml(k.ad.en)} · ${k.id}</div></div>
        <button class="btn btn-ikincil" data-kat-up="${i}" style="width:auto;height:36px" ${i === 0 ? 'disabled' : ''}>Yukarı</button>
        <button class="btn btn-ikincil" data-kat-down="${i}" style="width:auto;height:36px" ${i === state.menu.kategoriler.length - 1 ? 'disabled' : ''}>Aşağı</button>
        <button class="btn btn-ikincil" data-kat-edit="${k.id}" style="width:auto;height:36px">Düzenle</button>
      </div>
    `).join('')}
  `;
}

function emptyCategory() {
  return {
    id: '',
    ad: { tr: '', en: '' },
    aciklama: { tr: '', en: '' },
    renk: '#1A49AF',
    metin: '#0F1B3D',
    acik: '',
    golge: '',
    renk_degisken: '',
    temsili_urun: ''
  };
}

function renderCategoryForm(id) {
  const isNew = id === '__yeni__';
  const k = isNew ? emptyCategory() : deepClone(state.menu.kategoriler.find((x) => x.id === id));
  return `
    <div class="araclar"><button class="btn btn-ikincil" id="formIptal" style="width:auto">← Listeye dön</button></div>
    <form id="katForm" class="kart-form">
      <h3>${isNew ? 'Yeni kategori' : escapeHtml(k.ad.tr || k.id)}</h3>
      <div class="izgara-2">
        ${field('id', 'Kimlik (id, kalıcı)', k.id, isNew ? 'required pattern="[a-z0-9-]+"' : 'readonly')}
        ${field('ad_tr', 'Ad (TR)', k.ad.tr, 'required')}
        ${field('ad_en', 'Ad (EN)', k.ad.en)}
        ${field('acik_tr', 'Açıklama (TR)', k.aciklama.tr)}
        ${field('acik_en', 'Açıklama (EN)', k.aciklama.en)}
        <label class="alan">Renk <input name="renk" type="color" value="${k.renk || '#1A49AF'}"></label>
        <label class="alan">Yazı rengi <input name="metin" type="color" value="${(k.metin && k.metin.startsWith('#')) ? k.metin : '#0F1B3D'}"></label>
        <label class="alan">Temsili ürün
          <select name="temsili_urun">
            <option value="">—</option>
            ${state.menu.urunler.map((u) => `<option value="${u.id}" ${u.id === k.temsili_urun ? 'selected' : ''}>${escapeHtml(u.ad.tr)}</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="araclar" style="margin-top:16px">
        <button class="btn btn-ana" type="submit" style="width:auto">Kategoriyi kaydet (taslak)</button>
        ${isNew ? '' : '<button class="btn btn-tehlike" type="button" id="katSil" style="width:auto">Sil</button>'}
      </div>
    </form>
  `;
}

/* ——— Vitrin ——— */

function renderVitrin() {
  const visible = state.menu.urunler.filter((u) => !u.gizli);
  const extra = state.menu.ekstra_katalog || [];
  const roz = state.menu.rozetler || {};
  return `
    <form id="vitrinForm" class="kart-form">
      <h3>Haftanın seçimi</h3>
      <label class="alan">
        <select name="hafta">
          <option value="">—</option>
          ${visible.map((u) => `<option value="${u.id}" ${u.id === state.menu.haftanin_secimi ? 'selected' : ''}>${escapeHtml(u.ad.tr)}</option>`).join('')}
        </select>
      </label>
      <h3>Çok satanlar</h3>
      ${visible.map((u) => `
        <label class="satir-secim">
          <input type="checkbox" name="cok" value="${u.id}" ${state.menu.cok_satanlar.includes(u.id) ? 'checked' : ''}>
          ${escapeHtml(u.ad.tr)}
        </label>`).join('')}
      <button class="btn btn-ana" type="submit" style="width:auto;margin-top:12px">Vitrini kaydet (taslak)</button>
    </form>
    <form id="ekstraForm" class="kart-form">
      <h3>Ekstra kataloğu</h3>
      <div id="ekstraKatList">
        ${extra.map((e, i) => `
          <div class="ekstra-satir-admin" data-i="${i}">
            <input data-f="id" value="${escapeHtml(e.id)}" placeholder="id">
            <input data-f="ad_tr" value="${escapeHtml(e.ad.tr)}" placeholder="Ad TR">
            <input data-f="fiyat" type="number" min="0" step="1" value="${e.fiyat}">
            <button type="button" data-ex-sil class="btn btn-hayalet">×</button>
            <input data-f="ad_en" value="${escapeHtml(e.ad.en)}" placeholder="Ad EN" style="grid-column:1/-2">
          </div>`).join('')}
      </div>
      <div class="araclar">
        <button type="button" class="btn btn-ikincil" id="ekstraKatEkle" style="width:auto;height:36px">Ekstra ekle</button>
        <button class="btn btn-ana" type="submit" style="width:auto">Katalogu kaydet (taslak)</button>
      </div>
    </form>
    <form id="rozetForm" class="kart-form">
      <h3>Rozet adları</h3>
      ${Object.entries(roz).map(([id, r]) => `
        <div class="izgara-2" data-rozet="${id}" style="margin-bottom:8px">
          <label class="alan">${escapeHtml(id)} TR <input data-f="tr" value="${escapeHtml(r.ad.tr)}"></label>
          <label class="alan">EN <input data-f="en" value="${escapeHtml(r.ad.en)}"></label>
        </div>`).join('')}
      <button class="btn btn-ana" type="submit" style="width:auto">Rozetleri kaydet (taslak)</button>
    </form>
  `;
}

/* ——— Dükkan ——— */

const GUNLER = [
  { id: 1, tr: 'Pzt' }, { id: 2, tr: 'Sal' }, { id: 3, tr: 'Çar' },
  { id: 4, tr: 'Per' }, { id: 5, tr: 'Cum' }, { id: 6, tr: 'Cmt' }, { id: 0, tr: 'Paz' }
];

function renderShop() {
  const d = state.menu.dukkan;
  return `
    <form id="dukkanForm" class="kart-form">
      <div class="uyari">Adres, telefon, Instagram, WhatsApp ve Wi-Fi şu an örnek veridir. Gerçek bilgileri buradan yazabilirsin.</div>
      <div class="izgara-2">
        ${field('ad_tr', 'Ad (TR)', d.ad.tr)}
        ${field('ad_en', 'Ad (EN)', d.ad.en)}
        ${field('slogan_tr', 'Slogan (TR)', d.slogan.tr)}
        ${field('slogan_en', 'Slogan (EN)', d.slogan.en)}
        ${field('alt_tr', 'Alt slogan (TR)', d.alt_slogan.tr)}
        ${field('alt_en', 'Alt slogan (EN)', d.alt_slogan.en)}
        ${field('acik_tr', 'Açıklama (TR)', d.aciklama.tr)}
        ${field('acik_en', 'Açıklama (EN)', d.aciklama.en)}
        ${field('adres', 'Adres', d.adres)}
        ${field('telefon', 'Telefon', d.telefon)}
        ${field('instagram', 'Instagram', d.instagram)}
        ${field('whatsapp', 'WhatsApp (90xxxxxxxxxx, boş bırakılabilir)', d.whatsapp)}
        ${field('ssid', 'Wi-Fi adı (SSID)', d.wifi.ssid)}
        ${field('sifre', 'Wi-Fi şifresi', d.wifi.sifre)}
        ${field('masa_sayisi', 'Varsayılan masa sayısı (QR)', d.masa_sayisi, 'type="number" min="1" max="200"')}
        ${field('temsili_not', 'Dipnot', d.temsili_not)}
      </div>
      <label class="satir-secim"><input type="checkbox" name="whatsapp_ornek" ${d.whatsapp_ornek ? 'checked' : ''}> WhatsApp numarası örnektir (kullanma)</label>

      <h3 style="margin-top:16px">Çalışma saatleri</h3>
      <div class="kucuk">Açık / kapalı, Türkiye (Europe/Istanbul) saatine göre bu satırlardan hesaplanır.</div>
      <div id="saatListesi" style="margin-top:10px">
        ${(d.saatler || []).map((s, i) => saatRow(s, i)).join('')}
      </div>
      <button type="button" class="btn btn-ikincil" id="saatEkle" style="width:auto;height:36px;margin:8px 0">Saat satırı ekle</button>
      <button class="btn btn-ana" type="submit" style="width:auto">Dükkanı kaydet (taslak)</button>
    </form>
  `;
}

function saatRow(s, i) {
  const ids = new Set(s.gunler_id || []);
  return `<div class="saat-satir" data-i="${i}">
    <input data-f="gunler_tr" placeholder="Günler TR" value="${escapeHtml(s.gunler?.tr || '')}">
    <input data-f="gunler_en" placeholder="Günler EN" value="${escapeHtml(s.gunler?.en || '')}">
    <input data-f="acilis" type="time" value="${escapeHtml(s.acilis || '08:00')}">
    <input data-f="kapanis" type="time" value="${escapeHtml(s.kapanis || '22:00')}">
    <span>${GUNLER.map((g) => `<label style="margin-right:4px"><input type="checkbox" data-gun="${g.id}" ${ids.has(g.id) ? 'checked' : ''}>${g.tr}</label>`).join('')}</span>
    <button type="button" data-saat-sil class="btn btn-hayalet">×</button>
  </div>`;
}

/* ——— QR ——— */

function renderQr() {
  const from = Number(state.qrFrom) || 1;
  const to = Number(state.qrTo) || 1;
  const nums = [];
  for (let n = Math.max(1, from); n <= Math.max(from, to) && nums.length < 80; n++) nums.push(n);
  return `
    <div class="araclar no-print">
      <label>Başla <input id="qrFrom" type="number" min="1" value="${from}" style="width:80px"></label>
      <label>Bitir <input id="qrTo" type="number" min="1" value="${to}" style="width:80px"></label>
      <button class="btn btn-ikincil" id="qrYenile" style="width:auto">Oluştur</button>
      <button class="btn btn-ana" id="qrYazdir" style="width:auto">Yazdır</button>
    </div>
    <div class="kucuk no-print" style="margin-bottom:12px">Kodlar ${escapeHtml(publicBase())}?masa=N adresini açar. Tek tek indir veya yazdır.</div>
    <div class="qr-izgara" id="qrIzgara">
      ${nums.map((n) => `
        <div class="qr-kart" data-masa="${n}">
          <div data-qr="${n}"></div>
          <div class="masa">Masa ${n}</div>
          <div class="kucuk">${escapeHtml(loc(state.menu.dukkan.ad))}</div>
          <a class="no-print" href="#" data-dl="${n}">PNG indir</a>
        </div>`).join('')}
    </div>
  `;
}

function fillQr() {
  if (typeof qrcode !== 'function') return;
  root.querySelectorAll('[data-qr]').forEach((el) => {
    const n = el.dataset.qr;
    const url = masaUrl(n);
    const qr = qrcode(0, 'M');
    qr.addData(url);
    qr.make();
    el.innerHTML = qr.createImgTag(4, 8);
    const img = el.querySelector('img');
    if (img) {
      img.alt = `Masa ${n}`;
      img.style.width = '140px';
      img.style.height = '140px';
    }
  });
  root.querySelectorAll('[data-dl]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const kart = a.closest('.qr-kart');
      const img = kart?.querySelector('img');
      if (!img) return;
      const link = document.createElement('a');
      link.href = img.src;
      link.download = `halis-masa-${a.dataset.dl}.png`;
      link.click();
    });
  });
}

/* ——— bind + save ——— */

function bindView() {
  if (state.view === 'urunler') {
    root.querySelector('#filtreKat')?.addEventListener('change', (e) => { state.filterKat = e.target.value; render(); });
    root.querySelector('#yeniUrun')?.addEventListener('click', () => { state.editingId = '__yeni__'; render(); });
    root.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => { state.editingId = b.dataset.edit; render(); }));
    root.querySelector('#zamUygula')?.addEventListener('click', () => {
      const kat = root.querySelector('#zamKat').value;
      const pct = Number(root.querySelector('#zamYuzde').value);
      if (!Number.isFinite(pct)) return;
      if (!confirm(`${kat} kategorisine %${pct} zam uygulansın mı? (Henüz yayınlanmaz)`)) return;
      applyCategoryPriceRaise(state.menu, kat, pct);
      markDirty();
    });
    bindProductForm();
  }

  if (state.view === 'kategoriler') {
    root.querySelector('#yeniKat')?.addEventListener('click', () => { state.editingKat = '__yeni__'; render(); });
    root.querySelectorAll('[data-kat-edit]').forEach((b) => b.addEventListener('click', () => { state.editingKat = b.dataset.katEdit; render(); }));
    root.querySelectorAll('[data-kat-up]').forEach((b) => b.addEventListener('click', () => moveKat(Number(b.dataset.katUp), -1)));
    root.querySelectorAll('[data-kat-down]').forEach((b) => b.addEventListener('click', () => moveKat(Number(b.dataset.katDown), 1)));
    const form = root.querySelector('#katForm');
    root.querySelector('#formIptal')?.addEventListener('click', () => { state.editingKat = null; render(); });
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      let id = String(fd.get('id') || '').trim();
      if (state.editingKat === '__yeni__') {
        id = slugify(id || fd.get('ad_tr'));
        if (state.menu.kategoriler.some((k) => k.id === id)) {
          state.error = `Bu kategori id’si var: ${id}`;
          render();
          return;
        }
      } else id = state.editingKat;
      const rec = {
        ...(state.menu.kategoriler.find((k) => k.id === id) || emptyCategory()),
        id,
        ad: bilingual({ tr: fd.get('ad_tr'), en: fd.get('ad_en') }),
        aciklama: bilingual({ tr: fd.get('acik_tr'), en: fd.get('acik_en') }),
        renk: String(fd.get('renk') || '#1A49AF'),
        metin: String(fd.get('metin') || '#0F1B3D'),
        temsili_urun: String(fd.get('temsili_urun') || '')
      };
      const idx = state.menu.kategoriler.findIndex((k) => k.id === id);
      if (idx >= 0) state.menu.kategoriler[idx] = rec;
      else state.menu.kategoriler.push(rec);
      state.editingKat = null;
      markDirty();
    });
    root.querySelector('#katSil')?.addEventListener('click', () => {
      const id = state.editingKat;
      const used = state.menu.urunler.some((u) => u.kat === id);
      if (used && !confirm('Bu kategoride ürün var. Yine de silinsin mi? Ürünler kategorisiz kalır.')) return;
      if (!used && !confirm('Kategori silinsin mi?')) return;
      state.menu.kategoriler = state.menu.kategoriler.filter((k) => k.id !== id);
      state.editingKat = null;
      markDirty();
    });
  }

  if (state.view === 'vitrin') {
    root.querySelector('#vitrinForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      state.menu.haftanin_secimi = String(new FormData(form).get('hafta') || '');
      state.menu.cok_satanlar = [...form.querySelectorAll('[name=cok]:checked')].map((i) => i.value);
      markDirty();
    });
    root.querySelector('#ekstraKatEkle')?.addEventListener('click', () => {
      root.querySelector('#ekstraKatList').insertAdjacentHTML('beforeend', `
        <div class="ekstra-satir-admin">
          <input data-f="id" placeholder="id">
          <input data-f="ad_tr" placeholder="Ad TR">
          <input data-f="fiyat" type="number" min="0" value="0">
          <button type="button" data-ex-sil class="btn btn-hayalet">×</button>
          <input data-f="ad_en" placeholder="Ad EN" style="grid-column:1/-2">
        </div>`);
      bindExSil();
    });
    bindExSil();
    root.querySelector('#ekstraForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.menu.ekstra_katalog = [...root.querySelectorAll('#ekstraKatList .ekstra-satir-admin')].map((row) => {
        const g = (f) => row.querySelector(`[data-f="${f}"]`)?.value || '';
        return { id: slugify(g('id') || g('ad_tr')), ad: bilingual({ tr: g('ad_tr'), en: g('ad_en') }), fiyat: Number(g('fiyat')) || 0 };
      }).filter((e) => e.id);
      markDirty();
    });
    root.querySelector('#rozetForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      root.querySelectorAll('#rozetForm [data-rozet]').forEach((row) => {
        const id = row.dataset.rozet;
        if (state.menu.rozetler[id]) {
          state.menu.rozetler[id].ad = bilingual({
            tr: row.querySelector('[data-f=tr]').value,
            en: row.querySelector('[data-f=en]').value
          });
        }
      });
      markDirty();
    });
  }

  if (state.view === 'dukkan') {
    root.querySelector('#saatEkle')?.addEventListener('click', () => {
      root.querySelector('#saatListesi').insertAdjacentHTML('beforeend', saatRow({
        gunler: { tr: '', en: '' }, acilis: '08:00', kapanis: '22:00', gunler_id: [], vurgu: false
      }, 99));
      bindSaatSil();
    });
    bindSaatSil();
    root.querySelector('#dukkanForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const d = state.menu.dukkan;
      d.ad = bilingual({ tr: fd.get('ad_tr'), en: fd.get('ad_en') });
      d.slogan = bilingual({ tr: fd.get('slogan_tr'), en: fd.get('slogan_en') });
      d.alt_slogan = bilingual({ tr: fd.get('alt_tr'), en: fd.get('alt_en') });
      d.aciklama = bilingual({ tr: fd.get('acik_tr'), en: fd.get('acik_en') });
      d.adres = String(fd.get('adres') || '');
      d.telefon = String(fd.get('telefon') || '');
      d.instagram = String(fd.get('instagram') || '');
      d.whatsapp = String(fd.get('whatsapp') || '').replace(/\s/g, '');
      d.whatsapp_ornek = fd.get('whatsapp_ornek') === 'on';
      d.wifi.ssid = String(fd.get('ssid') || '');
      d.wifi.sifre = String(fd.get('sifre') || '');
      d.masa_sayisi = Number(fd.get('masa_sayisi')) || 20;
      d.temsili_not = String(fd.get('temsili_not') || '');
      d.saatler = [...root.querySelectorAll('#saatListesi .saat-satir')].map((row) => {
        const g = (f) => row.querySelector(`[data-f="${f}"]`)?.value || '';
        const acilis = g('acilis') || '08:00';
        const kapanis = g('kapanis') || '22:00';
        return {
          gunler: bilingual({ tr: g('gunler_tr'), en: g('gunler_en') }),
          saat: `${acilis} – ${kapanis}`,
          acilis,
          kapanis,
          gunler_id: [...row.querySelectorAll('[data-gun]:checked')].map((i) => Number(i.dataset.gun)),
          vurgu: false
        };
      });
      markDirty();
    });
  }

  if (state.view === 'qr') {
    root.querySelector('#qrYenile')?.addEventListener('click', () => {
      state.qrFrom = Number(root.querySelector('#qrFrom').value) || 1;
      state.qrTo = Number(root.querySelector('#qrTo').value) || 1;
      render();
    });
    root.querySelector('#qrYazdir')?.addEventListener('click', () => window.print());
    fillQr();
  }
}

function bindExSil() {
  root.querySelectorAll('[data-ex-sil]').forEach((b) => { b.onclick = () => b.closest('.ekstra-satir-admin')?.remove(); });
}
function bindSaatSil() {
  root.querySelectorAll('[data-saat-sil]').forEach((b) => { b.onclick = () => b.closest('.saat-satir')?.remove(); });
}
function moveKat(i, dir) {
  const arr = state.menu.kategoriler;
  const j = i + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  markDirty();
}

async function saveAll() {
  state.error = '';
  state.status = 'Kaydediliyor… GitHub’a işleniyor.';
  render();
  const files = [];
  for (const [id, img] of pendingImages) {
    if (id === '__yeni__') continue;
    files.push({ path: productImagePath(id, img.ext), contentBase64: img.base64, encoding: 'base64' });
  }
  try {
    const res = await saveMenuAndFiles(state.menu, files, 'Menü güncellemesi (admin panel)');
    pendingImages.clear();
    state.dirty = false;
    setMenuData(serializeMenu(state.menu));
    state.status = `Kaydedildi (${res.sha.slice(0, 7)}). GitHub Pages genellikle 1–2 dakikada güncellenir.`;
    render();
  } catch (err) {
    state.status = '';
    state.error = err.message || 'Kayıt başarısız.';
    render();
  }
}

/* ——— başlangıç ——— */

(async function start() {
  window.addEventListener('error', (e) => { console.error(e); });
  if (hasPin() && hasRememberedToken()) {
    renderLogin({ pinMode: true });
    return;
  }
  if (getAdminToken()) {
    try {
      await verifyAdminToken();
      await enterApp();
      return;
    } catch (_) {
      clearAdminSession({ keepPin: true });
    }
  }
  renderLogin();
})();
