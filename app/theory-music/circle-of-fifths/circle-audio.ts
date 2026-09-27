// ════════════════════════════════════════════════════════
// Circle of Fifths — Soundfont & High-Fidelity Audio Engine
// ════════════════════════════════════════════════════════
//
// Uses real acoustic grand piano and nylon guitar soundfonts via
// soundfont-player with accurate scientific pitch mapping (C3, E3, G3, B3, etc.)

import { NOTE_INDEX, ROOT_OCTAVES } from "~/theory-music/core";

type InstrumentPlayer = {
  play: (
    note: string,
    when?: number,
    options?: { duration?: number; gain?: number },
  ) => void;
  stop?: () => void;
};

class CircleAudioEngine {
  private ctx: AudioContext | null = null;
  private pianoPlayer: InstrumentPlayer | null = null;
  private guitarPlayer: InstrumentPlayer | null = null;
  private isMuted: boolean = false;
  private isInitializing: boolean = false;

  private async ensureAudioContext() {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    return this.ctx;
  }

  /**
   * Load SoundFont for realistic grand piano and guitar
   */
  public async ensurePlayer(instrumentType: "piano" | "guitar" = "piano"): Promise<InstrumentPlayer | null> {
    if (instrumentType === "piano" && this.pianoPlayer) return this.pianoPlayer;
    if (instrumentType === "guitar" && this.guitarPlayer) return this.guitarPlayer;

    const ctx = await this.ensureAudioContext();
    if (!ctx) return null;

    try {
      this.isInitializing = true;
      const soundfont = await import("soundfont-player");
      const instrumentName =
        instrumentType === "piano" ? "acoustic_grand_piano" : "acoustic_guitar_nylon";

      const player = await soundfont.instrument(ctx, instrumentName, {
        soundfont: "MusyngKite" as unknown as "FluidR3_GM",
        format: "mp3",
        nameToUrl: (name: string, sf: string, format: string) =>
          `https://gleitz.github.io/midi-js-soundfonts/${sf}/${name}-${format || "mp3"}.js`,
      });

      if (instrumentType === "piano") {
        this.pianoPlayer = player as unknown as InstrumentPlayer;
        return this.pianoPlayer;
      } else {
        this.guitarPlayer = player as unknown as InstrumentPlayer;
        return this.guitarPlayer;
      }
    } catch (err) {
      console.warn("Soundfont load error, using WebAudio fallback", err);
      return null;
    } finally {
      this.isInitializing = false;
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  /**
   * Normalize note to valid scientific pitch for soundfont (e.g. "C" -> "C4", "F#" -> "F#4", "Bb" -> "Bb3")
   */
  public normalizeNoteToScientific(noteName: string, defaultOctave: number = 4): string {
    const clean = noteName.trim();
    // If it already has an octave number (e.g. "C4", "G#3")
    const match = clean.match(/^([A-Ga-g][#b♭♯]?)(-?\d+)$/);
    if (match) {
      const name = match[1].replace("♯", "#").replace("♭", "b");
      return `${name.toUpperCase()}${match[2]}`;
    }

    const name = clean.replace("♯", "#").replace("♭", "b").toUpperCase();
    return `${name}${defaultOctave}`;
  }

  /**
   * Play a single note using realistic Grand Piano SoundFont
   */
  public async playNote(
    note: string,
    octave: number = 4,
    duration: number = 1.6,
    gain: number = 0.9,
    instrument: "piano" | "guitar" = "piano",
  ) {
    if (this.isMuted) return;

    const scientificNote = this.normalizeNoteToScientific(note, octave);
    const player = await this.ensurePlayer(instrument);

    if (player && this.ctx) {
      player.play(scientificNote, this.ctx.currentTime, {
        duration,
        gain,
      });
      return;
    }

    // Fallback: Web Audio Synth oscillator
    this.playSynthFallback(scientificNote, duration, gain);
  }

  /**
   * Play chord with realistic piano/guitar voicing
   */
  public async playChord(
    notes: string[],
    options: {
      type?: "block" | "strum" | "arpeggio";
      baseOctave?: number;
      duration?: number;
      speed?: number;
      instrument?: "piano" | "guitar";
    } = {},
  ) {
    if (this.isMuted || notes.length === 0) return;

    const {
      type = "strum",
      baseOctave = 3,
      duration = 2.4,
      speed = 0.035,
      instrument = "piano",
    } = options;

    const player = await this.ensurePlayer(instrument);
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    // Convert notes into logical ascending pitch sequence (e.g. C3, E3, G3, B3 or C3, G3, E4, G4)
    let currentOctave = baseOctave;
    let lastPc = -1;

    const scientificNotes: string[] = [];
    notes.forEach((n) => {
      const cleanNote = n.replace(/[0-9]/g, "");
      const pc = NOTE_INDEX[cleanNote] ?? 0;
      if (lastPc !== -1 && pc <= lastPc) {
        currentOctave += 1;
      }
      lastPc = pc;
      scientificNotes.push(this.normalizeNoteToScientific(cleanNote, currentOctave));
    });

    const startTime = ctx.currentTime;

    scientificNotes.forEach((sciNote, idx) => {
      const delay = type === "block" ? 0 : type === "strum" ? idx * speed : idx * 0.16;
      const noteGain = type === "block" ? 0.75 : 0.85;

      if (player) {
        player.play(sciNote, startTime + delay, {
          duration,
          gain: noteGain,
        });
      } else {
        setTimeout(() => {
          this.playSynthFallback(sciNote, duration, noteGain);
        }, delay * 1000);
      }
    });
  }

  /**
   * Play a sequential note sequence (melodic interval / arpeggio)
   */
  public async playNoteSequence(notes: string[], gapSeconds: number = 0.35) {
    if (this.isMuted || notes.length === 0) return;
    notes.forEach((note, idx) => {
      setTimeout(() => {
        this.playNote(note, 4, 1.2, 0.85);
      }, idx * gapSeconds * 1000);
    });
  }

  /**
   * Play scale ascending with smooth musical timing
   */
  public async playScale(
    notes: string[],
    speed: number = 0.22,
    baseOctave: number = 4,
    instrument: "piano" | "guitar" = "piano",
  ) {
    if (this.isMuted || notes.length === 0) return;

    const player = await this.ensurePlayer(instrument);
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    let currentOctave = baseOctave;
    let lastPc = -1;

    const scaleRun = [...notes, notes[0]]; // Include top tonic octave
    const startTime = ctx.currentTime;

    scaleRun.forEach((note, idx) => {
      const clean = note.replace(/[0-9]/g, "");
      const pc = NOTE_INDEX[clean] ?? 0;
      if (lastPc !== -1 && pc <= lastPc) {
        currentOctave += 1;
      }
      lastPc = pc;

      const sciNote = this.normalizeNoteToScientific(clean, currentOctave);
      const delay = idx * speed;

      if (player) {
        player.play(sciNote, startTime + delay, {
          duration: 0.8,
          gain: 0.8,
        });
      } else {
        setTimeout(() => {
          this.playSynthFallback(sciNote, 0.6, 0.8);
        }, delay * 1000);
      }
    });
  }

  /**
   * Play cadence chords sequence (e.g. I -> IV -> V -> I)
   */
  public async playCadenceChords(
    chordsNotes: string[][],
    bpm: number = 100,
    onStep?: (index: number) => void,
  ) {
    if (this.isMuted) return;
    const secondsPerBeat = 60 / bpm;
    const durationPerChord = secondsPerBeat * 2;

    chordsNotes.forEach((notes, idx) => {
      setTimeout(() => {
        onStep?.(idx);
        this.playChord(notes, {
          type: "strum",
          baseOctave: 3,
          duration: durationPerChord * 0.95,
          speed: 0.035,
          instrument: "piano",
        });
      }, idx * durationPerChord * 1000);
    });
  }

  /**
   * Chime & Tone helpers for interactive quiz
   */
  public playSuccessChime() {
    this.playNote("C5", 5, 0.2, 0.7);
    setTimeout(() => this.playNote("E5", 5, 0.2, 0.7), 80);
    setTimeout(() => this.playNote("G5", 5, 0.4, 0.8), 160);
  }

  public playErrorTone() {
    this.playNote("A3", 3, 0.25, 0.6);
    setTimeout(() => this.playNote("Eb3", 3, 0.35, 0.6), 120);
  }

  /**
   * Fallback Web Audio Synth
   */
  private playSynthFallback(scientificNote: string, duration: number, gainVal: number) {
    if (!this.ctx || this.isMuted) return;

    const match = scientificNote.match(/^([A-G][#b]?)(-?\d+)$/);
    if (!match) return;

    const pc = NOTE_INDEX[match[1]] ?? 0;
    const oct = Number(match[2]);
    const midi = (oct + 1) * 12 + pc;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25 * gainVal, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }
}

export const circleAudio = new CircleAudioEngine();
