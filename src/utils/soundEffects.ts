/**
 * Web Audio API Procedural Sound Synthesizer for Dlilek Mlak
 * Zero external audio files required, 100% offline & reliable.
 * Includes authentic TV show laughter, sad music, crowd applause, and suspense.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ringIntervalId: number | null = null;

  constructor() {
    // Lazy audio context initialization on first user interaction
    const savedMute = localStorage.getItem('dlilek_sound_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private initCtx(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('dlilek_sound_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopBankerRing();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Suspense heartbeat pulse when contestant is choosing or waiting
   */
  public playHeartbeat(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.45, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  /**
   * Suspense roll / riser when chest is shaking before reveal
   */
  public playSuspenseRiser(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.25);
  }

  /**
   * Chest click sound
   */
  public playChestClick(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  /**
   * Standard reveal ding / chime when chest pops open
   */
  public playRevealChime(isHighValue = true): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const freqs = isHighValue ? [523.25, 659.25, 783.99, 1046.50] : [330, 293.66, 261.63];
    
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isHighValue ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.65);
    });
  }

  /**
   * 🎭 ORIGINAL TV SHOW SOUND 1: Studio Audience Laughter & Chuckles
   * Plays when a gag item (كردونة, دبوزة ماء, فردة صباط) or tiny prize is revealed!
   */
  public playLaughterSound(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Comic spring "boing" introductory accent
    const boingOsc = ctx.createOscillator();
    const boingGain = ctx.createGain();
    boingOsc.type = 'sine';
    boingOsc.frequency.setValueAtTime(260, now);
    boingOsc.frequency.exponentialRampToValueAtTime(680, now + 0.15);
    boingOsc.frequency.exponentialRampToValueAtTime(320, now + 0.35);

    boingGain.gain.setValueAtTime(0.2, now);
    boingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    boingOsc.connect(boingGain);
    boingGain.connect(ctx.destination);
    boingOsc.start(now);
    boingOsc.stop(now + 0.4);

    // 2. Rhythmic bursts of formant-filtered chuckle laughter ("Ha-Ha-Ha-Ha-Ha-Ha!")
    // Multiple voices staggered
    const chuckleOffsets = [0.15, 0.32, 0.50, 0.68, 0.86, 1.05, 1.25, 1.45];
    const pitches = [
      { base: 360, end: 280 },
      { base: 420, end: 320 },
      { base: 390, end: 300 },
      { base: 450, end: 340 },
      { base: 410, end: 310 },
      { base: 370, end: 290 },
      { base: 340, end: 270 },
      { base: 310, end: 250 },
    ];

    chuckleOffsets.forEach((offset, idx) => {
      const p = pitches[idx % pitches.length];
      const laughTime = now + offset;

      // Voice 1 (Male giggle)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const filter1 = ctx.createBiquadFilter();

      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(850, laughTime);
      filter1.Q.setValueAtTime(3.5, laughTime);

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(p.base, laughTime);
      osc1.frequency.exponentialRampToValueAtTime(p.end, laughTime + 0.12);

      gain1.gain.setValueAtTime(0, laughTime);
      gain1.gain.linearRampToValueAtTime(0.18, laughTime + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, laughTime + 0.13);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(laughTime);
      osc1.stop(laughTime + 0.14);

      // Voice 2 (Higher chuckle harmony)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filter2 = ctx.createBiquadFilter();

      filter2.type = 'bandpass';
      filter2.frequency.setValueAtTime(1400, laughTime + 0.02);
      filter2.Q.setValueAtTime(4.0, laughTime + 0.02);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(p.base * 1.35, laughTime + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(p.end * 1.25, laughTime + 0.12);

      gain2.gain.setValueAtTime(0, laughTime + 0.02);
      gain2.gain.linearRampToValueAtTime(0.14, laughTime + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, laughTime + 0.14);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(laughTime + 0.02);
      osc2.stop(laughTime + 0.15);
    });

    // 3. Followed by cheerful crowd clapping
    setTimeout(() => {
      this.playCrowdApplause(1.8);
    }, 450);
  }

  /**
   * 🎻 ORIGINAL TV SHOW SOUND 2: Dramatic Sad Music & Disappointment Lament
   * Plays when a massive jackpot (e.g. 500,000 DT, 1,000,000 DT) is eliminated!
   * The classic "Oh no! The jackpot is gone!" sad string lament.
   */
  public playSadMusic(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Low ominous bass cello drone (D minor)
    [73.42, 110.0, 146.83].forEach((freq) => {
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = 'triangle';
      droneOsc.frequency.setValueAtTime(freq, now);

      droneGain.gain.setValueAtTime(0.12, now);
      droneGain.gain.linearRampToValueAtTime(0.15, now + 1.5);
      droneGain.gain.exponentialRampToValueAtTime(0.001, now + 4.2);

      droneOsc.connect(droneGain);
      droneGain.connect(ctx.destination);

      droneOsc.start(now);
      droneOsc.stop(now + 4.3);
    });

    // 2. Melancholic weeping violin melody (Descending minor phrase: F4 -> E4 -> Eb4 -> D4)
    const sadNotes = [
      { f: 349.23, time: 0.1, dur: 0.65 }, // F4
      { f: 329.63, time: 0.75, dur: 0.65 }, // E4
      { f: 311.13, time: 1.4, dur: 0.75 }, // Eb4
      { f: 293.66, time: 2.15, dur: 1.8 }, // D4 (sustained lament)
    ];

    sadNotes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();

      // Vibrato for crying violin expressiveness
      vibrato.frequency.setValueAtTime(5.5, now + n.time);
      vibratoGain.gain.setValueAtTime(6.0, now + n.time);
      vibrato.connect(osc.frequency);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.f, now + n.time);

      // Low-pass warm filter to make it sound like a dark wooden violin/cello
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now + n.time);

      gain.gain.setValueAtTime(0, now + n.time);
      gain.gain.linearRampToValueAtTime(0.22, now + n.time + 0.08);
      gain.gain.setValueAtTime(0.20, now + n.time + n.dur - 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

      vibrato.start(now + n.time);
      vibrato.stop(now + n.time + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur + 0.05);
    });

    // 3. Classic TV sad brass slide ("Wah-Wah-Wah-Waaaaah")
    const wahTimes = [
      { f: 233.08, t: 1.8, dur: 0.35 }, // Bb3
      { f: 220.00, t: 2.2, dur: 0.35 }, // A3
      { f: 207.65, t: 2.6, dur: 0.35 }, // Ab3
      { f: 196.00, t: 3.0, dur: 1.2 },  // G3 (slide down)
    ];

    wahTimes.forEach((w, i) => {
      const wahOsc = ctx.createOscillator();
      const wahGain = ctx.createGain();
      const wahFilter = ctx.createBiquadFilter();

      wahFilter.type = 'bandpass';
      wahFilter.frequency.setValueAtTime(550, now + w.t);
      wahFilter.Q.setValueAtTime(4.0, now + w.t);

      wahOsc.type = 'sawtooth';
      wahOsc.frequency.setValueAtTime(w.f, now + w.t);
      if (i === wahTimes.length - 1) {
        wahOsc.frequency.exponentialRampToValueAtTime(w.f * 0.88, now + w.t + w.dur);
      }

      wahGain.gain.setValueAtTime(0, now + w.t);
      wahGain.gain.linearRampToValueAtTime(0.18, now + w.t + 0.05);
      wahGain.gain.exponentialRampToValueAtTime(0.001, now + w.t + w.dur);

      wahOsc.connect(wahFilter);
      wahFilter.connect(wahGain);
      wahGain.connect(ctx.destination);

      wahOsc.start(now + w.t);
      wahOsc.stop(now + w.t + w.dur + 0.05);
    });
  }

  /**
   * 👏 Crowd Applause & Cheering
   */
  public playCrowdApplause(durationSeconds = 2.0): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    // Generate simulated audience clapping using modulated bandpass noise
    const bufferSize = Math.floor(ctx.sampleRate * durationSeconds);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill with clapping impulses
    let lastClap = 0;
    for (let i = 0; i < bufferSize; i++) {
      // Clapping density
      if (Math.random() < 0.015 && i - lastClap > 300) {
        lastClap = i;
        const decayLen = Math.floor(ctx.sampleRate * 0.025);
        for (let j = 0; j < decayLen && i + j < bufferSize; j++) {
          data[i + j] += (Math.random() * 2 - 1) * Math.exp(-j / (decayLen * 0.3));
        }
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.25, ctx.currentTime + durationSeconds - 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start();
    noiseSource.stop(ctx.currentTime + durationSeconds + 0.05);
  }

  /**
   * Banker vintage phone ringing (440Hz + 480Hz modulated burst)
   */
  public startBankerRing(): void {
    this.stopBankerRing();
    const ctx = this.initCtx();
    if (!ctx) return;

    const playRingBurst = () => {
      if (this.isMuted || !this.ctx) return;
      
      const now = this.ctx.currentTime;
      // Dual-tone multi-frequency ring tone
      [440, 480].forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Ring pattern: Ring for 0.8s, pause 0.2s, ring 0.8s
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.setValueAtTime(0.12, now + 0.7);
        gain.gain.setValueAtTime(0, now + 0.75);
        gain.gain.setValueAtTime(0.12, now + 0.95);
        gain.gain.setValueAtTime(0.12, now + 1.65);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.75);
      });
    };

    playRingBurst();
    this.ringIntervalId = window.setInterval(playRingBurst, 3000);
  }

  public stopBankerRing(): void {
    if (this.ringIntervalId !== null) {
      clearInterval(this.ringIntervalId);
      this.ringIntervalId = null;
    }
  }

  /**
   * Acceptance chime when "DEAL" is agreed
   */
  public playDealSound(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const chord = [440, 554.37, 659.25, 880];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2 + idx * 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    });
  }

  /**
   * "NO DEAL" buzz / dramatic drum slam
   */
  public playNoDealSound(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.42);
  }

  /**
   * Victory grand fanfare for the result screen
   */
  public playVictoryFanfare(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    // Victory fanfare arpeggio (C5 -> E5 -> G5 -> C6 -> E6 sustained)
    const notes = [
      { freq: 523.25, time: 0, dur: 0.18 },
      { freq: 523.25, time: 0.2, dur: 0.18 },
      { freq: 523.25, time: 0.4, dur: 0.18 },
      { freq: 659.25, time: 0.6, dur: 0.35 },
      { freq: 587.33, time: 1.0, dur: 0.18 },
      { freq: 659.25, time: 1.2, dur: 0.18 },
      { freq: 783.99, time: 1.4, dur: 0.8 },
      { freq: 1046.5, time: 2.2, dur: 1.6 },
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);

      gain.gain.setValueAtTime(0, ctx.currentTime + n.time);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + n.time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + n.time);
      osc.stop(ctx.currentTime + n.time + n.dur + 0.05);
    });
  }
}

export const sounds = new SoundEngine();
