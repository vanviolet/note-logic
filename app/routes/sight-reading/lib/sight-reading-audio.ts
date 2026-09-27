// ════════════════════════════════════════════════════════
// Sight Reading Audio Player (Piano & Guitar with Synth Fallback)
// ════════════════════════════════════════════════════════

import { normalizeNoteName } from "~/shared/lib/music-utils";

type InstrumentType = "piano" | "guitar";

class SightReadingAudioEngine {
  private ctx: AudioContext | null = null;
  private soundfontPlayer: any = null;
  private currentInstrument: InstrumentType | null = null;
  private isLoading = false;

  private async getContext(): Promise<AudioContext | null> {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  public async loadInstrument(instrument: InstrumentType = "piano") {
    if (this.currentInstrument === instrument && this.soundfontPlayer) {
      return this.soundfontPlayer;
    }
    const ctx = await this.getContext();
    if (!ctx) return null;

    try {
      this.isLoading = true;
      const soundfont = await import("soundfont-player");
      const name =
        instrument === "piano"
          ? "acoustic_grand_piano"
          : "acoustic_guitar_nylon";
      const player = await soundfont.instrument(ctx, name, {
        soundfont: "MusyngKite",
        format: "mp3",
        nameToUrl: (n: string, sf: string, fmt: string) =>
          `https://gleitz.github.io/midi-js-soundfonts/${sf}/${n}-${fmt || "mp3"}.js`,
      });
      this.soundfontPlayer = player;
      this.currentInstrument = instrument;
      return player;
    } catch {
      // Fallback will be used if soundfont fails to load
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  public async playNote(
    noteName: string,
    octave: number = 4,
    instrument: InstrumentType = "piano",
    duration = 1.2,
    gain = 0.85,
  ) {
    const ctx = await this.getContext();
    if (!ctx) return;

    const normalized = normalizeNoteName(noteName.replace(/[0-9]/g, ""));
    const scientificNote = `${normalized}${octave}`;

    // Try soundfont first
    if (this.currentInstrument === instrument && this.soundfontPlayer) {
      try {
        this.soundfontPlayer.play(scientificNote, ctx.currentTime, {
          duration,
          gain,
        });
        return;
      } catch {
        // Fallback to synth
      }
    }

    // Trigger soundfont load in background if not ready
    if (!this.soundfontPlayer && !this.isLoading) {
      void this.loadInstrument(instrument);
    }

    // Immediate synth sound fallback
    this.playSynthNote(scientificNote, instrument, duration, gain);
  }

  private playSynthNote(
    scientificNote: string,
    instrument: InstrumentType,
    duration: number,
    gainVal: number,
  ) {
    if (!this.ctx) return;

    const match = scientificNote.match(/^([A-G][#b]?)(-?\d+)$/);
    if (!match) return;

    const naturalMap: Record<string, number> = {
      C: 0,
      "C#": 1,
      Db: 1,
      D: 2,
      "D#": 3,
      Eb: 3,
      E: 4,
      F: 5,
      "F#": 6,
      Gb: 6,
      G: 7,
      "G#": 8,
      Ab: 8,
      A: 9,
      "A#": 10,
      Bb: 10,
      B: 11,
    };

    const pc = naturalMap[match[1]] ?? 0;
    const oct = parseInt(match[2], 10);
    const midi = (oct + 1) * 12 + pc;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = instrument === "piano" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Warm harmonics for piano/guitar
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28 * gainVal, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  public playFeedbackSound(isCorrect: boolean) {
    if (isCorrect) {
      this.playNote("C", 5, "piano", 0.18, 0.6);
      setTimeout(() => this.playNote("E", 5, "piano", 0.18, 0.6), 70);
      setTimeout(() => this.playNote("G", 5, "piano", 0.35, 0.7), 140);
    } else {
      this.playNote("G#", 3, "piano", 0.22, 0.5);
      setTimeout(() => this.playNote("E", 3, "piano", 0.3, 0.5), 100);
    }
  }
}

export const sightReadingAudio = new SightReadingAudioEngine();
