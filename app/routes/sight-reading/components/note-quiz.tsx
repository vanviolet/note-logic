// ════════════════════════════════════════════════════════
// NoteQuiz – Interactive Note Identification Quiz
// ════════════════════════════════════════════════════════
//
// Supports 3 answering modes:
// 1. Multiple Choice (Pilihan Ganda)
// 2. Interactive Piano Keyboard (Tuts Piano)
// 3. Interactive Guitar Fretboard (Fretboard Gitar)
//
// Features:
// - Strict pitch & octave accuracy (e.g. D3 != D5)
// - Soundfont audio engine (from useGuitarAudio)
// - Live Microphone detection (Play real piano or guitar)
// - When wrong: Does NOT auto-advance; provides Next button,
//   Retry button, and in-depth "Kenapa Salah & Cara Membaca" guide.
// ════════════════════════════════════════════════════════

import { memo, useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Trophy,
  Star,
  ThumbsUp,
  Dumbbell,
  Check,
  X,
  Keyboard,
  Guitar,
  ListFilter,
  Sparkles,
  RotateCcw,
  Volume2,
  Mic,
  MicOff,
  Radio,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { StaffRenderer } from "./staff-renderer";
import { Fretboard, type FretboardNote } from "~/templates/components/custom/fretboard";
import { Piano, type PianoNote } from "~/templates/components/custom/piano";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { Progress } from "~/templates/components/ui/progress";
import { useGuitarAudio, useLiveGuitarPitch, type LivePitchFrame } from "~/templates/hooks";
import { normalizeNoteName } from "~/shared/lib/music-utils";
import {
  generateNoteQuiz,
  getClefForNote,
  getNoteExplanation,
  type NoteExplanation,
} from "../lib/note-data";
import type { LessonTopic, QuizState, ClefType, QuizInputMode } from "../types";
import { cn } from "~/templates/lib/utils";

// ── Props ──────────────────────────────────────────────

interface NoteQuizProps {
  topic: LessonTopic;
  questionCount?: number;
  initialMode?: QuizInputMode;
  onBack: () => void;
}

interface WrongSelectionInfo {
  noteName: string;
  octave: number;
  displayName: string;
  isSameLetterWrongOctave: boolean;
  stringIndex?: number;
  fret?: number;
}

// ── Main Component ─────────────────────────────────────

export const NoteQuiz = memo(function NoteQuiz({
  topic,
  questionCount = 10,
  initialMode = "choice",
  onBack,
}: NoteQuizProps) {
  const [mode, setMode] = useState<QuizInputMode>(initialMode);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Stored wrong answer details for explanation
  const [wrongSelection, setWrongSelection] = useState<WrongSelectionInfo | null>(null);

  // Answering state per mode
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activePianoNote, setActivePianoNote] = useState<{ midi: number } | null>(null);
  const [activeFretNote, setActiveFretNote] = useState<{ stringIndex: number; fret: number } | null>(null);

  // Live pitch display state
  const [detectedLivePitch, setDetectedLivePitch] = useState<{
    note: string;
    octave: number;
    frequency: number;
  } | null>(null);

  // Audio player (soundfont audio as in chord page)
  const { ensureReady, isReady, isLoading, playNote } = useGuitarAudio();

  // Play audio note helper
  const playSound = useCallback(
    (noteName: string, octave: number) => {
      if (!isReady && !isLoading) ensureReady();
      playNote(`${normalizeNoteName(noteName)}${octave}`, {
        duration: 2,
        gain: 0.95,
      });
    },
    [ensureReady, isReady, isLoading, playNote],
  );

  // Sync mode if initialMode changes
  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  // Start / restart quiz
  const startQuiz = useCallback(
    (newMode?: QuizInputMode) => {
      if (newMode) setMode(newMode);
      const questions = generateNoteQuiz(
        topic.noteRange,
        questionCount,
        topic.clef,
      );
      setQuiz({
        questions,
        currentIdx: 0,
        score: 0,
        answers: new Array(questions.length).fill(null),
        isComplete: false,
        startedAt: Date.now(),
      });
      setFeedback(null);
      setFeedbackText(null);
      setShowExplanation(false);
      setWrongSelection(null);
      setSelectedIdx(null);
      setActivePianoNote(null);
      setActiveFretNote(null);
    },
    [topic, questionCount],
  );

  // Initialize on mount
  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const currentQuestion = quiz?.questions[quiz.currentIdx] ?? null;

  const currentClef = useMemo<ClefType>(() => {
    if (!currentQuestion) return topic.clef;
    if (topic.id === "grand-staff") {
      return getClefForNote(currentQuestion.note);
    }
    return topic.clef;
  }, [currentQuestion, topic]);

  // Pre-calculate explanation for the current question note
  const currentExplanation = useMemo<NoteExplanation | null>(() => {
    if (!currentQuestion) return null;
    return getNoteExplanation(currentQuestion.note, currentClef);
  }, [currentQuestion, currentClef]);

  // Determine piano octave configuration based on clef and question
  const pianoConfig = useMemo(() => {
    if (topic.clef === "bass") {
      return { startOctave: 2, octaveCount: 3 }; // C2 to B4
    }
    if (topic.id === "grand-staff") {
      return { startOctave: 2, octaveCount: 4 }; // C2 to B5
    }
    return { startOctave: 3, octaveCount: 3 }; // C3 to B5 (covers C4 to A5)
  }, [topic]);

  // ── Advance to next question ─────────────────────────
  const nextQuestion = useCallback(() => {
    setQuiz((prev) => {
      if (!prev) return prev;
      const nextIdx = prev.currentIdx + 1;
      const isComplete = nextIdx >= prev.questions.length;

      return {
        ...prev,
        currentIdx: isComplete ? prev.currentIdx : nextIdx,
        isComplete,
      };
    });
    setFeedback(null);
    setFeedbackText(null);
    setShowExplanation(false);
    setWrongSelection(null);
    setSelectedIdx(null);
    setActivePianoNote(null);
    setActiveFretNote(null);
  }, []);

  // ── Retry current question ───────────────────────────
  const retryCurrentQuestion = useCallback(() => {
    setFeedback(null);
    setFeedbackText(null);
    setShowExplanation(false);
    setWrongSelection(null);
    setSelectedIdx(null);
    setActivePianoNote(null);
    setActiveFretNote(null);
  }, []);

  // ── Handle Multiple Choice Answer ────────────────────
  const handleChoiceAnswer = useCallback(
    (answerIdx: number) => {
      if (!quiz || !currentQuestion || feedback) return;
      setSelectedIdx(answerIdx);

      const isCorrect = answerIdx === currentQuestion.correctIdx;
      const targetNote = currentQuestion.note;
      const selectedOptionText = currentQuestion.options[answerIdx];

      setQuiz((prev) => {
        if (!prev) return prev;
        const newAnswers = [...prev.answers];
        newAnswers[prev.currentIdx] = answerIdx;
        return {
          ...prev,
          answers: newAnswers,
          score: prev.score + (isCorrect ? 1 : 0),
        };
      });

      setFeedback(isCorrect ? "correct" : "wrong");
      playSound(targetNote.noteName, targetNote.octave);

      if (isCorrect) {
        setFeedbackText(`Benar! Not ${targetNote.displayName}`);
        // If correct, auto advance smoothly after short delay
        setTimeout(() => {
          nextQuestion();
        }, 1200);
      } else {
        const parsedMatch = selectedOptionText.match(/^([A-Ga-g][#b]?)(\d*)$/);
        const optLetter = parsedMatch ? parsedMatch[1] : selectedOptionText;
        const optOctave = parsedMatch && parsedMatch[2] ? parseInt(parsedMatch[2], 10) : targetNote.octave;

        setWrongSelection({
          noteName: optLetter,
          octave: optOctave,
          displayName: selectedOptionText,
          isSameLetterWrongOctave: optLetter === targetNote.noteName && optOctave !== targetNote.octave,
        });

        setFeedbackText(
          `Salah — Kamu memilih "${selectedOptionText}". Not yang benar adalah ${targetNote.displayName}.`,
        );
      }
    },
    [quiz, currentQuestion, feedback, playSound, nextQuestion],
  );

  // ── Handle Piano Answer (Strict Pitch & Octave) ──────
  const handlePianoAnswer = useCallback(
    (pianoNote: PianoNote) => {
      if (!quiz || !currentQuestion || feedback) return;

      setActivePianoNote({ midi: pianoNote.midi });

      // Strict match: Note name AND octave MUST match!
      const targetNote = currentQuestion.note;
      const isExactMatch =
        pianoNote.note === targetNote.noteName &&
        pianoNote.octave === targetNote.octave;

      const isCorrect = isExactMatch;

      setQuiz((prev) => {
        if (!prev) return prev;
        const newAnswers = [...prev.answers];
        newAnswers[prev.currentIdx] = isCorrect ? currentQuestion.correctIdx : -1;
        return {
          ...prev,
          answers: newAnswers,
          score: prev.score + (isCorrect ? 1 : 0),
        };
      });

      setFeedback(isCorrect ? "correct" : "wrong");
      playSound(pianoNote.note, pianoNote.octave);

      if (isCorrect) {
        setFeedbackText(`Benar! Not ${targetNote.displayName}`);
        setTimeout(() => {
          nextQuestion();
        }, 1200);
      } else {
        const isSameLetterWrongOctave = pianoNote.note === targetNote.noteName;
        setWrongSelection({
          noteName: pianoNote.note,
          octave: pianoNote.octave,
          displayName: `${pianoNote.note}${pianoNote.octave}`,
          isSameLetterWrongOctave,
        });

        if (isSameLetterWrongOctave) {
          setFeedbackText(
            `Salah Oktaf! Kamu menekan ${pianoNote.note}${pianoNote.octave} (Oktaf ${pianoNote.octave}) — Not pada paranada adalah ${targetNote.displayName} (Oktaf ${targetNote.octave}).`,
          );
        } else {
          setFeedbackText(
            `Kurang Tepat! Kamu menekan ${pianoNote.note}${pianoNote.octave} — Not yang benar adalah ${targetNote.displayName}.`,
          );
        }
      }
    },
    [quiz, currentQuestion, feedback, playSound, nextQuestion],
  );

  // ── Handle Fretboard Answer (Strict Pitch & Octave) ──
  const handleFretboardAnswer = useCallback(
    (fretNote: FretboardNote) => {
      if (!quiz || !currentQuestion || feedback) return;

      setActiveFretNote({
        stringIndex: fretNote.stringIndex,
        fret: fretNote.fret,
      });

      const targetNote = currentQuestion.note;
      const isExactMatch =
        fretNote.note === targetNote.noteName &&
        (fretNote.octave === targetNote.octave || fretNote.midi === targetNote.midi);

      const isCorrect = isExactMatch;

      setQuiz((prev) => {
        if (!prev) return prev;
        const newAnswers = [...prev.answers];
        newAnswers[prev.currentIdx] = isCorrect ? currentQuestion.correctIdx : -1;
        return {
          ...prev,
          answers: newAnswers,
          score: prev.score + (isCorrect ? 1 : 0),
        };
      });

      setFeedback(isCorrect ? "correct" : "wrong");
      playSound(fretNote.note, fretNote.octave);

      if (isCorrect) {
        setFeedbackText(
          `Benar! Not ${targetNote.displayName} pada Senar ${
            fretNote.stringIndex + 1
          } (Fret ${fretNote.fret === 0 ? "Open" : fretNote.fret})`,
        );
        setTimeout(() => {
          nextQuestion();
        }, 1200);
      } else {
        const isSameLetterWrongOctave = fretNote.note === targetNote.noteName;
        setWrongSelection({
          noteName: fretNote.note,
          octave: fretNote.octave,
          displayName: `${fretNote.note}${fretNote.octave}`,
          isSameLetterWrongOctave,
          stringIndex: fretNote.stringIndex,
          fret: fretNote.fret,
        });

        if (isSameLetterWrongOctave) {
          setFeedbackText(
            `Salah Oktaf! Kamu memilih Senar ${fretNote.stringIndex + 1} Fret ${
              fretNote.fret
            } (${fretNote.note}${fretNote.octave}) — Not yang benar adalah ${
              targetNote.displayName
            }.`,
          );
        } else {
          setFeedbackText(
            `Kurang Tepat! Kamu memilih Senar ${fretNote.stringIndex + 1} Fret ${
              fretNote.fret
            } (${fretNote.note}${fretNote.octave}) — Posisi not ${
              targetNote.displayName
            } disorot di fretboard.`,
          );
        }
      }
    },
    [quiz, currentQuestion, feedback, playSound, nextQuestion],
  );

  // ── Live Microphone Detection Callback ────────────────
  const lastDetectedRef = useRef<{ midi: number; at: number } | null>(null);

  const handleLivePitchFrame = useCallback(
    (frame: LivePitchFrame | null) => {
      if (!frame) {
        setDetectedLivePitch(null);
        return;
      }

      setDetectedLivePitch({
        note: frame.note,
        octave: frame.octave,
        frequency: Math.round(frame.frequency * 10) / 10,
      });

      if (!quiz || feedback || !currentQuestion) return;

      // Throttle rapid triggers
      const now = Date.now();
      if (
        lastDetectedRef.current &&
        lastDetectedRef.current.midi === frame.midi &&
        now - lastDetectedRef.current.at < 1200
      ) {
        return;
      }

      lastDetectedRef.current = { midi: frame.midi, at: now };

      if (mode === "piano") {
        handlePianoAnswer({
          note: frame.note,
          octave: frame.octave,
          midi: frame.midi,
          pitchClass: ((frame.midi % 12) + 12) % 12,
          isBlack: frame.note.includes("#"),
        });
      } else if (mode === "fretboard") {
        handleFretboardAnswer({
          stringIndex: 0,
          fret: 0,
          note: frame.note,
          octave: frame.octave,
          midi: frame.midi,
          pitchClass: ((frame.midi % 12) + 12) % 12,
        });
      } else {
        const targetNote = currentQuestion.note;
        const isMatch =
          frame.note === targetNote.noteName && frame.octave === targetNote.octave;
        const optIdx = currentQuestion.options.findIndex(
          (o) => o === `${frame.note}${frame.octave}` || o === frame.note,
        );

        if (isMatch) {
          handleChoiceAnswer(currentQuestion.correctIdx);
        } else if (optIdx !== -1) {
          handleChoiceAnswer(optIdx);
        } else {
          // Note detected by mic was wrong and not among the 4 options
          const isSameLetterWrongOctave =
            frame.note === targetNote.noteName && frame.octave !== targetNote.octave;

          setWrongSelection({
            noteName: frame.note,
            octave: frame.octave,
            displayName: `${frame.note}${frame.octave}`,
            isSameLetterWrongOctave,
          });

          setQuiz((prev) => {
            if (!prev) return prev;
            const newAnswers = [...prev.answers];
            newAnswers[prev.currentIdx] = -1;
            return {
              ...prev,
              answers: newAnswers,
            };
          });

          setFeedback("wrong");
          playSound(frame.note, frame.octave);
          setFeedbackText(
            isSameLetterWrongOctave
              ? `Salah Oktaf! Mikrofon mendeteksi ${frame.note}${frame.octave} — Not yang benar adalah ${targetNote.displayName}.`
              : `Salah — Mikrofon mendeteksi nada ${frame.note}${frame.octave}. Not yang benar pada paranada adalah ${targetNote.displayName}.`,
          );
        }
      }
    },
    [
      quiz,
      feedback,
      currentQuestion,
      mode,
      handlePianoAnswer,
      handleFretboardAnswer,
      handleChoiceAnswer,
      playSound,
    ],
  );

  const {
    start: startLiveMic,
    stop: stopLiveMic,
    isListening,
    isStarting,
    error: micError,
  } = useLiveGuitarPitch({
    onPitchFrame: handleLivePitchFrame,
    rmsThreshold: 0.003,
    smoothingAlpha: 0.32,
    lockFrameCount: 2,
  });

  // Stop mic on unmount
  useEffect(() => {
    return () => {
      stopLiveMic();
    };
  }, [stopLiveMic]);

  if (!quiz) return null;

  // ── Result Screen ────────────────────────────────────

  if (quiz.isComplete) {
    const elapsed = Math.round((Date.now() - quiz.startedAt) / 1000);
    const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
    const grade =
      percentage >= 90
        ? "Sempurna!"
        : percentage >= 70
          ? "Bagus Sekali!"
          : percentage >= 50
            ? "Cukup Baik"
            : "Perlu Latihan Lagi";
    const gradeColor =
      percentage >= 90
        ? "text-emerald-500"
        : percentage >= 70
          ? "text-blue-500"
          : percentage >= 50
            ? "text-amber-500"
            : "text-red-500";

    const modeLabels: Record<QuizInputMode, string> = {
      choice: "Pilihan Ganda",
      piano: "Piano Keyboard",
      fretboard: "Fretboard Gitar",
    };

    return (
      <div className="mx-auto max-w-xl space-y-6 text-center py-8">
        <div className="space-y-2">
          <div className="flex justify-center">
            {percentage >= 90 ? (
              <Trophy className="size-14 text-emerald-500 animate-bounce" />
            ) : percentage >= 70 ? (
              <Star className="size-14 text-blue-500" />
            ) : percentage >= 50 ? (
              <ThumbsUp className="size-14 text-amber-500" />
            ) : (
              <Dumbbell className="size-14 text-red-500" />
            )}
          </div>
          <h2 className={cn("text-3xl font-bold", gradeColor)}>{grade}</h2>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline">{topic.title}</Badge>
            <Badge variant="secondary">{modeLabels[mode]}</Badge>
            {isListening && (
              <Badge className="bg-emerald-500 text-white gap-1">
                <Mic className="size-3" /> Live Mic
              </Badge>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/60 p-6 space-y-4 shadow-sm backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-extrabold text-foreground">{quiz.score}</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Benar</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-foreground">{quiz.questions.length}</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Total Soal</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-foreground">{elapsed}s</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Waktu</p>
            </div>
          </div>
          <Progress value={percentage} className="h-3" />
          <p className="text-lg font-bold">{percentage}% Akurasi</p>
        </div>

        {/* Answer Review */}
        <div className="space-y-2.5 text-left">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Review Hasil Soal
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {quiz.questions.map((q, i) => {
              const answered = quiz.answers[i];
              const isCorrect = answered === q.correctIdx;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs transition-colors",
                    isCorrect
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
                  )}
                >
                  <span className="font-mono font-bold text-sm">
                    {q.note.displayName}
                  </span>
                  <span className="mt-1 flex items-center gap-0.5 text-[10px] font-medium">
                    {isCorrect ? (
                      <>
                        <Check className="size-3 text-emerald-500 shrink-0" />
                        <span>Benar</span>
                      </>
                    ) : (
                      <>
                        <X className="size-3 text-red-500 shrink-0" />
                        <span>Salah</span>
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action / Mode Switch Buttons */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={() => startQuiz(mode)} className="gap-2">
              <RotateCcw className="size-4" /> Ulangi ({modeLabels[mode]})
            </Button>
            {mode !== "piano" && (
              <Button
                variant="outline"
                onClick={() => startQuiz("piano")}
                className="gap-2"
              >
                <Keyboard className="size-4 text-primary" /> Coba Mode Piano
              </Button>
            )}
            {mode !== "fretboard" && (
              <Button
                variant="outline"
                onClick={() => startQuiz("fretboard")}
                className="gap-2"
              >
                <Guitar className="size-4 text-amber-500" /> Coba Mode Fretboard
              </Button>
            )}
            {mode !== "choice" && (
              <Button
                variant="outline"
                onClick={() => startQuiz("choice")}
                className="gap-2"
              >
                <ListFilter className="size-4" /> Pilihan Ganda
              </Button>
            )}
          </div>
          <div>
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Pilih Topik Lain
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz Screen ──────────────────────────────────────

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="flex items-center gap-1 w-fit bg-card"
            >
              <topic.icon className="size-3 text-primary" />
              {topic.title}
            </Badge>
            <Badge variant="secondary" className="text-[10px] capitalize">
              {currentClef} clef
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Soal <span className="font-bold text-foreground">{quiz.currentIdx + 1}</span> dari{" "}
            {quiz.questions.length}
          </p>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center gap-1.5 rounded-lg border bg-muted/40 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode("choice")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all",
              mode === "choice"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Mode Pilihan Ganda"
          >
            <ListFilter className="size-3.5" />
            <span className="hidden sm:inline">Pilihan Ganda</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("piano")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all",
              mode === "piano"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Mode Piano Virtual"
          >
            <Keyboard className="size-3.5 text-primary" />
            <span>Piano</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("fretboard")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all",
              mode === "fretboard"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Mode Gitar Fretboard"
          >
            <Guitar className="size-3.5 text-amber-500" />
            <span>Fretboard</span>
          </button>
        </div>

        {/* Score display */}
        <div className="hidden sm:block text-right">
          <p className="text-xl font-black text-primary">{quiz.score}</p>
          <p className="text-[10px] text-muted-foreground uppercase font-medium">Skor</p>
        </div>
      </div>

      {/* Live Microphone Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/60 p-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={isListening ? "secondary" : "outline"}
            size="sm"
            onClick={() => {
              if (isListening) {
                stopLiveMic();
                setDetectedLivePitch(null);
              } else {
                void startLiveMic();
              }
            }}
            disabled={isStarting}
            className={cn(
              "gap-1.5 font-semibold text-xs transition-all",
              isListening &&
                "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
            )}
          >
            {isListening ? (
              <>
                <Mic className="size-3.5 text-emerald-500 animate-pulse" />
                <span>Stop Live Mic</span>
              </>
            ) : isStarting ? (
              <>
                <Radio className="size-3.5 animate-spin" />
                <span>Menghubungkan Mic...</span>
              </>
            ) : (
              <>
                <MicOff className="size-3.5 text-muted-foreground" />
                <span>Start Live Mic</span>
              </>
            )}
          </Button>

          <span className="text-xs text-muted-foreground">
            {isListening ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Mendengarkan piano / gitar aslimu... Mainkan nada untuk menjawab!
              </span>
            ) : (
              "Aktifkan Live Mic untuk menjawab langsung menggunakan piano atau gitar asli"
            )}
          </span>
        </div>

        {/* Live Detected Note Indicator */}
        {isListening && detectedLivePitch && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 animate-in fade-in">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
              Nada Terdeteksi:
            </span>
            <Badge variant="secondary" className="font-mono font-bold text-xs bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              {detectedLivePitch.note}
              {detectedLivePitch.octave}
            </Badge>
            <span className="text-[10px] font-mono text-muted-foreground">
              {detectedLivePitch.frequency} Hz
            </span>
          </div>
        )}

        {micError && (
          <span className="text-xs text-destructive font-medium">
            Error Mic: {micError}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <Progress
        value={((quiz.currentIdx + 1) / quiz.questions.length) * 100}
        className="h-2"
      />

      {/* Question Card: Staff rendering */}
      {currentQuestion && (
        <div className="flex flex-col items-center gap-5">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-xs font-medium text-muted-foreground">
                Baca notasi berikut:
              </span>
              <span className="text-[11px] font-mono text-muted-foreground/80 flex items-center gap-1">
                <Volume2 className="size-3 text-primary" />
                {mode === "fretboard"
                  ? "Pilih senar & fret"
                  : mode === "piano"
                    ? "Tekan tuts piano"
                    : "Pilih jawaban"}
              </span>
            </div>

            <div className="flex justify-center my-2">
              <StaffRenderer
                note={currentQuestion.note}
                clef={currentClef}
                width={240}
                height={150}
                highlightColor={
                  feedback === "correct"
                    ? "hsl(142, 76%, 36%)"
                    : feedback === "wrong"
                      ? "hsl(0, 84%, 60%)"
                      : undefined
                }
              />
            </div>

            {/* Prompt guideline */}
            <p className="text-xs text-muted-foreground/90 font-medium">
              {mode === "choice" && "Pilih nama not balok yang tepat di bawah:"}
              {mode === "piano" && "Klik tuts piano yang tepat (sesuai oktaf):"}
              {mode === "fretboard" && "Klik posisi fret pada senar gitar yang sesuai:"}
            </p>
          </div>

          {/* ── WRONG / CORRECT FEEDBACK & CONTROLS ──────── */}
          {feedback && feedbackText && (
            <div className="w-full max-w-2xl space-y-3 animate-in fade-in zoom-in-95">
              {/* Status banner */}
              <div
                className={cn(
                  "rounded-xl border p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                  feedback === "correct"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
                )}
              >
                <div className="flex items-start gap-2.5">
                  {feedback === "correct" ? (
                    <Check className="size-5 shrink-0 text-emerald-500 mt-0.5" />
                  ) : (
                    <X className="size-5 shrink-0 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-bold">{feedbackText}</p>
                    {feedback === "wrong" && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Pelajari letak not pada paranada di bawah atau klik tombol untuk penjelasan lengkap.
                      </p>
                    )}
                  </div>
                </div>

                {/* Next & Retry Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {feedback === "wrong" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={retryCurrentQuestion}
                      className="gap-1.5 text-xs h-8 border-red-500/30 hover:bg-red-500/10"
                    >
                      <RefreshCw className="size-3.5" />
                      Coba Lagi
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant={feedback === "correct" ? "default" : "default"}
                    size="sm"
                    onClick={nextQuestion}
                    className="gap-1.5 text-xs h-8 font-semibold shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* ── "KENAPA SALAH & CARA MEMPERBAIKINYA" BUTTON & PANEL ── */}
              {feedback === "wrong" && currentExplanation && (
                <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setShowExplanation((prev) => !prev)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-foreground">
                      <HelpCircle className="size-4 text-primary shrink-0" />
                      <span>
                        Kenapa Salah & Bagaimana Cara Membacanya? ({currentQuestion.note.displayName})
                      </span>
                    </span>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="text-[11px] font-normal">
                        {showExplanation ? "Sembunyikan" : "Buka Penjelasan"}
                      </span>
                      {showExplanation ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </div>
                  </button>

                  {/* Collapsible content */}
                  {showExplanation && (
                    <div className="p-4 pt-2 border-t space-y-4 text-xs bg-muted/20 animate-in slide-in-from-top-2">
                      {/* Comparison section */}
                      {wrongSelection && (
                        <div className="rounded-lg border bg-background p-3 space-y-2">
                          <p className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                            <Lightbulb className="size-3.5 text-amber-500" />
                            Perbandingan Nada & Oktaf
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* User Selection */}
                            <div className="rounded-md border border-red-500/30 bg-red-500/5 p-2.5 space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">
                                Yang Kamu Pilih:
                              </span>
                              <div className="flex items-center justify-between">
                                <span className="text-base font-bold font-mono">
                                  {wrongSelection.displayName}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    playSound(wrongSelection.noteName, wrongSelection.octave)
                                  }
                                  className="h-6 px-2 text-[10px] gap-1 text-red-600 dark:text-red-400"
                                >
                                  <Volume2 className="size-3" />
                                  Dengar
                                </Button>
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                Oktaf {wrongSelection.octave}{" "}
                                {wrongSelection.isSameLetterWrongOctave &&
                                  "(Nama not sama tapi oktaf berbeda!)"}
                              </p>
                            </div>

                            {/* Correct Target */}
                            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-2.5 space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                                Kunci Jawaban Benar:
                              </span>
                              <div className="flex items-center justify-between">
                                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                  {currentQuestion.note.displayName}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    playSound(
                                      currentQuestion.note.noteName,
                                      currentQuestion.note.octave,
                                    )
                                  }
                                  className="h-6 px-2 text-[10px] gap-1 text-emerald-600 dark:text-emerald-400"
                                >
                                  <Volume2 className="size-3" />
                                  Dengar
                                </Button>
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                Oktaf {currentQuestion.note.octave} (Nada pada Paranada)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Position & Mnemonic Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-lg border p-3 space-y-1.5 bg-background">
                          <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                            <BookOpen className="size-3" /> Posisi pada Paranada
                          </span>
                          <p className="font-bold text-foreground">
                            {currentExplanation.positionName}
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {currentExplanation.positionDetail}
                          </p>
                        </div>

                        <div className="rounded-lg border p-3 space-y-1.5 bg-background">
                          <span className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1">
                            <Sparkles className="size-3" /> Rumus Menghafal (Mnemonic)
                          </span>
                          <p className="font-bold text-foreground">
                            {currentExplanation.mnemonicTitle}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {currentExplanation.mnemonicSentence}
                          </p>
                          <Badge variant="secondary" className="text-[10px] font-mono mt-1">
                            {currentExplanation.mnemonicHighlight}
                          </Badge>
                        </div>
                      </div>

                      {/* Instrument Guides */}
                      <div className="rounded-lg border p-3 bg-background space-y-2">
                        <p className="font-semibold text-foreground text-[11px]">
                          Cara Menemukan di Instrumen:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-start gap-2">
                            <Keyboard className="size-4 text-primary shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">Piano: </span>
                              <span className="text-muted-foreground">
                                {currentExplanation.pianoGuide}
                              </span>
                            </div>
                          </div>

                          {currentExplanation.guitarPositions.length > 0 && (
                            <div className="flex items-start gap-2">
                              <Guitar className="size-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold">Gitar: </span>
                                <span className="text-muted-foreground">
                                  {currentExplanation.guitarPositions.join(", ")}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fix Tips */}
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1.5">
                        <p className="font-semibold text-primary text-xs flex items-center gap-1.5">
                          <Lightbulb className="size-3.5" /> Tips Mengingat & Memperbaiki:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-muted-foreground">
                          {currentExplanation.fixTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Action footer inside explanation */}
                      <div className="flex justify-end gap-2 pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={retryCurrentQuestion}
                          className="h-7 text-xs"
                        >
                          Coba Lagi Sekarang
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={nextQuestion}
                          className="h-7 text-xs gap-1"
                        >
                          Lanjut ke Soal Berikutnya →
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── MODE 1: Multiple Choice ──────────────────── */}
          {mode === "choice" && (
            <div className="grid w-full max-w-md grid-cols-2 gap-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedIdx === idx;
                const isCorrectOption = idx === currentQuestion.correctIdx;
                const showAsCorrect = feedback && isCorrectOption;
                const showAsWrong =
                  feedback === "wrong" && isSelected && !isCorrectOption;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChoiceAnswer(idx)}
                    disabled={!!feedback}
                    className={cn(
                      "rounded-xl border-2 px-4 py-4 text-xl font-bold transition-all duration-200 cursor-pointer",
                      "hover:border-primary hover:bg-primary/5 hover:scale-[1.02]",
                      "disabled:cursor-not-allowed",
                      showAsCorrect &&
                        "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 scale-105 shadow-md",
                      showAsWrong &&
                        "border-red-500 bg-red-500/15 text-red-600 dark:text-red-400 scale-95 opacity-70",
                      !feedback &&
                        !isSelected &&
                        "border-border bg-card shadow-xs hover:border-primary",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── MODE 2: Interactive Piano Keyboard ────────── */}
          {mode === "piano" && (
            <div className="w-full max-w-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span className="flex items-center gap-1 font-medium">
                  <Keyboard className="size-3.5 text-primary" />
                  Piano Keyboard ({pianoConfig.octaveCount} Oktaf: C{pianoConfig.startOctave} – B{pianoConfig.startOctave + pianoConfig.octaveCount - 1})
                </span>
                <span className="text-[11px] opacity-75">
                  Klik tuts dengan nada & oktaf yang tepat (misal: D3 ≠ D5)
                </span>
              </div>

              <div
                className={cn(
                  "rounded-2xl transition-all p-1",
                  feedback === "correct" && "ring-2 ring-emerald-500/60",
                  feedback === "wrong" && "ring-2 ring-red-500/60",
                )}
              >
                <Piano
                  startOctave={pianoConfig.startOctave}
                  octaveCount={pianoConfig.octaveCount}
                  enableLiveMic={false}
                  activeNote={activePianoNote}
                  highlightedPitchClasses={
                    feedback === "wrong"
                      ? [currentQuestion.note.pitchClass]
                      : []
                  }
                  highlightedToneLabels={{
                    [currentQuestion.note.pitchClass]: currentQuestion.note.displayName,
                  }}
                  onKeyClick={handlePianoAnswer}
                />
              </div>
            </div>
          )}

          {/* ── MODE 3: Interactive Guitar Fretboard ──────── */}
          {mode === "fretboard" && (
            <div className="w-full max-w-3xl space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span className="flex items-center gap-1 font-medium">
                  <Guitar className="size-3.5 text-amber-500" />
                  Guitar Fretboard (Standar Tuning E A D G B E, 12 Fret)
                </span>
                <span className="text-[11px] opacity-75">
                  Klik posisi fret pada senar mana saja yang menghasilkan not & oktaf ini
                </span>
              </div>

              <div
                className={cn(
                  "rounded-2xl transition-all p-1",
                  feedback === "correct" && "ring-2 ring-emerald-500/60",
                  feedback === "wrong" && "ring-2 ring-red-500/60",
                )}
              >
                <Fretboard
                  tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
                  fretCount={12}
                  enableLiveMic={false}
                  activeNote={activeFretNote}
                  highlightedPitchClasses={
                    feedback === "wrong"
                      ? [currentQuestion.note.pitchClass]
                      : []
                  }
                  highlightedToneLabels={{
                    [currentQuestion.note.pitchClass]: currentQuestion.note.displayName,
                  }}
                  onFretClick={handleFretboardAnswer}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          ← Kembali ke Topik
        </Button>
        <span className="flex items-center gap-1">
          <Sparkles className="size-3 text-primary" />
          NoteLogic Sight Reading Trainer
        </span>
      </div>
    </div>
  );
});
