/**
 * HALİS QR Web Menü — Veri Modülü
 * Tüm okuma/yazma bu dosyadadır. İleride Supabase geçişinde yalnızca burası değişir.
 */

export const DATA_BACKEND = {
  type: 'github',
  owner: 'levoddos-png',
  repo: 'halis-xr9ty4xzh1',
  branch: 'main',
  menuPath: 'data/menu.json',
  imageDir: 'img/products'
};

const TOKEN_KEY = 'halis-admin-token';
const REMEMBER_KEY = 'halis-admin-remember';
const PIN_KEY = 'halis-admin-pin';
const LANG_KEY = 'halis-lang';

const ALERJEN_ESKI = {
  'gluten': 'gluten',
  'süt': 'sut',
  'sut': 'sut',
  'yumurta': 'yumurta',
  'soya': 'soya',
  'kabuklu yemiş': 'kabuklu',
  'kabuklu yemis': 'kabuklu',
  'kabuklu': 'kabuklu',
  'susam': 'susam',
  'yerfıstığı': 'yerfistigi',
  'yerfistigi': 'yerfistigi'
};

const UI = {
  tr: {
    menu: 'Menü', ara: 'Ara', listem: 'Listem', bilgi: 'Bilgi',
    gunaydin: 'Günaydın!', iyi_gunler: 'İyi günler!', iyi_aksamlar: 'İyi akşamlar!',
    bugun_canin: 'Bugün canın', ne_cekiyor: 'ne çekiyor?', tatli_mi: 'tatlı mı?',
    tumu: 'Tümü', kategoriler: 'Kategoriler', tumunu_gor: 'Tümünü gör',
    cok_satanlar: 'Çok satanlar', haftanin_secimi: 'Haftanın seçimi',
    lezzet: 'lezzet', kategori: 'Kategori',
    acik: 'Şu an açık', kapali: 'Şu an kapalı', yakinda: 'Yakında kapanıyor',
    masa: 'Masa',
    porsiyon: 'Porsiyon', boy: 'Boy', ekstra: 'Ekstralar',
    alerjenler: 'Alerjenler', icindekiler: 'İçindekiler',
    alerjen_yok: 'Alerjen bildirilmedi',
    alerjen_not: 'Alerjen bilgisi için lütfen personelimize danışın. Görseller temsilîdir.',
    listeme_ekle: 'Listeme ekle', listene_eklendi: 'Listene eklendi',
    tukendi: 'Tükendi', gizli_urun: 'Bu ürün menüde yok',
    ornek_fiyat: 'örnek fiyat',
    listem_bos: 'Listen henüz boş',
    listem_bos_aciklama: 'Beğendiğin ürünleri ekle; garsonuna tek dokunuşla göster.',
    menuye_goz_at: 'Menüye Göz At',
    listem_ipucu: 'Sipariş vermek için listeni garsona göster.',
    toplam: 'Toplam', urun_sayisi: 'ürün',
    garsona_goster: 'Garsona göster',
    listeyi_temizle: 'Listeyi temizle',
    liste_not: 'Bu liste yalnızca bu cihazda tutulur; sipariş verilmez veya ödeme alınmaz.',
    garson_ozet: 'Garson listesi',
    calisma_saatleri: 'Çalışma saatleri',
    hakkimizda: 'Hakkımızda',
    wifi: 'Wi-Fi', sifre: 'Şifre', wifi_kopyalandi: 'Wi-Fi şifresi kopyalandı',
    garson_listem: 'Garson listemi göster',
    garson_listem_alt: 'Seçtiklerini göster',
    yol_tarifi: 'Yol tarifi',
    ozel_pasta: 'Özel pasta siparişi',
    ozel_pasta_aciklama: 'Doğum günü veya özel gün pastası için talebini WhatsApp üzerinden ilet.',
    ozel_form_baslik: 'Özel pasta talebi',
    adin: 'Adın', telefonun: 'Telefonun', pasta_turu: 'Pasta türü',
    kac_kisilik: 'Kaç kişilik', istenen_tarih: 'İstenen tarih',
    notun: 'Notun', whatsapp_gonder: 'WhatsApp ile gönder',
    mesaji_kopyala: 'Mesajı kopyala',
    whatsapp_yok: 'WhatsApp numarası henüz tanımlı değil (örnek veri). Mesajı kopyalayıp iletebilirsin.',
    form_eksik: 'Lütfen adını ve pasta türünü yaz.',
    mesaj_kopyalandi: 'Mesaj kopyalandı',
    urun_cikarildi: 'Ürün listeden çıkarıldı',
    liste_temizlendi: 'Listen temizlendi',
    dil: 'Dil',
    geri: 'Geri',
    ara_placeholder: 'Tatlı, dondurma, poğaça…',
    tamam: 'Tamam', kapat: 'Kapat'
  },
  en: {
    menu: 'Menu', ara: 'Search', listem: 'My list', bilgi: 'Info',
    gunaydin: 'Good morning!', iyi_gunler: 'Good afternoon!', iyi_aksamlar: 'Good evening!',
    bugun_canin: 'What are you', ne_cekiyor: 'in the mood for?', tatli_mi: 'something sweet?',
    tumu: 'All', kategoriler: 'Categories', tumunu_gor: 'See all',
    cok_satanlar: 'Best sellers', haftanin_secimi: 'Pick of the week',
    lezzet: 'items', kategori: 'Category',
    acik: 'Open now', kapali: 'Closed now', yakinda: 'Closing soon',
    masa: 'Table',
    porsiyon: 'Portion', boy: 'Size', ekstra: 'Extras',
    alerjenler: 'Allergens', icindekiler: 'Ingredients',
    alerjen_yok: 'No allergens listed',
    alerjen_not: 'Please ask our staff about allergens. Images are illustrative.',
    listeme_ekle: 'Add to list', listene_eklendi: 'Added to your list',
    tukendi: 'Sold out', gizli_urun: 'This item is not on the menu',
    ornek_fiyat: 'sample price',
    listem_bos: 'Your list is empty',
    listem_bos_aciklama: 'Add the items you like, then show the list to your waiter.',
    menuye_goz_at: 'Browse the menu',
    listem_ipucu: 'Show your list to the waiter to order.',
    toplam: 'Total', urun_sayisi: 'items',
    garsona_goster: 'Show waiter',
    listeyi_temizle: 'Clear list',
    liste_not: 'This list stays on this device only; it does not place an order or take payment.',
    garson_ozet: 'Waiter list',
    calisma_saatleri: 'Opening hours',
    hakkimizda: 'About us',
    wifi: 'Wi-Fi', sifre: 'Password', wifi_kopyalandi: 'Wi-Fi password copied',
    garson_listem: 'Show my waiter list',
    garson_listem_alt: 'Show what you picked',
    yol_tarifi: 'Directions',
    ozel_pasta: 'Custom cake order',
    ozel_pasta_aciklama: 'Send a custom cake request for birthdays or special days via WhatsApp.',
    ozel_form_baslik: 'Custom cake request',
    adin: 'Your name', telefonun: 'Your phone', pasta_turu: 'Cake type',
    kac_kisilik: 'Servings', istenen_tarih: 'Desired date',
    notun: 'Note', whatsapp_gonder: 'Send via WhatsApp',
    mesaji_kopyala: 'Copy message',
    whatsapp_yok: 'WhatsApp number is not set yet (sample data). You can copy the message and send it yourself.',
    form_eksik: 'Please enter your name and the cake type.',
    mesaj_kopyalandi: 'Message copied',
    urun_cikarildi: 'Item removed from list',
    liste_temizlendi: 'List cleared',
    dil: 'Language',
    geri: 'Back',
    ara_placeholder: 'Dessert, ice cream, pastry…',
    tamam: 'Done', kapat: 'Close'
  }
};

