/**
 * HALİS QR Web Menü — Animasyon ve Geçiş Motoru
 * View Transitions API + FLIP yedeği, yay (spring) zamanlamaları ve 60fps akış.
 */

export const EASING = {
  cikis: 'cubic-bezier(0.22, 1, 0.36, 1)',
  vurgulu: 'cubic-bezier(0.2, 0, 0, 1)',
  kapanis: 'cubic-bezier(0.4, 0, 0.2, 1)',
  giris: 'cubic-bezier(0.4, 0, 1, 1)',
  yayYumusak: 'cubic-bezier(0.175, 0.885, 0.32, 1.1)',
  yayZipla: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  yayPanel: 'cubic-bezier(0.16, 1, 0.3, 1)'
};

export const DURATION = {
  anlik: 90,
  hizli: 160,
  kisa: 220,
  orta: 350,
  uzun: 420,
  yayYumusak: 453,
  yayZipla: 492,
  yayPanel: 510
};

export function isReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Buton basma animasyonu: scale 0.95, 90ms -> bırakınca yay zıpla ile 1
 */
export function animateButtonPress(el, onComplete) {
  if (!el || isReducedMotion()) {
    if (onComplete) onComplete();
    return;
  }
  
  const press = el.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(0.95)' }],
    { duration: DURATION.anlik, easing: EASING.cikis, fill: 'forwards' }
  );

  press.onfinish = () => {
    const release = el.animate(
      [{ transform: 'scale(0.95)' }, { transform: 'scale(1)' }],
      { duration: DURATION.yayZipla, easing: EASING.yayZipla, fill: 'forwards' }
    );
    if (onComplete) {
      release.onfinish = onComplete;
    }
  };
}

/**
 * Listeler için kademeli (staggered) giriş animasyonu
 */
export function animateStaggeredEntrance(container, selector = '.kart, .satir, .liste-oge') {
  if (isReducedMotion()) return;
  const items = container.querySelectorAll(selector);
  const maxItems = Math.min(items.length, 8);

  for (let i = 0; i < maxItems; i++) {
    const item = items[i];
    const delay = i * 45; // 45 ms kademe
    
    item.animate([
      { opacity: 0, transform: 'translateY(24px) scale(0.96)' },
      { opacity: 1, transform: 'none' }
    ], {
      duration: DURATION.yayYumusak,
      easing: EASING.yayYumusak,
      delay: delay,
      fill: 'both'
    });
  }

  // 8'den sonrakiler anında görünür
  for (let i = maxItems; i < items.length; i++) {
    items[i].style.opacity = '1';
    items[i].style.transform = 'none';
  }
}

/**
 * Kart -> Detay Shared-Element Geçişi (View Transitions API veya FLIP yedeği)
 */
export async function transitionCardToDetail(sourceCardEl, showDetailCallback) {
  if (isReducedMotion()) {
    showDetailCallback();
    return;
  }

  // View Transitions API destekleniyorsa
  if (document.startViewTransition) {
    if (sourceCardEl) {
      sourceCardEl.style.viewTransitionName = 'urun-zemin';
      const img = sourceCardEl.querySelector('img');
      if (img) img.style.viewTransitionName = 'urun-tabak';
    }

    try {
      const transition = document.startViewTransition(() => {
        showDetailCallback();
      });

      await transition.finished;
    } catch (_) {
      showDetailCallback();
    } finally {
      if (sourceCardEl) {
        sourceCardEl.style.viewTransitionName = '';
        const img = sourceCardEl.querySelector('img');
        if (img) img.style.viewTransitionName = '';
      }
    }
    return;
  }

  // FLIP Yedeği (First - Last - Invert - Play)
  let firstRect = null;
  if (sourceCardEl) {
    firstRect = sourceCardEl.getBoundingClientRect();
  }

  showDetailCallback();

  const detailView = document.querySelector('.detay-ekran');
  if (!detailView || !firstRect) return;

  const targetMorph = detailView.querySelector('.detay-ust');
  const targetPlate = detailView.querySelector('.detay-tabak');
  const targetPanel = detailView.querySelector('.panel');
  const targetCta = detailView.querySelector('.cta-sabit');
  const targetButtons = detailView.querySelector('.detay-butonlar');
  const targetKademeler = detailView.querySelectorAll('.panel .kademe');

  const lastRect = targetMorph ? targetMorph.getBoundingClientRect() : null;

  if (targetMorph && lastRect) {
    const dx = firstRect.left - lastRect.left;
    const dy = firstRect.top - lastRect.top;
    const sx = firstRect.width / lastRect.width;
    const sy = firstRect.height / lastRect.height;

    // Morf katmanı: karttan yukarı doğru açılır
    targetMorph.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, borderRadius: '28px' },
      { transform: 'none', borderRadius: '0' }
    ], {
      duration: DURATION.orta,
      easing: EASING.vurgulu,
      fill: 'both'
    });
  }

  if (targetPanel) {
    targetPanel.animate([
      { transform: 'translateY(420px)' },
      { transform: 'translateY(0)' }
    ], {
      duration: DURATION.yayPanel,
      easing: EASING.yayPanel,
      delay: 40,
      fill: 'both'
    });
  }

  if (targetPlate) {
    targetPlate.animate([
      { opacity: 0, transform: 'scale(0.8)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: DURATION.yayYumusak,
      easing: EASING.yayYumusak,
      delay: 160,
      fill: 'both'
    });
  }

  if (targetKademeler.length) {
    targetKademeler.forEach((kademe, index) => {
      kademe.animate([
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 260,
        easing: EASING.cikis,
        delay: 220 + index * 40,
        fill: 'both'
      });
    });
  }

  if (targetButtons) {
    targetButtons.animate([
      { opacity: 0, transform: 'translateY(-10px)' },
      { opacity: 1, transform: 'none' }
    ], {
      duration: DURATION.yayZipla,
      easing: EASING.yayZipla,
      delay: 260,
      fill: 'both'
    });
  }

  if (targetCta) {
    targetCta.animate([
      { transform: 'translateY(110px)' },
      { transform: 'translateY(0)' }
    ], {
      duration: DURATION.yayYumusak,
      easing: EASING.yayYumusak,
      delay: 300,
      fill: 'both'
    });
  }
}

/**
 * Detay -> Geri ters geçiş
 */
export async function transitionDetailToPrevious(onFinish) {
  if (isReducedMotion()) {
    onFinish();
    return;
  }

  const detailView = document.querySelector('.detay-ekran');
  if (!detailView) {
    onFinish();
    return;
  }

  const panel = detailView.querySelector('.panel');
  const cta = detailView.querySelector('.cta-sabit');
  const plate = detailView.querySelector('.detay-tabak');
  const morph = detailView.querySelector('.detay-ust');
  const kademeler = detailView.querySelectorAll('.panel .kademe');

  // Metinler hızla söner
  kademeler.forEach(k => {
    k.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'linear', fill: 'forwards' });
  });

  if (cta) {
    cta.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(110px)' }], { duration: 180, easing: EASING.giris, fill: 'forwards' });
  }

  if (panel) {
    panel.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(460px)' }], { duration: 240, easing: EASING.giris, fill: 'forwards' });
  }

  if (plate) {
    plate.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.8)' }], { duration: 160, easing: EASING.giris, fill: 'forwards' });
  }

  if (morph) {
    morph.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: EASING.kapanis, delay: 60, fill: 'forwards' });
  }

  setTimeout(() => {
    onFinish();
  }, 250);
}
