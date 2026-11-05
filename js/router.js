/**
 * HALİS QR Web Menü — İstemci Taraflı Yönlendirici (Router)
 * Hash tabanlı yönlendirme (#/, #/kategori/:id, #/urun/:id, #/arama, #/bilgi, #/listem) ve geçmiş yönetimi.
 */

import { renderHomeView } from './views/home.js';
import { renderCategoryView } from './views/category.js';
import { renderDetailView } from './views/detail.js';
import { renderSplashScreen } from './views/splash.js';
import { renderSearchView } from './views/search.js';
import { renderAboutView } from './views/about.js';
import { renderListemView } from './views/listem.js';
import { transitionCardToDetail } from './transitions.js';
import { sound } from './audio.js';

class Router {
  constructor(appRootId = 'app-root') {
    this.root = document.getElementById(appRootId);
    this.currentRoute = null;
    this.historyStack = [];
    this.lastCardElement = null;

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('popstate', () => this.handleRoute());
  }

  init() {
    const hash = window.location.hash || '#/';
    const urlParams = new URLSearchParams(window.location.search);
    const skipSplash = urlParams.get('splash') === '0';
    
    // İlk ziyarette splash ekranı göster (yalnızca ana sayfada)
    const splashShown = sessionStorage.getItem('halis-splash-shown');
    if (!splashShown && (hash === '#/' || hash === '') && !skipSplash) {
      renderSplashScreen(this.root, () => {
        this.handleRoute();
      });
    } else {
      this.handleRoute();
    }
  }

  navigate(hash, sourceCardEl = null) {
    if (sourceCardEl) {
      this.lastCardElement = sourceCardEl;
    }
    window.location.hash = hash;
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigate('#/');
    }
  }

  handleRoute() {
    const rawHash = window.location.hash || '#/';
    const hash = rawHash.replace(/^#\/?/, '');
    const parts = hash.split('/').filter(Boolean);

    const section = parts[0] || '';
    const param = parts[1] || '';

    // Sayfa değiştirirken scroll'u sıfırla (detay harici)
    if (section !== 'urun') {
      window.scrollTo(0, 0);
    }

    if (section === 'splash') {
      renderSplashScreen(this.root, () => {
        this.navigate('#/');
      }, true);
      return;
    }

    if (section === 'arama') {
      renderSearchView(this.root, {
        onNavigateProduct: (urunId, cardEl) => {
          this.navigate(`#/urun/${urunId}`, cardEl);
        },
        onNavigateHome: () => {
          this.navigate('#/');
        }
      });
      return;
    }

    if (section === 'bilgi' || section === 'hakkimizda') {
      renderAboutView(this.root, {
        onNavigateHome: () => {
          this.navigate('#/');
        }
      });
      return;
    }

    if (section === 'listem' || section === 'liste') {
      renderListemView(this.root, {
        onNavigateHome: () => {
          this.navigate('#/');
        },
        onNavigateProduct: (urunId) => {
          this.navigate(`#/urun/${urunId}`);
        }
      });
      return;
    }

    if (section === 'kategori') {
      const katId = param || 'tatlilar';
      renderCategoryView(this.root, katId, {
        onNavigateProduct: (urunId, cardEl) => {
          this.navigate(`#/urun/${urunId}`, cardEl);
        },
        onNavigateHome: () => {
          this.navigate('#/');
        },
        onCategoryChange: (newKatId) => {
          this.navigate(`#/kategori/${newKatId}`);
        }
      });
      return;
    }

    if (section === 'urun') {
      const urunId = param || 'baklava';
      const cardEl = this.lastCardElement;
      this.lastCardElement = null;

      const renderFn = () => {
        renderDetailView(this.root, urunId, {
          onNavigateBack: () => {
            this.goBack();
          },
          onSwitchProduct: (newUrunId, direction) => {
            this.navigate(`#/urun/${newUrunId}`);
          }
        });
      };

      if (cardEl) {
        transitionCardToDetail(cardEl, renderFn);
      } else {
        renderFn();
      }
      return;
    }

    // Ana sayfa (Varsayılan)
    renderHomeView(this.root, {
      onNavigateProduct: (urunId, cardEl) => {
        this.navigate(`#/urun/${urunId}`, cardEl);
      },
      onNavigateCategory: (katId) => {
        this.navigate(`#/kategori/${katId}`);
      }
    });
  }
}

export const router = new Router();
