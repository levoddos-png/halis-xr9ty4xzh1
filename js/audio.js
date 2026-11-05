/**
 * HALİS QR Web Menü — Web Audio Ses Motoru
 * Web Audio API ile gecikmesiz, önbellekli ve yumuşak dokunma sesleri.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.buffers = new Map();
    this.lastPlayTime = new Map();
    this.activeSources = 0;
    this.maxActive = 2;
    this.throttleMs = 80;
    this.masterVolume = 0.6;
    
    // Ses açık mı? (Varsayılan kapalı başlar)
    const stored = localStorage.getItem('halis-ses');
    this.enabled = stored === 'true';
    
    this.unlocked = false;
    this.listeners = new Set();
    
    // Format desteği
    this.ext = this.detectFormat();
    
    // Ses dosyaları
    this.soundNames = [
      'dokunma',
      'kategori-gecis',
      'kart-acilma',
      'geri',
      'listeye-ekle',
      'ses-acik'
    ];
    
    this.setupUnlockListeners();
  }

  detectFormat() {
    const audio = document.createElement('audio');
    if (audio.canPlayType && audio.canPlayType('audio/ogg; codecs=vorbis').replace(/no/, '')) {
      return '.ogg';
    }
    return '.mp3';
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    return this.ctx;
  }

  setupUnlockListeners() {
    const unlock = () => {
      if (this.unlocked) return;
      const ctx = this.getAudioContext();
      if (ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        this.unlocked = true;
        this.preloadAll();
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock, { passive: true, once: true });
    window.addEventListener('keydown', unlock, { passive: true, once: true });
  }

  async preloadAll() {
    for (const name of this.soundNames) {
      this.loadSound(name).catch(() => {});
    }
  }

  async loadSound(name) {
    if (this.buffers.has(name)) return this.buffers.get(name);
    const ctx = this.getAudioContext();
    if (!ctx) return null;

    try {
      const url = `./assets/sesler/${name}${this.ext}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      this.buffers.set(name, audioBuffer);
      return audioBuffer;
    } catch (e) {
      // OGG başarısız olursa MP3 dene
      if (this.ext === '.ogg') {
        try {
          const res = await fetch(`./assets/sesler/${name}.mp3`);
          const arrayBuffer = await res.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          this.buffers.set(name, audioBuffer);
          return audioBuffer;
        } catch (_) {}
      }
      return null;
    }
  }

  async play(name) {
    if (!this.enabled) return;

    // Throttle kontrolü (aynı ses min 80 ms)
    const now = performance.now();
    const last = this.lastPlayTime.get(name) || 0;
    if (now - last < this.throttleMs) return;

    // Eşzamanlı ses sayısı sınırı (en fazla 2)
    if (this.activeSources >= this.maxActive) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch (_) {}
    }

    let buffer = this.buffers.get(name);
    if (!buffer) {
      buffer = await this.loadSound(name);
      if (!buffer) return;
    }

    try {
      this.lastPlayTime.set(name, now);
      this.activeSources++;

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(this.masterVolume, ctx.currentTime);

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.onended = () => {
        this.activeSources = Math.max(0, this.activeSources - 1);
      };

      source.start(0);
    } catch (_) {
      this.activeSources = Math.max(0, this.activeSources - 1);
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('halis-ses', String(this.enabled));
    
    // Ses açıldıysa onay sesi çal
    if (this.enabled) {
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => this.play('ses-acik'));
      } else {
        this.play('ses-acik');
      }
    }

    this.notifyListeners();
    return this.enabled;
  }

  isSoundEnabled() {
    return this.enabled;
  }

  onChange(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      try { listener(this.enabled); } catch (_) {}
    }
  }
}

export const sound = new SoundEngine();
