/**
 * Sound Engine for Dlilek Mlak
 * Uses the authentic audio files extracted from the official Dlilek Mlak game:
 * - evil_laugh.mp3: iconic laughter when gag / small prize is revealed
 * - aww.mp3: sad/disappointment groan when big jackpot is eliminated
 * - phone_ring.mp3: banker phone ringing
 * - drum_roll.mp3: suspense drum roll when box is opening
 * - happy_crowd.mp3: crowd cheer
 * - applause.mp3: grand audience applause
 * - notify_xp.mp3: prize reveal ding
 * - button_click.mp3: box click
 */

class SoundEngine {
  private isMuted: boolean = false;
  private currentBankerRing: HTMLAudioElement | null = null;
  private currentSuspenseAudio: HTMLAudioElement | null = null;

  constructor() {
    const savedMute = localStorage.getItem('dlilek_sound_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private playFile(filename: string, volume = 1.0, loop = false): HTMLAudioElement | null {
    if (this.isMuted) return null;
    try {
      const audio = new Audio(`/audio/${filename}`);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.loop = loop;
      audio.play().catch(() => {
        // Auto-play was prevented before user interaction
      });
      return audio;
    } catch {
      return null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('dlilek_sound_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopBankerRing();
      this.stopSuspense();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Box click sound
   */
  public playChestClick(): void {
    this.playFile('button_click.mp3', 0.9);
  }

  /**
   * Suspense drum roll before box opens
   */
  public playSuspenseRiser(): void {
    this.stopSuspense();
    this.currentSuspenseAudio = this.playFile('drum_roll.mp3', 0.95);
  }

  public stopSuspense(): void {
    if (this.currentSuspenseAudio) {
      try {
        this.currentSuspenseAudio.pause();
        this.currentSuspenseAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentSuspenseAudio = null;
    }
  }

  /**
   * Heartbeat sound
   */
  public playHeartbeat(): void {
    this.playFile('button_click.mp3', 0.4);
  }

  /**
   * 🎭 AUTHENTIC GAME SOUND 1: Evil / Crowd Laughter
   * Played when a gag item (كردونة, صحن فريت, مخدة) or tiny prize is revealed!
   */
  public playLaughterSound(): void {
    this.stopSuspense();
    this.playFile('evil_laugh.mp3', 1.0);
    setTimeout(() => {
      this.playFile('happy_crowd.mp3', 0.7);
    }, 1200);
  }

  /**
   * 🎻 AUTHENTIC GAME SOUND 2: The Aww / Sad Groan
   * Played when a massive jackpot (50.000 د, 100.000 د, 1.000.000 د, 2.000.000 د) is eliminated!
   */
  public playSadMusic(): void {
    this.stopSuspense();
    this.playFile('aww.mp3', 1.0);
  }

  /**
   * Reveal ding when box pops open
   */
  public playRevealChime(isHighValue = true): void {
    this.stopSuspense();
    if (isHighValue) {
      this.playFile('notify_xp.mp3', 0.95);
    } else {
      this.playFile('notify_win7.mp3', 0.9);
    }
  }

  /**
   * 👏 Grand Crowd Applause & Cheers
   */
  public playCrowdApplause(): void {
    this.playFile('applause.mp3', 0.9);
  }

  /**
   * Happy crowd "Yeah!"
   */
  public playHappyCrowd(): void {
    this.playFile('happy_crowd.mp3', 0.9);
  }

  /**
   * 📞 Banker Phone Ringing
   */
  public startBankerRing(): void {
    this.stopBankerRing();
    if (this.isMuted) return;
    this.currentBankerRing = this.playFile('phone_ring.mp3', 0.9, true);
  }

  public stopBankerRing(): void {
    if (this.currentBankerRing) {
      try {
        this.currentBankerRing.pause();
        this.currentBankerRing.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentBankerRing = null;
    }
  }

  /**
   * Acceptance chime when "DEAL" is agreed
   */
  public playDealSound(): void {
    this.stopBankerRing();
    this.playFile('happy_crowd.mp3', 0.95);
    setTimeout(() => {
      this.playFile('applause.mp3', 0.95);
    }, 500);
  }

  /**
   * "NO DEAL" rejection sound
   */
  public playNoDealSound(): void {
    this.stopBankerRing();
    this.playFile('button_click.mp3', 0.9);
  }

  /**
   * Victory grand fanfare for the result screen
   */
  public playVictoryFanfare(): void {
    this.playFile('applause.mp3', 1.0);
    setTimeout(() => {
      this.playFile('happy_crowd.mp3', 0.9);
    }, 400);
  }
}

export const sounds = new SoundEngine();