let menuData = null;

export function getSiteRoot() {
  const path = window.location.pathname || '/';
  if (path.includes('/admin')) {
    return path.replace(/\/admin\/?.*$/, '/');
  }
  if (path.endsWith('/')) return path;
  return path.replace(/[^/]+$/, '');
}

export function siteUrl(rel = '') {
  const root = getSiteRoot();
  const clean = String(rel || '').replace(/^\.\//, '');
  return `${root}${clean}`;
}

function menuJsonUrl() {
  return siteUrl('data/menu.json');
}

export function getLang() {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v === 'en' || v === 'tr') return v;
  } catch (_) { /* ignore */ }
  return 'tr';
}

export function setLang(lang) {
  const v = lang === 'en' ? 'en' : 'tr';
  try { localStorage.setItem(LANG_KEY, v); } catch (_) { /* ignore */ }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = v;
  }
  return v;
}

export function t(key) {
  const lang = getLang();
  return (UI[lang] && UI[lang][key]) || (UI.tr[key]) || key;
}

export function loc(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  const lang = getLang();
  return value[lang] || value.tr || value.en || '';
}

export function bilingual(value, fallback = '') {
  if (value && typeof value === 'object' && ('tr' in value || 'en' in value)) {
    return { tr: value.tr || value.en || fallback, en: value.en || value.tr || fallback };
  }
  const s = value == null || value === '' ? fallback : String(value);
  return { tr: s, en: s };
}

