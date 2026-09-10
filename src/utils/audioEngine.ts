/**
 * Procedural Web Audio Engine matching the exact Native Audio Prompts for each shot,
 * with full user-controlled Stem Mixer (Sub-bass, Ambience, SFX, Voiceover pitch/speed/voice selection).
 */
import { ShotData, StemMixerSettings } from '../types';

class StoryboardAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private subBassGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private currentShotId: number | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private voiceEnabled: boolean = true;
  private lastSpokenShot: number | null = null;

  private mixerSettings: StemMixerSettings = {
    masterVolume: 0.8,
    subBass: 0.85,
    ambience: 0.75,
    sfxClicks: 0.8,
    voiceoverGain: 1.0,
    voicePitch: 0.95,
    voiceRate: 1.05,
  };

  public init() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.mixerSettings.masterVolume, this.ctx.currentTime);

      // Stems Gain Nodes
      this.subBassGain = this.ctx.createGain();
      this.subBassGain.gain.setValueAtTime(this.mixerSettings.subBass, this.ctx.currentTime);

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(this.mixerSettings.ambience, this.ctx.currentTime);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.mixerSettings.sfxClicks, this.ctx.currentTime);

      // Connect Stems -> Master
      this.subBassGain.connect(this.masterGain);
      this.ambienceGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);

      // Analyser Node
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setVolume(volume: number) {
    this.mixerSettings.masterVolume = volume;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : volume, this.ctx.currentTime);
    }
  }

  public setStemGains(settings: Partial<StemMixerSettings>) {
    this.mixerSettings = { ...this.mixerSettings, ...settings };
    if (!this.ctx) return;

    if (settings.masterVolume !== undefined && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : settings.masterVolume, this.ctx.currentTime);
    }
    if (settings.subBass !== undefined && this.subBassGain) {
      this.subBassGain.gain.setValueAtTime(settings.subBass, this.ctx.currentTime);
    }
    if (settings.ambience !== undefined && this.ambienceGain) {
      this.ambienceGain.gain.setValueAtTime(settings.ambience, this.ctx.currentTime);
    }
    if (settings.sfxClicks !== undefined && this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(settings.sfxClicks, this.ctx.currentTime);
    }
  }

  public getStemSettings(): StemMixerSettings {
    return { ...this.mixerSettings };
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.mixerSettings.masterVolume, this.ctx.currentTime);
    }
    if (muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public toggleVoice(enabled: boolean) {
    this.voiceEnabled = enabled;
    if (!enabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }

  public testVoiceover(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.mixerSettings.voiceRate;
    utterance.pitch = this.mixerSettings.voicePitch;

    if (this.mixerSettings.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(v => v.name === this.mixerSettings.voiceName);
      if (match) utterance.voice = match;
    }
    window.speechSynthesis.speak(utterance);
  }

  public stopAll() {
    this.activeNodes.forEach(node => {
      try {
        node.stop();
      } catch {
        // Already stopped
      }
    });
    this.activeNodes = [];
    this.currentShotId = null;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public playShotAudio(shot: ShotData, progressInShot: number = 0) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentShotId === shot.id) {
      return;
    }

    this.stopAll();
    this.currentShotId = shot.id;

    switch (shot.id) {
      case 1:
        this.playShot1Audio(progressInShot, shot.voiceover);
        break;
      case 2:
        this.playShot2Audio(progressInShot, shot.voiceover);
        break;
      case 3:
        this.playShot3Audio(progressInShot, shot.voiceover);
        break;
      case 4:
        this.playShot4Audio(progressInShot, shot.voiceover);
        break;
      default:
        this.playGenericShotAudio(shot, progressInShot);
        break;
    }
  }

  // Shot 1: Low, tense digital hum + alert tone
  private playShot1Audio(offset: number, customVoice?: string) {
    if (!this.ctx || !this.subBassGain || !this.sfxGain || !this.ambienceGain) return;
    const now = this.ctx.currentTime;

    const humOsc = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    const humFilter = this.ctx.createBiquadFilter();

    humOsc.type = 'sawtooth';
    humOsc.frequency.setValueAtTime(55, now);
    humFilter.type = 'lowpass';
    humFilter.frequency.setValueAtTime(140, now);
    humFilter.frequency.exponentialRampToValueAtTime(750, now + Math.max(0.1, 3.2 - offset));

    humGain.gain.setValueAtTime(0.2, now);
    humGain.gain.linearRampToValueAtTime(0.4, now + Math.max(0.1, 2.5 - offset));

    humOsc.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(this.subBassGain);
    humOsc.start(now);

    const tensionOsc = this.ctx.createOscillator();
    const tensionGain = this.ctx.createGain();
    tensionOsc.type = 'sine';
    tensionOsc.frequency.setValueAtTime(220, now);
    tensionOsc.frequency.linearRampToValueAtTime(440, now + Math.max(0.1, 2.5 - offset));
    tensionGain.gain.setValueAtTime(0.02, now);
    tensionGain.gain.linearRampToValueAtTime(0.12, now + Math.max(0.1, 2.5 - offset));
    tensionOsc.connect(tensionGain);
    tensionGain.connect(this.ambienceGain);
    tensionOsc.start(now);

    const alertDelay = Math.max(0, 2.3 - offset);
    const alertOsc = this.ctx.createOscillator();
    const alertGain = this.ctx.createGain();
    alertOsc.type = 'triangle';
    alertOsc.frequency.setValueAtTime(880, now + alertDelay);
    alertOsc.frequency.setValueAtTime(1760, now + alertDelay + 0.15);

    alertGain.gain.setValueAtTime(0, now);
    alertGain.gain.setValueAtTime(0, now + alertDelay);
    alertGain.gain.linearRampToValueAtTime(0.35, now + alertDelay + 0.02);
    alertGain.gain.exponentialRampToValueAtTime(0.001, now + alertDelay + 0.6);

    alertOsc.connect(alertGain);
    alertGain.connect(this.sfxGain);
    alertOsc.start(now + alertDelay);

    this.activeNodes.push(
      { stop: () => { humOsc.stop(); tensionOsc.stop(); alertOsc.stop(); } }
    );

    this.speakVoiceover(1, customVoice || "Warning: How to build a billion dollar AI for five million dollars.", 0.8);
  }

  // Shot 2: Server cooling turbine + data clicks + sub-bass
  private playShot2Audio(offset: number, customVoice?: string) {
    if (!this.ctx || !this.subBassGain || !this.sfxGain || !this.ambienceGain) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(450, now);
    noiseFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, now);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ambienceGain);
    whiteNoise.start(now);

    const interval = 0.5;
    const bassBeats: OscillatorNode[] = [];
    const endTime = now + Math.max(0, 8 - offset);

    for (let t = now + (offset % interval === 0 ? 0 : interval - (offset % interval)); t < endTime; t += interval) {
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(65, t);
      subOsc.frequency.exponentialRampToValueAtTime(35, t + 0.2);

      subGain.gain.setValueAtTime(0.4, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      subOsc.connect(subGain);
      subGain.connect(this.subBassGain);
      subOsc.start(t);
      subOsc.stop(t + 0.35);
      bassBeats.push(subOsc);
    }

    const clickInterval = 0.125;
    const clickOscs: OscillatorNode[] = [];
    for (let t = now; t < endTime; t += clickInterval) {
      if (Math.random() > 0.3) {
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(2400 + Math.random() * 800, t);

        clickGain.gain.setValueAtTime(0.05, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

        clickOsc.connect(clickGain);
        clickGain.connect(this.sfxGain);
        clickOsc.start(t);
        clickOsc.stop(t + 0.02);
        clickOscs.push(clickOsc);
      }
    }

    this.activeNodes.push({
      stop: () => {
        try { whiteNoise.stop(); } catch {}
        bassBeats.forEach(b => { try { b.stop(); } catch {} });
        clickOscs.forEach(c => { try { c.stop(); } catch {} });
      }
    });

    this.speakVoiceover(2, customVoice || "Billions of tokens stream across borderless APIs, extracting weights and synthetic datasets.", 1.2);
  }

  // Shot 3: Heavy hum on left vs clean digital chime on right
  private playShot3Audio(offset: number, customVoice?: string) {
    if (!this.ctx || !this.subBassGain || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const leftPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (leftPanner) leftPanner.pan.setValueAtTime(-0.85, now);

    const rightPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (rightPanner) rightPanner.pan.setValueAtTime(0.85, now);

    const leftHum = this.ctx.createOscillator();
    const leftSub = this.ctx.createOscillator();
    const leftGain = this.ctx.createGain();

    leftHum.type = 'sawtooth';
    leftHum.frequency.setValueAtTime(60, now);
    leftSub.type = 'triangle';
    leftSub.frequency.setValueAtTime(120, now);
    leftGain.gain.setValueAtTime(0.28, now);

    const leftFilter = this.ctx.createBiquadFilter();
    leftFilter.type = 'lowpass';
    leftFilter.frequency.setValueAtTime(280, now);

    leftHum.connect(leftFilter);
    leftSub.connect(leftFilter);
    leftFilter.connect(leftGain);

    if (leftPanner) {
      leftGain.connect(leftPanner);
      leftPanner.connect(this.subBassGain);
    } else {
      leftGain.connect(this.subBassGain);
    }

    leftHum.start(now);
    leftSub.start(now);

    const rightChimes: OscillatorNode[] = [];
    const chimeTimes = [1.2, 3.2, 5.2, 6.8];
    chimeTimes.forEach(chimeOffset => {
      const scheduledTime = now + Math.max(0.1, chimeOffset - offset);
      if (scheduledTime >= now) {
        const chimeOsc = this.ctx!.createOscillator();
        const chimeGain = this.ctx!.createGain();

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(1318.51, scheduledTime);
        chimeOsc.frequency.exponentialRampToValueAtTime(659.25, scheduledTime + 0.8);

        chimeGain.gain.setValueAtTime(0, scheduledTime);
        chimeGain.gain.linearRampToValueAtTime(0.25, scheduledTime + 0.015);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, scheduledTime + 1.2);

        chimeOsc.connect(chimeGain);
        if (rightPanner) {
          chimeGain.connect(rightPanner);
          rightPanner.connect(this.sfxGain!);
        } else {
          chimeGain.connect(this.sfxGain!);
        }

        chimeOsc.start(scheduledTime);
        chimeOsc.stop(scheduledTime + 1.2);
        rightChimes.push(chimeOsc);
      }
    });

    this.activeNodes.push({
      stop: () => {
        try { leftHum.stop(); leftSub.stop(); } catch {}
        rightChimes.forEach(c => { try { c.stop(); } catch {} });
      }
    });

    this.speakVoiceover(3, customVoice || "Tens of thousands of GPUs burning power on the left. A five cent API distillation loop on the right.", 1.0);
  }

  // Shot 4: Ambient electronic outro
  private playShot4Audio(offset: number, customVoice?: string) {
    if (!this.ctx || !this.ambienceGain || !this.subBassGain) return;
    const now = this.ctx.currentTime;

    const chordFreqs = [174.61, 207.65, 261.63, 311.13, 392.0];
    const padOscs: OscillatorNode[] = [];

    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(0.01, now);
    padGain.gain.linearRampToValueAtTime(0.2, now + Math.max(0.2, 1.5 - offset));

    chordFreqs.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(padGain);
      osc.start(now);
      padOscs.push(osc);
    });

    const padFilter = this.ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(400, now);
    padFilter.frequency.linearRampToValueAtTime(1400, now + Math.max(0.5, 6.0 - offset));

    padGain.connect(padFilter);
    padFilter.connect(this.ambienceGain);

    const outroDelay = Math.max(0, 7.5 - offset);
    const outroTime = now + outroDelay;

    const resolveChord = [261.63, 329.63, 392.0, 523.25];
    resolveChord.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, outroTime);

      gain.gain.setValueAtTime(0, outroTime);
      gain.gain.linearRampToValueAtTime(0.18, outroTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, outroTime + 2.4);

      osc.connect(gain);
      gain.connect(this.ambienceGain!);
      osc.start(outroTime);
      osc.stop(outroTime + 2.5);
      padOscs.push(osc);
    });

    this.activeNodes.push({
      stop: () => {
        padOscs.forEach(o => { try { o.stop(); } catch {} });
      }
    });

    this.speakVoiceover(4, customVoice || "It's efficient. It violates terms of service. And it's rewriting global AI competition.", 0.6);
  }

  // Generic procedural audio for custom / user-added / AI-generated shots
  private playGenericShotAudio(shot: ShotData, offset: number) {
    if (!this.ctx || !this.ambienceGain || !this.subBassGain || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Rich ambient fifth pad
    const baseFreq = 110 * (shot.id % 2 === 0 ? 1 : 1.25);
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);

    padGain.gain.setValueAtTime(0.05, now);
    padGain.gain.linearRampToValueAtTime(0.22, now + 0.5);

    osc1.connect(padGain);
    osc2.connect(padGain);
    padGain.connect(this.ambienceGain);
    osc1.start(now);
    osc2.start(now);

    // Periodic telemetry ping
    const pingOsc = this.ctx.createOscillator();
    const pingGain = this.ctx.createGain();
    pingOsc.type = 'sine';
    pingOsc.frequency.setValueAtTime(880, now + 0.3);
    pingGain.gain.setValueAtTime(0, now);
    pingGain.gain.linearRampToValueAtTime(0.15, now + 0.35);
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    pingOsc.connect(pingGain);
    pingGain.connect(this.sfxGain);
    pingOsc.start(now + 0.3);
    pingOsc.stop(now + 1.2);

    this.activeNodes.push({
      stop: () => {
        try { osc1.stop(); osc2.stop(); pingOsc.stop(); } catch {}
      }
    });

    if (shot.voiceover) {
      this.speakVoiceover(shot.id, shot.voiceover, 0.6);
    }
  }

  private speakVoiceover(shotId: number, text: string, delaySec: number) {
    if (!this.voiceEnabled || this.isMuted) return;
    if (this.lastSpokenShot === shotId) return;
    if (!('speechSynthesis' in window)) return;

    this.lastSpokenShot = shotId;
    window.speechSynthesis.cancel();

    setTimeout(() => {
      if (this.currentShotId !== shotId || !this.voiceEnabled || this.isMuted) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.mixerSettings.voiceRate;
      utterance.pitch = this.mixerSettings.voicePitch;

      const voices = window.speechSynthesis.getVoices();
      if (this.mixerSettings.voiceName) {
        const match = voices.find(v => v.name === this.mixerSettings.voiceName);
        if (match) utterance.voice = match;
      } else {
        const preferred = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha'))));
        if (preferred) utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    }, delaySec * 1000);
  }
}

export const audioEngine = new StoryboardAudioEngine();
