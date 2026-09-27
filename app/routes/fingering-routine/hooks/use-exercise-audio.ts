// ════════════════════════════════════════════════════════
// useExerciseAudio – Audio playback for fingering exercises
// ════════════════════════════════════════════════════════
//
// Wraps soundfont-player to support both guitar and piano instruments.
// Lazy-loads the instrument on first use.

import { useCallback, useRef, useState } from "react";

type PlayNoteOptions = {
  duration?: number;
  gain?: number;
  delay?: number;
};

type InstrumentPlayer = {
  play: (
    note: string,
    when?: number,
    options?: { duration?: number; gain?: number },
  ) => void;
};

type SupportedInstrument = "guitar" | "piano";

const INSTRUMENT_NAMES: Record<SupportedInstrument, string> = {
  guitar: "acoustic_guitar_nylon",
  piano: "acoustic_grand_piano",
};

export function useExerciseAudio(instrument: SupportedInstrument = "guitar") {
  const contextRef = useRef<AudioContext | null>(null);
  const playerRef = useRef<InstrumentPlayer | null>(null);
  const currentInstrumentRef = useRef<SupportedInstrument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureReady = useCallback(
    async (inst?: SupportedInstrument) => {
      const target = inst ?? instrument;
      if (typeof window === "undefined") return false;

      // If already loaded for same instrument, reuse
      if (
        playerRef.current &&
        contextRef.current &&
        currentInstrumentRef.current === target
      ) {
        if (contextRef.current.state === "suspended") {
          await contextRef.current.resume();
        }
        return true;
      }

      try {
        setIsLoading(true);
        setError(null);

        if (!contextRef.current) {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          contextRef.current = new AudioCtx();
        }

        if (contextRef.current.state === "suspended") {
          await contextRef.current.resume();
        }

        const soundfont = await import("soundfont-player");
        const player = await soundfont.instrument(
          contextRef.current,
          INSTRUMENT_NAMES[target] as unknown as Parameters<
            typeof soundfont.instrument
          >[1],
          {
            soundfont: "MusyngKite" as unknown as "FluidR3_GM",
            format: "mp3",
            nameToUrl: (name: string, sf: string, format: string) =>
              `https://gleitz.github.io/midi-js-soundfonts/${sf}/${name}-${format || "mp3"}.js`,
          },
        );

        playerRef.current = player as unknown as InstrumentPlayer;
        currentInstrumentRef.current = target;
        setIsReady(true);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize audio",
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [instrument],
  );

  const playNote = useCallback(
    async (note: string, options: PlayNoteOptions = {}) => {
      const ok = await ensureReady();
      if (!ok || !contextRef.current || !playerRef.current) return;

      const when = contextRef.current.currentTime + (options.delay ?? 0);
      playerRef.current.play(note, when, {
        duration: options.duration ?? 1.2,
        gain: options.gain ?? 0.8,
      });
    },
    [ensureReady],
  );

  const playNoteSequence = useCallback(
    async (notes: Array<{ note: string; duration?: number }>, bpm: number) => {
      const ok = await ensureReady();
      if (!ok || !contextRef.current || !playerRef.current) return;

      const beatDuration = 60 / bpm;
      let offset = 0;

      for (const n of notes) {
        const when = contextRef.current.currentTime + offset;
        const dur = (n.duration ?? 1) * beatDuration;
        playerRef.current.play(n.note, when, {
          duration: dur * 0.9,
          gain: 0.8,
        });
        offset += dur;
      }
    },
    [ensureReady],
  );

  return {
    isReady,
    isLoading,
    error,
    ensureReady,
    playNote,
    playNoteSequence,
  };
}
