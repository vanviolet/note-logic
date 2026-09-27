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

export function useGuitarAudio() {
  const contextRef = useRef<AudioContext | null>(null);
  const instrumentRef = useRef<InstrumentPlayer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureReady = useCallback(async () => {
    if (typeof window === "undefined") return false;
    if (instrumentRef.current && contextRef.current) {
      if (contextRef.current.state === "suspended") {
        await contextRef.current.resume();
      }
      return true;
    }

    try {
      setIsLoading(true);
      setError(null);

      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioCtx();
      contextRef.current = context;

      if (context.state === "suspended") {
        await context.resume();
      }

      const soundfont = await import("soundfont-player");
      const instrument = await soundfont.instrument(
        context,
        "acoustic_guitar_nylon",
        {
          soundfont: "MusyngKite",
          format: "mp3",
          nameToUrl: (name: string, sf: string, format: string) =>
            `https://gleitz.github.io/midi-js-soundfonts/${sf}/${name}-${format || "mp3"}.js`,
        },
      );

      instrumentRef.current = instrument as InstrumentPlayer;
      setIsReady(true);
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize guitar audio",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playNote = useCallback(
    async (note: string, options: PlayNoteOptions = {}) => {
      const ok = await ensureReady();
      if (!ok || !contextRef.current || !instrumentRef.current) return;

      const when = contextRef.current.currentTime + (options.delay ?? 0);
      instrumentRef.current.play(note, when, {
        duration: options.duration ?? 1.8,
        gain: options.gain ?? 1,
      });
    },
    [ensureReady],
  );

  const playStrum = useCallback(
    async (notes: string[], downStroke = true) => {
      const seq = downStroke ? [...notes] : [...notes].reverse();
      for (let i = 0; i < seq.length; i += 1) {
        await playNote(seq[i], {
          duration: 2.2,
          gain: Math.max(0.35, 0.95 - i * 0.08),
          delay: i * 0.03,
        });
      }
    },
    [playNote],
  );

  return {
    isReady,
    isLoading,
    error,
    ensureReady,
    playNote,
    playStrum,
  };
}
