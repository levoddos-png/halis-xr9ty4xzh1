/**
 * HALİS QR Web Menü — Veri Modülü
 * menu.json verisini yükler ve sorgulama yardımcıları sağlar.
 */

let menuData = null;

// Gömülü yedek veri (fetch başarısız olursa veya file:// protokolünde)
const YEDEK_VERI = {
  dukkan: {
    ad: "HALİS Pastane",
    slogan: "Taze, tatlı, sıcak — her gün",
    alt_slogan: "Mahallenin tatlı köşesi",
    aciklama: "Sabah simidinden akşam dondurmasına, her şeyi kendi fırınımızda, her gün taze hazırlıyoruz.",
    adres: "Örnek Mah. Lezzet Sok. No: 7 Kadıköy / İstanbul",
    telefon: "0 (216) 000 00 00",
    instagram: "@halispastane",
    wifi: { ssid: "HALIS-Misafir", sifre: "tatli2026" },
    saatler: [
      { gunler: "Pazartesi – Cuma", saat: "07:00 – 22:00", vurgu: false },
      { gunler: "Cumartesi", saat: "08:00 – 23:00", vurgu: true },
      { gunler: "Pazar", saat: "08:00 – 22:00", vurgu: false }
    ],
    temsili_not: "Görseller, adres, telefon ve Wi-Fi bilgileri temsilîdir (Örnek Veri)."
  },
  haftanin_secimi: "baklava",
  cok_satanlar: ["maras-dondurmasi", "simit", "profiterol"],
  kategoriler: [
    { id: "tatlilar", ad: "Tatlılar", renk: "#E3792F", renk_degisken: "var(--kat-tatli)", acik: "var(--kat-tatli-acik)", metin: "var(--kat-tatli-metin)", golge: "var(--golge-tatli)", aciklama: "Şerbetli, sütlü, çikolatalı", sayi: 5, temsili_urun: "trilece" },
    { id: "dondurmalar", ad: "Dondurmalar", renk: "#00A3FF", renk_degisken: "var(--kat-dondurma)", acik: "var(--kat-dondurma-acik)", metin: "var(--kat-dondurma-metin)", golge: "var(--golge-dondurma)", aciklama: "Maraş usulü & sorbeler", sayi: 5, temsili_urun: "kulah-dondurma" },
    { id: "unlu", ad: "Unlu Mamüller", renk: "#FFD850", renk_degisken: "var(--kat-unlu)", acik: "var(--kat-unlu-acik)", metin: "var(--kat-unlu-metin)", golge: "var(--golge-unlu)", aciklama: "Her sabah taze fırından", sayi: 5, temsili_urun: "simit" }
  ],
  rozetler: {
    "yeni": { ad: "Yeni", zemin: "var(--renk-limon)", metin: "var(--renk-gece)" },
    "cok-satan": { ad: "Çok Satan", zemin: "var(--renk-mandalina)", metin: "var(--renk-gece)" },
    "vegan": { ad: "Vegan", zemin: "var(--renk-yesil-100)", metin: "var(--renk-retro-yesil)" },
    "glutensiz": { ad: "Glutensiz", zemin: "var(--renk-plazma-100)", metin: "var(--renk-lacivert)" }
  },
  urunler: [
    { id: "baklava", kat: "tatlilar", ad: "Fıstıklı Baklava", fiyat: 320, rozet: ["cok-satan"], kisa: "Kırk kat yufka, bol Antep fıstığı, hafif şerbet.", icindekiler: "Un, tereyağı, Antep fıstığı, şeker, su, limon tuzu.", alerjen: ["Gluten", "Süt", "Kabuklu yemiş"], porsiyon: [["4 dilim", 320], ["8 dilim", 620], ["1 kg", 1450]] },
    { id: "sutlac", kat: "tatlilar", ad: "Fırın Sütlaç", fiyat: 140, rozet: ["glutensiz"], kisa: "Toprak kapta, üstü közlenmiş, tarçın serpme.", icindekiler: "Süt, pirinç, şeker, pirinç unu, tarçın.", alerjen: ["Süt"], porsiyon: [["Kase", 140]] },
    { id: "profiterol", kat: "tatlilar", ad: "Profiterol", fiyat: 165, rozet: [], kisa: "Kremalı top toplar, bol akışkan bitter çikolata.", icindekiler: "Un, yumurta, tereyağı, süt, krema, bitter çikolata.", alerjen: ["Gluten", "Süt", "Yumurta", "Soya"], porsiyon: [["Kase", 165]] },
    { id: "kazandibi", kat: "tatlilar", ad: "Kazandibi", fiyat: 135, rozet: [], kisa: "Dibi tatlı tatlı yakılmış, ipeksi muhallebi.", icindekiler: "Süt, şeker, pirinç unu, nişasta, tarçın.", alerjen: ["Süt"], porsiyon: [["Dilim", 135]] },
    { id: "trilece", kat: "tatlilar", ad: "Trileçe", fiyat: 150, rozet: ["yeni"], kisa: "Üç sütle ıslanmış pandispanya, karamel tepesi.", icindekiler: "Un, yumurta, süt, krema, şeker, karamel.", alerjen: ["Gluten", "Süt", "Yumurta"], porsiyon: [["Dilim", 150]] },
    { id: "maras-dondurmasi", kat: "dondurmalar", ad: "Maraş Dondurması", fiyat: 120, rozet: ["cok-satan"], kisa: "Sakızlı, salepli, dövülerek uzayan klasik.", icindekiler: "Keçi sütü, şeker, salep, damla sakızı, Antep fıstığı.", alerjen: ["Süt", "Kabuklu yemiş"], porsiyon: [["150 g", 120], ["250 g", 190]] },
    { id: "kulah-dondurma", kat: "dondurmalar", ad: "Külahta 3 Top", fiyat: 110, rozet: [], kisa: "Çikolata, çilek, vanilya — çıtır külahta.", icindekiler: "Süt, şeker, krema, kakao, çilek, vanilya, külah (un).", alerjen: ["Gluten", "Süt"], porsiyon: [["2 top", 80], ["3 top", 110], ["4 top", 140]] },
    { id: "fistikli-dondurma", kat: "dondurmalar", ad: "Fıstıklı Dondurma", fiyat: 130, rozet: [], kisa: "Gerçek Antep fıstığı ezmesi, çıtır parçalar.", icindekiler: "Süt, şeker, Antep fıstığı ezmesi, salep.", alerjen: ["Süt", "Kabuklu yemiş"], porsiyon: [["2 top", 130], ["3 top", 180]] },
    { id: "limon-sorbe", kat: "dondurmalar", ad: "Limonlu Sorbe", fiyat: 95, rozet: ["vegan", "glutensiz"], kisa: "Taze sıkım limon, nane yaprağı, buz gibi.", icindekiler: "Su, şeker, taze limon suyu, limon kabuğu, nane.", alerjen: [], porsiyon: [["2 top", 95], ["3 top", 135]] },
    { id: "cikolatali-dondurma", kat: "dondurmalar", ad: "Bitter Çikolatalı", fiyat: 105, rozet: [], kisa: "%70 kakao, rendelenmiş çikolata yağmuru.", icindekiler: "Süt, şeker, kakao, bitter çikolata, krema.", alerjen: ["Süt", "Soya"], porsiyon: [["2 top", 105], ["3 top", 150]] },
    { id: "simit", kat: "unlu", ad: "Susamlı Simit", fiyat: 25, rozet: ["cok-satan"], kisa: "Pekmeze batırılmış, bol susamlı, çıtır.", icindekiler: "Un, su, maya, tuz, üzüm pekmezi, susam.", alerjen: ["Gluten", "Susam"], porsiyon: [["Adet", 25]] },
    { id: "peynirli-pogaca", kat: "unlu", ad: "Peynirli Poğaça", fiyat: 35, rozet: [], kisa: "Yumuşacık hamur, beyaz peynir, çörek otu.", icindekiler: "Un, süt, yoğurt, tereyağı, beyaz peynir, maydanoz, yumurta, çörek otu.", alerjen: ["Gluten", "Süt", "Yumurta"], porsiyon: [["Adet", 35], ["3 adet", 95]] },
    { id: "acma", kat: "unlu", ad: "Sade Açma", fiyat: 30, rozet: [], kisa: "Tereyağlı, pamuk gibi, parlak yumurtalı.", icindekiler: "Un, süt, tereyağı, şeker, maya, yumurta.", alerjen: ["Gluten", "Süt", "Yumurta"], porsiyon: [["Adet", 30]] },
    { id: "kurabiye", kat: "unlu", ad: "Karışık Kurabiye", fiyat: 180, rozet: [], kisa: "Reçelli ve çikolatalı un kurabiyeleri.", icindekiler: "Un, tereyağı, pudra şekeri, vişne reçeli, bitter çikolata.", alerjen: ["Gluten", "Süt", "Soya"], porsiyon: [["250 g", 180], ["500 g", 340]] },
    { id: "tahinli-corek", kat: "unlu", ad: "Tahinli Çörek", fiyat: 55, rozet: ["yeni", "vegan"], kisa: "Kat kat burgu, bol tahin, susam tepesi.", icindekiler: "Un, su, tahin, şeker, ayçiçek yağı, maya, susam.", alerjen: ["Gluten", "Susam"], porsiyon: [["Adet", 55]] }
  ]
};