export function slugify(str) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', Ç: 'c', Ğ: 'g', İ: 'i', I: 'i', Ö: 'o', Ş: 's', Ü: 'u' };
  return String(str || '')
    .split('')
    .map((c) => map[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'urun';
}

function normalizeSaatler(saatler) {
  if (!Array.isArray(saatler)) return [];
  return saatler.map((s) => {
    const acilis = s.acilis || (String(s.saat || '').split(/[–-]/)[0] || '').trim() || '08:00';
    const kapanis = s.kapanis || (String(s.saat || '').split(/[–-]/)[1] || '').trim() || '22:00';
    return {
      gunler: bilingual(s.gunler),
      saat: s.saat || `${acilis} – ${kapanis}`,
      acilis,
      kapanis,
      gunler_id: Array.isArray(s.gunler_id) ? s.gunler_id.map(Number) : [],
      vurgu: !!s.vurgu
    };
  });
}

function normalizeBoy(p) {
  if (Array.isArray(p.boy) && p.boy.length) {
    return p.boy.map((b, i) => {
      if (Array.isArray(b)) {
        return { id: slugify(b[0]) || `boy-${i}`, ad: bilingual(b[0]), fiyat: Number(b[1]) || 0 };
      }
      return {
        id: b.id || slugify(loc(b.ad) || `boy-${i}`),
        ad: bilingual(b.ad),
        fiyat: Number(b.fiyat) || 0
      };
    });
  }
  if (Array.isArray(p.porsiyon) && p.porsiyon.length) {
    return p.porsiyon.map((b, i) => {
      if (Array.isArray(b)) {
        return { id: slugify(b[0]) || `boy-${i}`, ad: bilingual(b[0]), fiyat: Number(b[1]) || 0 };
      }
      return { id: b.id || slugify(b.ad || `boy-${i}`), ad: bilingual(b.ad), fiyat: Number(b.fiyat) || 0 };
    });
  }
  return [{ id: 'standart', ad: bilingual('Standart', 'Standard'), fiyat: Number(p.fiyat) || 0 }];
}

function normalizeAlerjen(list) {
  if (!Array.isArray(list)) return [];
  return list.map((a) => {
    if (!a) return '';
    const key = String(a).trim().toLowerCase();
    return ALERJEN_ESKI[key] || slugify(a);
  }).filter(Boolean);
}

function normalizeProduct(p) {
  const boy = normalizeBoy(p);
  const fiyat = Number(p.fiyat != null ? p.fiyat : (boy[0] && boy[0].fiyat) || 0);
  return {
    id: p.id || slugify(p.ad),
    kat: p.kat || '',
    ad: bilingual(p.ad),
    kisa: bilingual(p.kisa),
    icindekiler: bilingual(p.icindekiler),
    fiyat,
    rozet: Array.isArray(p.rozet) ? [...p.rozet] : [],
    alerjen: normalizeAlerjen(p.alerjen),
    boy,
    ekstra: Array.isArray(p.ekstra) ? [...p.ekstra] : [],
    gorsel: p.gorsel || `./img/products/${p.id}.webp`,
    tukendi: !!p.tukendi,
    gizli: !!p.gizli,
    ornek_fiyat: !!p.ornek_fiyat
  };
}

function normalizeCategory(k) {
  return {
    id: k.id || slugify(k.ad),
    ad: bilingual(k.ad),
    aciklama: bilingual(k.aciklama),
    renk: k.renk || '#1A49AF',
    renk_degisken: k.renk_degisken || '',
    acik: k.acik || '',
    metin: k.metin || 'var(--renk-gece)',
    golge: k.golge || 'var(--golge-1)',
    temsili_urun: k.temsili_urun || '',
    sayi: Number(k.sayi) || 0
  };
}

function normalizeMenu(raw) {
  const d = raw && typeof raw === 'object' ? raw : {};
  const dukkan = d.dukkan || {};
  const menu = {
    _aciklama: d._aciklama || '',
    dukkan: {
      ad: bilingual(dukkan.ad, 'HALİS Pastane'),
      slogan: bilingual(dukkan.slogan),
      alt_slogan: bilingual(dukkan.alt_slogan),
      aciklama: bilingual(dukkan.aciklama),
      adres: dukkan.adres || '',
      telefon: dukkan.telefon || '',
      instagram: dukkan.instagram || '',
      whatsapp: dukkan.whatsapp || '',
      whatsapp_ornek: dukkan.whatsapp_ornek !== false && !String(dukkan.whatsapp || '').replace(/\D/g, ''),
      wifi: {
        ssid: (dukkan.wifi && dukkan.wifi.ssid) || '',
        sifre: (dukkan.wifi && dukkan.wifi.sifre) || ''
      },
      saatler: normalizeSaatler(dukkan.saatler),
      masa_sayisi: Number(dukkan.masa_sayisi) || 20,
      temsili_not: dukkan.temsili_not || ''
    },
    haftanin_secimi: d.haftanin_secimi || '',
    cok_satanlar: Array.isArray(d.cok_satanlar) ? [...d.cok_satanlar] : [],
    alerjenler: d.alerjenler && typeof d.alerjenler === 'object' ? d.alerjenler : {},
    ekstra_katalog: Array.isArray(d.ekstra_katalog)
      ? d.ekstra_katalog.map((e) => ({
          id: e.id || slugify(e.ad),
          ad: bilingual(e.ad),
          fiyat: Number(e.fiyat) || 0
        }))
      : [],
    kategoriler: (d.kategoriler || []).map(normalizeCategory),
    rozetler: {},
    urunler: (d.urunler || []).map(normalizeProduct)
  };
  const roz = d.rozetler || {};
  for (const [id, r] of Object.entries(roz)) {
    menu.rozetler[id] = {
      ad: bilingual(r.ad || id),
      zemin: r.zemin || 'var(--renk-fistik)',
      metin: r.metin || 'var(--renk-gece)'
    };
  }
  refreshCategoryCounts(menu);
  return menu;
}

function refreshCategoryCounts(menu) {
  const visible = (menu.urunler || []).filter((u) => !u.gizli);
  for (const k of menu.kategoriler || []) {
    k.sayi = visible.filter((u) => u.kat === k.id).length;
  }
}

export function serializeMenu(menu) {
  const m = menu || getMenu();
  refreshCategoryCounts(m);
  const out = {
    _aciklama: m._aciklama || '',
    dukkan: {
      ad: m.dukkan.ad,
      slogan: m.dukkan.slogan,
      alt_slogan: m.dukkan.alt_slogan,
      aciklama: m.dukkan.aciklama,
      adres: m.dukkan.adres,
      telefon: m.dukkan.telefon,
      instagram: m.dukkan.instagram,
      whatsapp: m.dukkan.whatsapp || '',
      whatsapp_ornek: !!m.dukkan.whatsapp_ornek,
      wifi: { ssid: m.dukkan.wifi.ssid, sifre: m.dukkan.wifi.sifre },
      saatler: (m.dukkan.saatler || []).map((s) => ({
        gunler: s.gunler,
        saat: s.saat || `${s.acilis} – ${s.kapanis}`,
        acilis: s.acilis,
        kapanis: s.kapanis,
        gunler_id: s.gunler_id,
        vurgu: !!s.vurgu
      })),
      masa_sayisi: m.dukkan.masa_sayisi || 20,
      temsili_not: m.dukkan.temsili_not || ''
    },
    haftanin_secimi: m.haftanin_secimi,
    cok_satanlar: m.cok_satanlar,
    alerjenler: m.alerjenler,
    ekstra_katalog: m.ekstra_katalog,
    kategoriler: (m.kategoriler || []).map((k) => ({
      id: k.id,
      ad: k.ad,
      renk: k.renk,
      renk_degisken: k.renk_degisken,
      acik: k.acik,
      metin: k.metin,
      golge: k.golge,
      aciklama: k.aciklama,
      temsili_urun: k.temsili_urun
    })),
    rozetler: m.rozetler,
    urunler: (m.urunler || []).map((p) => ({
      id: p.id,
      kat: p.kat,
      ad: p.ad,
      fiyat: p.fiyat,
      rozet: p.rozet,
      kisa: p.kisa,
      icindekiler: p.icindekiler,
      alerjen: p.alerjen,
      boy: p.boy,
      ekstra: p.ekstra,
      gorsel: p.gorsel,
      tukendi: !!p.tukendi,
      gizli: !!p.gizli,
      ornek_fiyat: !!p.ornek_fiyat
    }))
  };
  return out;
}

const BOS_MENU = normalizeMenu({
  dukkan: { ad: 'HALİS Pastane' },
  kategoriler: [],
  urunler: [],
  rozetler: {},
  alerjenler: {},
  ekstra_katalog: []
});

export async function loadMenuData({ fresh = false } = {}) {
  if (menuData && !fresh) return menuData;
  try {
    const res = await fetch(menuJsonUrl(), { cache: fresh ? 'no-store' : 'default' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    menuData = normalizeMenu(await res.json());
  } catch (err) {
    console.warn('menu.json yüklenemedi:', err);
    if (!menuData) menuData = BOS_MENU;
  }
  return menuData;
}

export function setMenuData(raw) {
  menuData = normalizeMenu(raw);
  return menuData;
}

export function getMenu() {
  return menuData || BOS_MENU;
}

export function getCategories() {
  return getMenu().kategoriler || [];
}

export function getCategory(id) {
  return getCategories().find((k) => k.id === id);
}

export function getProducts({ includeHidden = false } = {}) {
  const list = getMenu().urunler || [];
  return includeHidden ? list : list.filter((u) => !u.gizli);
}

export function getProduct(id, { includeHidden = true } = {}) {
  return (getMenu().urunler || []).find((u) => u.id === id && (includeHidden || !u.gizli));
}

export function getProductsByCategory(katId, opts) {
  const list = getProducts(opts);
  if (!katId || katId === 'hepsi') return list;
  return list.filter((u) => u.kat === katId);
}

export function getFeaturedProduct() {
  const m = getMenu();
  if (!m.haftanin_secimi) return null;
  return getProduct(m.haftanin_secimi, { includeHidden: false }) || null;
}

export function getBestSellers() {
  const m = getMenu();
  return (m.cok_satanlar || []).map((id) => getProduct(id, { includeHidden: false })).filter(Boolean);
}

export function getBadge(badgeKey) {
  const m = getMenu();
  const b = (m.rozetler || {})[badgeKey];
  if (!b) return { ad: bilingual(badgeKey), zemin: 'var(--renk-fistik)', metin: 'var(--renk-gece)' };
  return b;
}

export function getAllergenLabel(id) {
  const m = getMenu();
  const rec = (m.alerjenler || {})[id];
  if (rec) return loc(rec);
  return id;
}

export function getExtra(id) {
  const m = getMenu();
  return (m.ekstra_katalog || []).find((e) => e.id === id);
}

export function getProductExtras(product) {
  if (!product) return [];
  return (product.ekstra || []).map((idOrObj) => {
    if (idOrObj && typeof idOrObj === 'object') {
      return { id: idOrObj.id || slugify(idOrObj.ad), ad: bilingual(idOrObj.ad), fiyat: Number(idOrObj.fiyat) || 0 };
    }
    const found = getExtra(idOrObj);
    return found || { id: idOrObj, ad: bilingual(idOrObj), fiyat: 0 };
  });
}

export function getProductSizes(product) {
  if (!product) return [];
  return product.boy && product.boy.length
    ? product.boy
    : [{ id: 'standart', ad: bilingual('Standart', 'Standard'), fiyat: Number(product.fiyat) || 0 }];
}

export function computeItemPrice(product, boyId, ekstraIds = []) {
  const sizes = getProductSizes(product);
  const size = sizes.find((b) => b.id === boyId) || sizes[0];
  const base = size ? Number(size.fiyat) : Number(product.fiyat) || 0;
  const extras = getProductExtras(product);
  const extraSum = (ekstraIds || []).reduce((sum, id) => {
    const e = extras.find((x) => x.id === id);
    return sum + (e ? Number(e.fiyat) || 0 : 0);
  }, 0);
  return base + extraSum;
}

export function formatTL(amount) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);
}

export function getProductImage(id, _variant) {
  const p = (getMenu().urunler || []).find((u) => u.id === id);
  const path = (p && p.gorsel) || `./img/products/${id}.webp`;
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  return siteUrl(path);
}

export function getTableNumber() {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get('masa') || '').trim();
  if (!raw) return '';
  return raw.replace(/[^\dA-Za-zçğıöşüÇĞİÖŞÜ-]/g, '').slice(0, 8);
}

