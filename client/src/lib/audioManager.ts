/**
 * Audio Manager
 * Handles sound effects and background music with Web Audio API
 * Uses simple waveforms for retro C64-style sounds
 */

class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentMusicSource: OscillatorNode | null = null;
  private musicTimeoutId: number | null = null;
  private musicEnabled: boolean = false;
  private sfxEnabled: boolean = true;

  constructor() {
    this.init();
  }

  private init() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      // Load settings from localStorage
      const musicSetting = localStorage.getItem('musicEnabled');
      const sfxSetting = localStorage.getItem('soundEffectsEnabled');

      this.musicEnabled = musicSetting ? JSON.parse(musicSetting) : false;
      this.sfxEnabled = sfxSetting ? JSON.parse(sfxSetting) : true;
    }
  }

  private ensureAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create gain nodes for volume control
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);

      this.musicGain = this.audioContext.createGain();
      this.musicGain.connect(this.masterGain);
      this.musicGain.gain.value = 0.3; // Lower volume for music

      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.connect(this.masterGain);
      this.sfxGain.gain.value = 0.5; // Medium volume for SFX
    }

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // C64-style beep sound using square wave
  playBeep(frequency: number = 440, duration: number = 0.1) {
    if (!this.sfxEnabled) return;

    this.ensureAudioContext();
    if (!this.audioContext || !this.sfxGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square'; // C64-style square wave
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);

    // Envelope for less harsh sound
    const now = this.audioContext.currentTime;
    gainNode.gain.value = 0;
    gainNode.gain.linearRampToValueAtTime(1, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Button click sound - short high beep
  playButtonClick() {
    this.playBeep(800, 0.08);
  }

  // Menu navigation sound - medium beep
  playMenuNav() {
    this.playBeep(600, 0.1);
  }

  // Success sound - ascending tones
  playSuccess() {
    if (!this.sfxEnabled) return;

    const notes = [523, 659, 784, 1047]; // C, E, G, C (major chord)
    notes.forEach((freq, i) => {
      setTimeout(() => this.playBeep(freq, 0.15), i * 100);
    });
  }

  // Error sound - low descending tone
  playError() {
    if (!this.sfxEnabled) return;

    this.ensureAudioContext();
    if (!this.audioContext || !this.sfxGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sawtooth';
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);

    const now = this.audioContext.currentTime;
    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);

    gainNode.gain.setValueAtTime(0.8, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  // Piece placement sound - short pop
  playPiecePlaced() {
    this.playBeep(440, 0.05);
  }

  // Piece rotation sound - quick chirp
  playPieceRotate() {
    if (!this.sfxEnabled) return;

    this.ensureAudioContext();
    if (!this.audioContext || !this.sfxGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square';
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);

    const now = this.audioContext.currentTime;
    oscillator.frequency.setValueAtTime(300, now);
    oscillator.frequency.linearRampToValueAtTime(500, now + 0.05);

    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }

  // Simple background music - C64 style loop
  startBackgroundMusic() {
    // Stop any existing music first
    this.stopBackgroundMusic();

    if (!this.musicEnabled) return;

    this.ensureAudioContext();
    if (!this.audioContext || !this.musicGain) return;

    // C64-style arpeggiated chord progression
    // Using C major pentatonic scale: C, D, E, G, A
    const melody = [
      { freq: 523, duration: 0.3 },  // C
      { freq: 587, duration: 0.3 },  // D
      { freq: 659, duration: 0.3 },  // E
      { freq: 784, duration: 0.3 },  // G
      { freq: 659, duration: 0.3 },  // E
      { freq: 587, duration: 0.3 },  // D
    ];

    let noteIndex = 0;
    const playNote = () => {
      if (!this.musicEnabled || !this.audioContext || !this.musicGain) {
        this.stopBackgroundMusic();
        return;
      }

      const note = melody[noteIndex % melody.length];
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'square';
      oscillator.frequency.value = note.freq;

      oscillator.connect(gainNode);
      gainNode.connect(this.musicGain);

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.duration);

      oscillator.start(now);
      oscillator.stop(now + note.duration);

      noteIndex++;
      this.musicTimeoutId = window.setTimeout(playNote, note.duration * 1000);
    };

    playNote();
  }

  stopBackgroundMusic() {
    // Clear the timeout to stop the loop
    if (this.musicTimeoutId !== null) {
      clearTimeout(this.musicTimeoutId);
      this.musicTimeoutId = null;
    }

    // Stop current oscillator if any
    if (this.currentMusicSource) {
      this.currentMusicSource.stop();
      this.currentMusicSource = null;
    }
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    localStorage.setItem('musicEnabled', JSON.stringify(enabled));

    if (!enabled) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
  }

  setSoundEffectsEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    localStorage.setItem('soundEffectsEnabled', JSON.stringify(enabled));
  }

  // Resume audio context (call on user interaction to bypass autoplay policy)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Helper to initialize audio on first user interaction
export function initAudio() {
  audioManager.resume();

  // Check if music should be playing
  const musicEnabled = localStorage.getItem('musicEnabled');
  if (musicEnabled && JSON.parse(musicEnabled)) {
    audioManager.startBackgroundMusic();
  }
}
