/**
 * HALİS QR Web Menü — Açılış (Splash) Animasyonu
 * Tasarım dokümanındaki (8.8) zamanlamalar ve yaylarla birebir.
 */

import { DEKO, dekoEl } from '../icons.js';
import { EASING, DURATION, isReducedMotion } from '../transitions.js';

export async function renderSplashScreen(container, onComplete, force = false) {
  // Eğer oturumda daha önce gösterildiyse ve zorlanmadıysa atla
  const alreadyShown = sessionStorage.getItem('halis-splash-shown');
  if (alreadyShown && !force && !isReducedMotion()) {
    if (onComplete) onComplete();
    return;
  }

  sessionStorage.setItem('halis-splash-shown', '1');

  // Splash arayüzü
  const splashEl = document.createElement('div');
  splashEl.className = 'splash-ekran';
  splashEl.innerHTML = `
    ${dekoEl(250, -70, DEKO.daire(110, '#00A3FF'), 'opacity:.95')}
    ${dekoEl(-60, 650, DEKO.daire(120, '#E3792F'))}
    ${dekoEl(24, 120, DEKO.halka(36, '#FFD850', 10))}
    ${dekoEl(300, 640, DEKO.halka(28, '#1A49AF', 8))}
    ${dekoEl(60, 560, DEKO.serpinti('#30673A', 30))}
    ${dekoEl(320, 230, DEKO.serpinti('#E3792F', -20))}
    ${dekoEl(90, 250, DEKO.serpinti('#00A3FF', 70))}
    ${dekoEl(250, 560, DEKO.yildiz(26, '#FFF500'))}
    ${dekoEl(40, 470, DEKO.yildiz(18, '#1A49AF'))}
    ${dekoEl(150, 730, DEKO.dalga(150, '#FFD850', 6))}
    
    <div class="splash-logo-sahne" id="splashLogo"></div>

    <div class="splash-karsilama" id="splashKarsilama" style="opacity:0">
      <div class="etiket" style="color:var(--renk-lacivert); font-size:12px; letter-spacing:0.1em">QR Menü · Masa 7</div>
      <div class="kucuk" style="margin-top:6px; font-size:14px; color:var(--metin-2)">Taze, tatlı, sıcak — her gün</div>
    </div>

    <div class="splash-yukleniyor" id="splashYukleniyor">
      <i style="background:#E3792F"></i>
      <i style="background:#FFD850"></i>
      <i style="background:#00A3FF"></i>
    </div>
  `;

  container.appendChild(splashEl);

  if (isReducedMotion()) {
    setTimeout(() => {
      splashEl.remove();
      if (onComplete) onComplete();
    }, 400);
    return;
  }

  // SVG Logo içeriğini yükle
  try {
    const res = await fetch('./assets/logo/halis-wordmark-animasyon.svg');
    const svgText = await res.text();
    const logoContainer = splashEl.querySelector('#splashLogo');
    logoContainer.innerHTML = svgText;
    
    const svgEl = logoContainer.querySelector('svg');
    if (svgEl) {
      svgEl.removeAttribute('width');
      svgEl.removeAttribute('height');
      svgEl.style.cssText = 'width:100%; height:auto; overflow:visible; display:block;';
    }

    // Harfler
    const letterIds = ['harf-H', 'harf-A', 'harf-L', 'harf-I', 'harf-S'];
    const letters = letterIds.map(id => svgEl.getElementById(id)).filter(Boolean);
    letters.forEach(h => {
      h.style.transformOrigin = '50% 100%';
      h.style.opacity = '0';
    });

    const alev = svgEl.getElementById('alev');
    if (alev) {
      alev.style.transformOrigin = '50% 100%';
      alev.style.transform = 'scale(0)';
    }

    const slogan = svgEl.getElementById('slogan');
    if (slogan) {
      slogan.style.transformOrigin = '0% 50%';
      slogan.style.opacity = '0';
    }

    // 1) Dekorlar zıplar (45ms kademe)
    const dekos = splashEl.querySelectorAll(':scope > .deko');
    dekos.forEach((d, i) => {
      d.animate([
        { transform: 'scale(0)' },
        { transform: 'scale(1)' }
      ], {
        duration: DURATION.yayZipla,
        easing: EASING.yayZipla,
        delay: i * 45,
        fill: 'both'
      });
    });

    // 2) Harfler H-A-L-İ-S 70ms kademe ile (200ms'den itibaren)
    letters.forEach((h, i) => {
      const delay = 200 + i * 70;
      h.animate([
        { opacity: 0, transform: 'translateY(40px) scale(0.6)' },
        { opacity: 1, transform: 'none' }
      ], {
        duration: DURATION.yayZipla,
        easing: EASING.yayZipla,
        delay: delay,
        fill: 'both'
      });
    });

    // 3) Alev 760ms'de yanar, 1260ms'den sonra hafifçe titrer
    if (alev) {
      const alevGiris = alev.animate([
        { transform: 'scale(0)' },
        { transform: 'scale(1)' }
      ], {
        duration: DURATION.yayZipla,
        easing: EASING.yayZipla,
        delay: 760,
        fill: 'both'
      });

      alevGiris.onfinish = () => {
        alev.animate([
          { transform: 'scale(1, 1)' },
          { transform: 'scale(0.96, 1.07)' }
        ], {
          duration: 600,
          iterations: Infinity,
          direction: 'alternate',
          easing: 'ease-in-out'
        });
      };
    }

    // 4) Slogan 820ms'de gelir
    if (slogan) {
      slogan.animate([
        { opacity: 0, transform: 'translateX(-40px) rotate(-6deg)' },
        { opacity: 1, transform: 'none' }
      ], {
        duration: DURATION.yayYumusak,
        easing: EASING.yayYumusak,
        delay: 820,
        fill: 'both'
      });
    }

    // 5) Karşılama metni 1000ms'de gelir
    const karsilama = splashEl.querySelector('#splashKarsilama');
    if (karsilama) {
      karsilama.animate([
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'none' }
      ], {
        duration: 260,
        easing: EASING.cikis,
        delay: 1000,
        fill: 'both'
      });
    }

    // 6) Yükleniyor noktaları
    const dots = splashEl.querySelectorAll('.splash-yukleniyor i');
    dots.forEach((dot, i) => {
      dot.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(-8px)' }
      ], {
        duration: 300,
        delay: 600 + i * 100,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
      });
    });

    // 7) 1900ms'de splash scale 1.08 + söner (400ms)
    setTimeout(() => {
      const cikis = splashEl.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.08)' }
      ], {
        duration: 400,
        easing: EASING.cikis,
        fill: 'both'
      });

      cikis.onfinish = () => {
        splashEl.remove();
        if (onComplete) onComplete();
      };
    }, 1900);

  } catch (err) {
    console.warn('Splash animasyonu çalıştırılamadı:', err);
    splashEl.remove();
    if (onComplete) onComplete();
  }
}