function parseHHMM(s) {
  const m = String(s || '').trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

export function istanbulNow() {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    day: map[parts.weekday] ?? 0,
    minutes: Number(parts.hour) * 60 + Number(parts.minute)
  };
}

export function getShopStatus() {
  const saatler = (getMenu().dukkan && getMenu().dukkan.saatler) || [];
  const now = istanbulNow();
  const row = saatler.find((s) => (s.gunler_id || []).includes(now.day));
  if (!row) {
    return { code: 'kapali', label: t('kapali'), minutesLeft: null };
  }
  const open = parseHHMM(row.acilis);
  let close = parseHHMM(row.kapanis);
  if (open == null || close == null) {
    return { code: 'kapali', label: t('kapali'), minutesLeft: null };
  }
  // 00:00 kapanış = gece yarısı (24:00)
  if (close === 0 && open > 0) close = 24 * 60;
  if (now.minutes < open || now.minutes >= close) {
    return { code: 'kapali', label: t('kapali'), minutesLeft: null };
  }
  const left = close - now.minutes;
  if (left <= 30) {
    return { code: 'yakinda_kapaniyor', label: t('yakinda'), minutesLeft: left };
  }
  return { code: 'acik', label: t('acik'), minutesLeft: left };
}

export function getGreeting() {
  const { minutes } = istanbulNow();
  const hour = Math.floor(minutes / 60);
  if (hour >= 5 && hour < 12) return t('gunaydin');
  if (hour >= 12 && hour < 18) return t('iyi_gunler');
  return t('iyi_aksamlar');
}

