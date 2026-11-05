/**
 * HALİS QR Web Menü — İkon ve Retro Dekor Kütüphanesi
 */

export const ICONS = {
  ara: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  sesAcik: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18.3 6.4a8 8 0 0 1 0 11.2"/>',
  sesKapali: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  geri: '<path d="M15 5l-7 7 7 7"/>',
  ileri: '<path d="M9 5l7 7-7 7"/>',
  kalp: '<path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  arti: '<path d="M12 5v14M5 12h14"/>',
  eksi: '<path d="M5 12h14"/>',
  menu: '<path d="M4 10.5L12 4l8 6.5V20h-5.5v-5.5h-5V20H4z"/>',
  liste: '<rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 9h6M9 13h6M9 17h3"/>',
  bilgi: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.2"/>',
  saat: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  konum: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  telefon: '<path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3A2.5 2.5 0 0 1 17.3 20 15 15 0 0 1 4 6.7 2.5 2.5 0 0 1 6.5 4z"/>',
  kapat: '<path d="M6 6l12 12M18 6L6 18"/>',
  wifi: '<path d="M4 9.5a12 12 0 0 1 16 0M7 12.8a7.5 7.5 0 0 1 10 0M10 16a3 3 0 0 1 4 0"/><path d="M12 19.2v.1"/>',
  insta: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.8"/><path d="M16.8 7.2v.1"/>',
  garson: '<path d="M4 18h16M5.5 18a6.5 6.5 0 0 1 13 0M12 9.5V8M10.5 8h3"/>',
  yildiz: '<path d="M12 4l2.4 5 5.4.7-4 3.7 1 5.4L12 16.3 7.2 18.8l1-5.4-4-3.7 5.4-.7z"/>',
  ay: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
  gunes: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  cop: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
  onay: '<path d="M20 6L9 17l-5-5"/>',
  kopyala: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  temizle: '<path d="M19 11l-8-8-8.5 8.5a2.12 2.12 0 0 0 0 3L6 18h12"/><path d="M18 18h4"/>',
  filtre: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'
};

export function ik(name, extraClass = '') {
  const path = ICONS[name] || '';
  return `<svg class="ikon ${extraClass}" viewBox="0 0 24 24">${path}</svg>`;
}

// Retro dekoratif şekiller
export const DEKO = {
  daire: (r, renk) => `<svg width="${r * 2}" height="${r * 2}" viewBox="0 0 ${r * 2} ${r * 2}"><circle cx="${r}" cy="${r}" r="${r}" fill="${renk}"/></svg>`,
  halka: (r, renk, k = 6) => `<svg width="${r * 2}" height="${r * 2}" viewBox="0 0 ${r * 2} ${r * 2}"><circle cx="${r}" cy="${r}" r="${r - k / 2}" fill="none" stroke="${renk}" stroke-width="${k}"/></svg>`,
  yarim: (r, renk) => `<svg width="${r * 2}" height="${r}" viewBox="0 0 ${r * 2} ${r}"><path d="M0 ${r}a${r} ${r} 0 0 1 ${r * 2} 0z" fill="${renk}"/></svg>`,
  dalga: (w, renk, k = 6) => {
    let d = `M${k} ${k * 2}`;
    const n = Math.floor((w - k * 2) / (k * 3));
    for (let i = 0; i < n; i++) d += ` q${k * 1.5} ${i % 2 ? k * 2 : -k * 2} ${k * 3} 0`;
    return `<svg width="${w}" height="${k * 4}" viewBox="0 0 ${w} ${k * 4}"><path d="${d}" fill="none" stroke="${renk}" stroke-width="${k}" stroke-linecap="round"/></svg>`;
  },
  serpinti: (renk, a = 0) => `<svg width="22" height="22" viewBox="0 0 22 22" style="transform:rotate(${a}deg)"><rect x="8" y="1" width="6" height="20" rx="3" fill="${renk}"/></svg>`,
  yildiz: (s, renk) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" fill="${renk}"/></svg>`
};

export function dekoEl(x, y, svgHtml, extraCss = '') {
  return `<div class="deko" style="left:${x}px;top:${y}px;${extraCss}">${svgHtml}</div>`;
}
