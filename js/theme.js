/**
 * HALİS QR Web Menü — Tema Motoru (Açık / Koyu Tema)
 * data-tema="koyu" tokenları, prefers-color-scheme varsayılanı ve elle değiştirme.
 * Tercih localStorage üzerinde 'halis-tema' anahtarında saklanır.
 */

const STORAGE_KEY = 'halis-tema';

class ThemeEngine {
  constructor() {
    this.listeners = new Set();
    this.currentTheme = this.resolveInitialTheme();
    this.applyTheme(this.currentTheme);
    this.setupSystemListener();
  }

  resolveInitialTheme() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const temaParam = urlParams.get('tema');
      if (temaParam === 'koyu' || temaParam === 'acik') {
        return temaParam;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'koyu' || stored === 'acik') {
        return stored;
      }
    } catch (e) {}

    // Sistem tercihi kontrolü
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'koyu';
    }
    return 'acik';
  }

  setupSystemListener() {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Eğer kullanıcı elle bir seçim yapmamışsa sistem temasını uygula
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.setTheme(e.matches ? 'koyu' : 'acik', false);
      }
    });
  }

  applyTheme(theme) {
    const isDark = theme === 'koyu';
    if (isDark) {
      document.documentElement.setAttribute('data-tema', 'koyu');
    } else {
      document.documentElement.removeAttribute('data-tema');
    }

    // Meta theme-color rengini güncelle
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute('content', isDark ? '#0F1B3D' : '#1A49AF');

    // Sayfadaki logoları güncelle (acik <-> koyu SVG)
    this.updateLogos(isDark);

    // Dinleyicileri bilgilendir
    this.listeners.forEach(fn => {
      try {
        fn(theme);
      } catch (e) {
        console.error('Theme listener error:', e);
      }
    });
  }

  updateLogos(isDark) {
    const logos = document.querySelectorAll('img.logo');
    logos.forEach(logo => {
      const currentSrc = logo.getAttribute('src') || '';
      if (isDark && currentSrc.includes('-acik.svg')) {
        logo.src = currentSrc.replace('-acik.svg', '-koyu.svg');
      } else if (!isDark && currentSrc.includes('-koyu.svg')) {
        logo.src = currentSrc.replace('-koyu.svg', '-acik.svg');
      }
    });
  }

  setTheme(theme, save = true) {
    this.currentTheme = theme;
    if (save) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {}
    }
    this.applyTheme(theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'koyu' ? 'acik' : 'koyu';
    this.setTheme(newTheme, true);
    return newTheme;
  }

  isDark() {
    return this.currentTheme === 'koyu';
  }

  onChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

export const theme = new ThemeEngine();
