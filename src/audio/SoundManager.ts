export class SoundManager {
  private static ctx: AudioContext | null = null;
  public static isMuted = false;
  private static rainNode: any = null;
  private static isRainPlaying = false;

  private static init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  // Wooden Tap
  public static playPlace() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.07);
    gain.gain.setValueAtTime(0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(t); osc.stop(t + 0.07);
  }

  // Double-strike Wood Impact
  public static playCapture() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.18);
    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(t); osc.stop(t + 0.18);
  }

  // 🐐 Distressed Goat Bleat Scream (ম্যাঁ-অ্যাঁ-হ!)
  public static playGoatScream() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const mainGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Nasal vocal tract filter
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1150, t);
    filter.Q.setValueAtTime(3.5, t);

    // Rapid 22Hz vocal vibrato/flutter
    lfo.frequency.setValueAtTime(22, t);
    lfoGain.gain.setValueAtTime(35, t);
    lfo.connect(osc.frequency);

    // Descending distressed goat pitch (360Hz -> 210Hz)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(210, t + 0.42);

    // Bleat volume envelope
    mainGain.gain.setValueAtTime(0.01, t);
    mainGain.gain.linearRampToValueAtTime(0.55, t + 0.03);
    mainGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(this.ctx.destination);

    lfo.start(t); osc.start(t);
    lfo.stop(t + 0.45); osc.stop(t + 0.45);
  }

  // 🐅 Trapped / Angry Tiger Roar (বাঘের গর্জন)
  public static playTigerRoar() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // Guttural low-frequency growl (75Hz -> 38Hz)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(75, t);
    osc.frequency.linearRampToValueAtTime(38, t + 0.65);
    oscGain.gain.setValueAtTime(0.7, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    // Throat resonance filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + 0.7);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.7);
  }

  // Bengali Folk Pentatonic Victory Melody
  public static playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const startTime = this.ctx.currentTime + 0.05;
    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.14;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.3, noteTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);
      osc.connect(gain); gain.connect(this.ctx!.destination);
      osc.start(noteTime); osc.stop(noteTime + 0.42);
    });
  }

  // Monsoon Rain
  public static toggleRain() {
    this.init();
    if (!this.ctx) return false;
    if (this.isRainPlaying) {
      if (this.rainNode) { this.rainNode.stop?.(); this.rainNode.disconnect(); this.rainNode = null; }
      this.isRainPlaying = false;
      return false;
    }
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    whiteNoise.start();
    this.rainNode = whiteNoise;
    this.isRainPlaying = true;
    return true;
  }
}