export function instagramUrl(handle) {
  const h = String(handle || '').replace(/^@/, '').trim();
  return h ? `https://instagram.com/${encodeURIComponent(h)}` : 'https://instagram.com';
}

export function mapsUrl(adres) {
  return `https://maps.google.com/?q=${encodeURIComponent(adres || '')}`;
}

export function whatsappNumber() {
  const d = getMenu().dukkan || {};
  const digits = String(d.whatsapp || '').replace(/\D/g, '');
  if (!digits || d.whatsapp_ornek) return '';
  return digits;
}

export function buildCakeWhatsAppMessage({ ad, telefon, tur, kisilik, tarih, not }) {
  const dukkan = loc((getMenu().dukkan || {}).ad) || 'HALİS Pastane';
  const masa = getTableNumber();
  const lines = getLang() === 'en'
    ? [
        `Hello, I would like a custom cake from ${dukkan}.`,
        ad ? `Name: ${ad}` : '',
        telefon ? `Phone: ${telefon}` : '',
        tur ? `Cake type: ${tur}` : '',
        kisilik ? `Servings: ${kisilik}` : '',
        tarih ? `Date: ${tarih}` : '',
        not ? `Note: ${not}` : '',
        masa ? `Table: ${masa}` : ''
      ]
    : [
        `Merhaba, ${dukkan} için özel pasta talebim var.`,
        ad ? `Ad: ${ad}` : '',
        telefon ? `Telefon: ${telefon}` : '',
        tur ? `Pasta türü: ${tur}` : '',
        kisilik ? `Kaç kişilik: ${kisilik}` : '',
        tarih ? `Tarih: ${tarih}` : '',
        not ? `Not: ${not}` : '',
        masa ? `Masa: ${masa}` : ''
      ];
  return lines.filter(Boolean).join('\n');
}

