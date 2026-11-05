/**
 * HALİS QR Web Menü — Listem (Garson Listesi) Yönetim Modülü
 * localStorage üzerinde kalıcı liste, adet yönetimi ve altbar rozet senkronizasyonu.
 * Sipariş veya ödeme yoktur; yalnızca garsona göstermek amaçlıdır.
 */

const STORAGE_KEY = 'halis-listem';

class CartStore {
  constructor() {
    this.items = this.loadFromStorage();
    this.listeners = new Set();
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('localStorage okunamadı, boş liste başlatılıyor:', e);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('localStorage yazılamadı:', e);
    }
    this.notify();
  }

  notify() {
    const count = this.getTotalCount();
    const total = this.getTotalPrice();
    const items = [...this.items];
    this.listeners.forEach(fn => {
      try {
        fn({ items, count, total });
      } catch (e) {
        console.error('Cart listener error:', e);
      }
    });

    // Altbar üzerindeki tüm sepet rozetlerini güncelle
    this.updateBadges(count);
  }

  updateBadges(count) {
    const badges = document.querySelectorAll('.altbar [data-nav="liste"] .sepet-sayi, [data-badge="liste-sayi"]');
    badges.forEach(b => {
      if (count > 0) {
        b.textContent = count;
        b.style.display = 'grid';
      } else {
        b.style.display = 'none';
      }
    });

    // Eğer altbarda henüz rozet yoksa ve count > 0 ise ekle
    if (count > 0) {
      const listButtons = document.querySelectorAll('.altbar [data-nav="liste"]');
      listButtons.forEach(btn => {
        if (!btn.querySelector('.sepet-sayi')) {
          const span = document.createElement('span');
          span.className = 'sepet-sayi';
          span.textContent = count;
          btn.appendChild(span);
        }
      });
    }
  }

  onChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getItems() {
    return [...this.items];
  }

  getItem(key) {
    return this.items.find(i => i.key === key);
  }

  /**
   * Listeye ürün ekler veya varsa adedini artırır
   */
  addItem({ productId, ad, portionIndex = 0, portionName = '', unitPrice = 0, quantity = 1, image = '' }) {
    const key = `${productId}_${portionIndex}`;
    const existingIndex = this.items.findIndex(i => i.key === key);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        key,
        productId,
        ad,
        portionIndex,
        portionName: portionName || 'Porsiyon',
        unitPrice: Number(unitPrice),
        quantity: Math.max(1, quantity),
        image
      });
    }

    this.saveToStorage();
    return this.getItem(key);
  }

  /**
   * Ürün adedini günceller (delta: +1 veya -1 ya da doğrudan yeni miktar)
   */
  updateQuantity(key, newQty) {
    const index = this.items.findIndex(i => i.key === key);
    if (index === -1) return;

    if (newQty <= 0) {
      this.items.splice(index, 1);
    } else {
      this.items[index].quantity = newQty;
    }

    this.saveToStorage();
  }

  changeQuantity(key, delta) {
    const item = this.getItem(key);
    if (!item) return;
    this.updateQuantity(key, item.quantity + delta);
  }

  /**
   * Ürünü listeden tamamen siler
   */
  removeItem(key) {
    this.items = this.items.filter(i => i.key !== key);
    this.saveToStorage();
  }

  /**
   * Tüm listeyi temizler
   */
  clearList() {
    this.items = [];
    this.saveToStorage();
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  getTotalPrice() {
    return this.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }
}

export const cart = new CartStore();
