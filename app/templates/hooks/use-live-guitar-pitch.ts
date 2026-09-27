import { useCallback, useEffect, useRef, useState } from "react";
import Pitchfinder from "pitchfinder";

const NOTE_NAMES_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

type PitchDetector = (buffer: Float32Array) => number | null;

export interface LivePitchFrame {
  frequency: number;
  smoothedFrequency: number;
  midi: number;
  cents: number;
  note: string;
  octave: number;
  confidence: number;
  timestamp: number;
}

interface UseLiveGuitarPitchOptions {
  onPitchFrame?: (frame: LivePitchFrame | null) => void;
  minFrequency?: number;
  maxFrequency?: number;
  rmsThreshold?: number;
  smoothingAlpha?: number;
  lockFrameCount?: number;
}

function midiToNote(midi: number) {
  const pitchClass = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return {
    note: NOTE_NAMES_SHARP[pitchClass],
    octave,
  };
}

function frequencyToMidiFloat(frequency: number) {
  return 69 + 12 * Math.log2(frequency / 440);
}

function computeRms(buffer: Float32Array) {
  let sum = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    const value = buffer[i];
    sum += value * value;
  }
  return Math.sqrt(sum / buffer.length);
}

export function useLiveGuitarPitch({
  onPitchFrame,
  minFrequency = 70,
  maxFrequency = 1400,
  rmsThreshold = 0.012,
  smoothingAlpha = 0.28,
  lockFrameCount = 3,
}: UseLiveGuitarPitchOptions = {}) {
  const contextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const highpassRef = useRef<BiquadFilterNode | null>(null);
  const lowpassRef = useRef<BiquadFilterNode | null>(null);
  const detectorRef = useRef<PitchDetector | null>(null);
  const frameBufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const lastSmoothedRef = useRef<number | null>(null);
  const candidateMidiRef = useRef<number | null>(null);
  const candidateCountRef = useRef(0);
  const lastEmitMidiRef = useRef<number | null>(null);
  const lastEmitAtRef = useRef(0);
  const lastHadPitchRef = useRef(false);

  const [isStarting, setIsStarting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    sourceRef.current?.disconnect();
    highpassRef.current?.disconnect();
    lowpassRef.current?.disconnect();
    analyserRef.current?.disconnect();

    sourceRef.current = null;
    highpassRef.current = null;
    lowpassRef.current = null;
    analyserRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (contextRef.current) {
      void contextRef.current.close();
      contextRef.current = null;
    }

    frameBufferRef.current = null;
    detectorRef.current = null;

    lastSmoothedRef.current = null;
    candidateMidiRef.current = null;
    candidateCountRef.current = 0;
    lastEmitMidiRef.current = null;
    lastEmitAtRef.current = 0;

    if (lastHadPitchRef.current) {
      onPitchFrame?.(null);
      lastHadPitchRef.current = false;
    }

    setIsListening(false);
  }, [onPitchFrame]);

  const runLoop = useCallback(() => {
    const analyser = analyserRef.current;
    const detector = detectorRef.current;
    const frameBuffer = frameBufferRef.current;

    if (!analyser || !detector || !frameBuffer) return;

    const tick = () => {
      const liveAnalyser = analyserRef.current;
      const liveDetector = detectorRef.current;
      const liveBuffer = frameBufferRef.current;

      if (!liveAnalyser || !liveDetector || !liveBuffer) return;

      liveAnalyser.getFloatTimeDomainData(liveBuffer);

      const rms = computeRms(liveBuffer);
      if (rms < rmsThreshold) {
        candidateMidiRef.current = null;
        candidateCountRef.current = 0;

        if (lastHadPitchRef.current) {
          const now = performance.now();
          if (now - lastEmitAtRef.current > 180) {
            onPitchFrame?.(null);
            lastHadPitchRef.current = false;
            lastEmitAtRef.current = now;
          }
        }

        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      const detectedFrequency = liveDetector(liveBuffer);
      if (
        !detectedFrequency ||
        Number.isNaN(detectedFrequency) ||
        detectedFrequency < minFrequency ||
        detectedFrequency > maxFrequency
      ) {
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      const prevSmooth = lastSmoothedRef.current ?? detectedFrequency;
      const smoothedFrequency =
        prevSmooth * (1 - smoothingAlpha) + detectedFrequency * smoothingAlpha;
      lastSmoothedRef.current = smoothedFrequency;

      const midiFloat = frequencyToMidiFloat(smoothedFrequency);
      const midi = Math.round(midiFloat);
      const cents = (midiFloat - midi) * 100;

      if (candidateMidiRef.current === midi) {
        candidateCountRef.current += 1;
      } else {
        candidateMidiRef.current = midi;
        candidateCountRef.current = 1;
      }

      if (candidateCountRef.current >= lockFrameCount) {
        const now = performance.now();
        const canEmit =
          lastEmitMidiRef.current !== midi || now - lastEmitAtRef.current > 120;

        if (canEmit) {
          const { note, octave } = midiToNote(midi);
          onPitchFrame?.({
            frequency: detectedFrequency,
            smoothedFrequency,
            midi,
            cents,
            note,
            octave,
            confidence: Math.min(1, rms / 0.08),
            timestamp: Date.now(),
          });

          lastEmitMidiRef.current = midi;
          lastEmitAtRef.current = now;
          lastHadPitchRef.current = true;
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, [
    lockFrameCount,
    maxFrequency,
    minFrequency,
    onPitchFrame,
    rmsThreshold,
    smoothingAlpha,
  ]);

  const start = useCallback(async () => {
    if (typeof window === "undefined") return false;
    if (isStarting || isListening) return true;

    try {
      setIsStarting(true);
      setError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: true,
          autoGainControl: false,
          channelCount: 1,
        },
      });

      const AudioCtx =
        window.AudioContext ||
        ((window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext as typeof AudioContext | undefined);

      if (!AudioCtx) {
        throw new Error("Web Audio API is not supported in this browser.");
      }

      const context = new AudioCtx();
      if (context.state === "suspended") {
        await context.resume();
      }

      const source = context.createMediaStreamSource(mediaStream);

      const highpass = context.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 60;
      highpass.Q.value = 0.7;

      const lowpass = context.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 1400;
      lowpass.Q.value = 0.8;

      const analyser = context.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.12;

      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(analyser);

      const detector = Pitchfinder.YIN({
        sampleRate: context.sampleRate,
        threshold: 0.12,
        probabilityThreshold: 0.85,
      });

      contextRef.current = context;
      streamRef.current = mediaStream;
      sourceRef.current = source;
      highpassRef.current = highpass;
      lowpassRef.current = lowpass;
      analyserRef.current = analyser;
      detectorRef.current = detector as PitchDetector;
      frameBufferRef.current = new Float32Array(
        analyser.fftSize,
      ) as Float32Array<ArrayBuffer>;

      setIsListening(true);
      runLoop();
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize microphone pitch detection.",
      );
      stop();
      return false;
    } finally {
      setIsStarting(false);
    }
  }, [isListening, isStarting, runLoop, stop]);

  useEffect(() => stop, [stop]);

  return {
    isStarting,
    isListening,
    error,
    start,
    stop,
  };
}