export function whatsappLink(message) {
  const num = whatsappNumber();
  const text = encodeURIComponent(message || '');
  return num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function applyCategoryPriceRaise(menu, katId, percent) {
  const factor = 1 + Number(percent) / 100;
  const round = (n) => Math.max(0, Math.round(Number(n) * factor));
  for (const p of menu.urunler || []) {
    if (katId && p.kat !== katId) continue;
    p.fiyat = round(p.fiyat);
    p.boy = (p.boy || []).map((b) => ({ ...b, fiyat: round(b.fiyat) }));
  }
  return menu;
}

/* ——— Admin kimlik bilgileri (asla koda gömülmez; yalnızca bu tarayıcıda) ——— */

export function getAdminToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || '';
  } catch (_) {
    return '';
  }
}

export function setAdminToken(token, remember = false) {
  const value = String(token || '').trim();
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    if (!value) {
      localStorage.removeItem(REMEMBER_KEY);
      return;
    }
    if (remember) {
      localStorage.setItem(TOKEN_KEY, value);
      localStorage.setItem(REMEMBER_KEY, '1');
    } else {
      sessionStorage.setItem(TOKEN_KEY, value);
      localStorage.removeItem(REMEMBER_KEY);
    }
  } catch (_) { /* ignore */ }
}