export async function loadMenuData() {
  if (menuData) return menuData;
  try {
    const res = await fetch('./data/menu.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    menuData = await res.json();
  } catch (err) {
    console.warn('menu.json doğrudan fetch edilemedi, gömülü yedek veri kullanılıyor:', err);
    menuData = YEDEK_VERI;
  }
  return menuData;
}

export function getMenu() {
  return menuData || YEDEK_VERI;
}

export function getCategories() {
  return (menuData || YEDEK_VERI).kategoriler;
}

export function getCategory(id) {
  return getCategories().find(k => k.id === id);
}

export function getProducts() {
  return (menuData || YEDEK_VERI).urunler;
}

export function getProduct(id) {
  return getProducts().find(u => u.id === id);
}

export function getProductsByCategory(katId) {
  if (!katId || katId === 'hepsi') return getProducts();
  return getProducts().filter(u => u.kat === katId);
}

export function getFeaturedProduct() {
  const m = getMenu();
  return getProduct(m.haftanin_secimi) || getProducts()[0];
}

export function getBestSellers() {
  const m = getMenu();
  return m.cok_satanlar.map(id => getProduct(id)).filter(Boolean);
}

export function getBadge(badgeKey) {
  const m = getMenu();
  return m.rozetler[badgeKey] || { ad: badgeKey, zemin: 'var(--renk-fistik)', metin: 'var(--renk-gece)' };
}

export function formatTL(amount) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getProductImage(id, variant = '@600.webp') {
  return `./assets/urunler/1x1/${id}${variant}`;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Günaydın!';
  if (hour >= 12 && hour < 18) return 'İyi günler!';
  return 'İyi akşamlar!';
}