export function clearAdminSession({ keepPin = true } = {}) {
  setAdminToken('');
  if (!keepPin) {
    try { localStorage.removeItem(PIN_KEY); } catch (_) { /* ignore */ }
  }
}

export function hasRememberedToken() {
  try { return localStorage.getItem(REMEMBER_KEY) === '1' && !!localStorage.getItem(TOKEN_KEY); }
  catch (_) { return false; }
}

export function hasPin() {
  try { return !!localStorage.getItem(PIN_KEY); } catch (_) { return false; }
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function setAdminPin(pin) {
  const clean = String(pin || '').trim();
  if (!clean) {
    try { localStorage.removeItem(PIN_KEY); } catch (_) { /* ignore */ }
    return;
  }
  const salt = crypto.getRandomValues(new Uint8Array(8));
  const saltHex = [...salt].map((b) => b.toString(16).padStart(2, '0')).join('');
  const hash = await sha256Hex(`${saltHex}:${clean}`);
  try { localStorage.setItem(PIN_KEY, `${saltHex}$${hash}`); } catch (_) { /* ignore */ }
}

export async function verifyAdminPin(pin) {
  let stored = '';
  try { stored = localStorage.getItem(PIN_KEY) || ''; } catch (_) { stored = ''; }
  if (!stored) return true;
  const [saltHex, hash] = stored.split('$');
  if (!saltHex || !hash) return false;
  const check = await sha256Hex(`${saltHex}:${String(pin || '').trim()}`);
  return check === hash;
}

/* ——— GitHub Contents / Git Data API yazma ——— */

async function githubRequest(token, method, path, body) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (_) { json = { message: text }; }
  if (!res.ok) {
    const msg = (json && json.message) || `GitHub ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return json;
}

export async function verifyAdminToken(token) {
  const { owner, repo } = DATA_BACKEND;
  const tkn = token || getAdminToken();
  if (!tkn) throw new Error('Token yok');
  const data = await githubRequest(tkn, 'GET', `/repos/${owner}/${repo}`);
  return { name: data.full_name, private: data.private };
}

/**
 * menu.json ve isteğe bağlı dosyaları (görseller) tek commit ile kaydeder.
 * files: [{ path, contentBase64, encoding?: 'base64' }] veya { path, text }
 */
export async function saveMenuAndFiles(menu, files = [], message = 'Menü güncellemesi (admin panel)') {
  const token = getAdminToken();
  if (!token) throw new Error('GitHub jetonu yok. Lütfen yeniden giriş yap.');
  const { owner, repo, branch, menuPath } = DATA_BACKEND;
  const payload = serializeMenu(menu);
  const jsonText = `${JSON.stringify(payload, null, 2)}\n`;

  const ref = await githubRequest(token, 'GET', `/repos/${owner}/${repo}/git/ref/heads/${branch}`);
  const commitSha = ref.object.sha;
  const commit = await githubRequest(token, 'GET', `/repos/${owner}/${repo}/git/commits/${commitSha}`);
  const baseTree = commit.tree.sha;

  const treeItems = [];

  const menuBlob = await githubRequest(token, 'POST', `/repos/${owner}/${repo}/git/blobs`, {
    content: jsonText,
    encoding: 'utf-8'
  });
  treeItems.push({ path: menuPath, mode: '100644', type: 'blob', sha: menuBlob.sha });

  for (const f of files || []) {
    const encoding = f.encoding || (f.text != null ? 'utf-8' : 'base64');
    const content = f.text != null ? f.text : f.contentBase64;
    if (!f.path || content == null) continue;
    const blob = await githubRequest(token, 'POST', `/repos/${owner}/${repo}/git/blobs`, { content, encoding });
    treeItems.push({ path: f.path.replace(/^\.\//, ''), mode: '100644', type: 'blob', sha: blob.sha });
  }

  const tree = await githubRequest(token, 'POST', `/repos/${owner}/${repo}/git/trees`, {
    base_tree: baseTree,
    tree: treeItems
  });
  const newCommit = await githubRequest(token, 'POST', `/repos/${owner}/${repo}/git/commits`, {
    message,
    tree: tree.sha,
    parents: [commitSha]
  });
  await githubRequest(token, 'PATCH', `/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    sha: newCommit.sha
  });

  menuData = normalizeMenu(payload);
  return { sha: newCommit.sha, url: newCommit.html_url };
}

export async function imageFileToWebp(file, { maxSize = 1200, quality = 0.82 } = {}) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, w, h);
  const mime = (canvas.toDataURL('image/webp').startsWith('data:image/webp')) ? 'image/webp' : 'image/jpeg';
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
  if (!blob) throw new Error('Görsel dönüştürülemedi');
  const base64 = await blobToBase64(blob);
  const ext = mime === 'image/webp' ? 'webp' : 'jpg';
  return { blob, base64, mime, ext, width: w, height: h };
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result || '');
      const i = s.indexOf(',');
      resolve(i >= 0 ? s.slice(i + 1) : s);
    };
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

export function productImagePath(id, ext = 'webp') {
  return `${DATA_BACKEND.imageDir}/${id}.${ext}`;
}
