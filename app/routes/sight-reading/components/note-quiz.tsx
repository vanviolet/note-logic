// ════════════════════════════════════════════════════════
// NoteQuiz – Interactive note identification quiz
// ════════════════════════════════════════════════════════
//
// Shows a note on staff and asks user to identify it from
// multiple choice options. Tracks score, time, and provides
// feedback with correct/incorrect animations.
// ════════════════════════════════════════════════════════

import { memo, useState, useCallback, useMemo, useEffect } from "react";
import { Trophy, Star, ThumbsUp, Dumbbell, Check, X } from "lucide-react";
import { StaffRenderer } from "./staff-renderer";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { Progress } from "~/templates/components/ui/progress";
import { useGuitarAudio } from "~/templates/hooks";
import { normalizeNoteName } from "~/shared/lib/music-utils";
import { generateNoteQuiz, getClefForNote } from "../lib/note-data";
import type { LessonTopic, QuizState, ClefType } from "../types";
import { cn } from "~/templates/lib/utils";

// ── Props ──────────────────────────────────────────────

interface NoteQuizProps {
  topic: LessonTopic;
  questionCount?: number;
  onBack: () => void;
}

// ── Main Component ─────────────────────────────────────

export const NoteQuiz = memo(function NoteQuiz({
  topic,
  questionCount = 10,
  onBack,
}: NoteQuizProps) {
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const { ensureReady, isReady, isLoading, playNote } = useGuitarAudio();

  // Start quiz
  const startQuiz = useCallback(() => {
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
    setSelectedIdx(null);
  }, [topic, questionCount]);

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

  // Handle answer
  const handleAnswer = useCallback(
    (answerIdx: number) => {
      if (!quiz || feedback) return;
      setSelectedIdx(answerIdx);

      const isCorrect = answerIdx === currentQuestion!.correctIdx;
      setFeedback(isCorrect ? "correct" : "wrong");

      // Play the note as feedback
      if (!isReady && !isLoading) ensureReady();
      const note = currentQuestion!.note;
      playNote(`${normalizeNoteName(note.noteName)}${note.octave}`, {
        duration: 1,
        gain: 0.8,
      });

      // Auto-advance after delay
      setTimeout(() => {
        setQuiz((prev) => {
          if (!prev) return prev;
          const newAnswers = [...prev.answers];
          newAnswers[prev.currentIdx] = answerIdx;
          const newScore = prev.score + (isCorrect ? 1 : 0);
          const nextIdx = prev.currentIdx + 1;
          const isComplete = nextIdx >= prev.questions.length;

          return {
            ...prev,
            answers: newAnswers,
            score: newScore,
            currentIdx: isComplete ? prev.currentIdx : nextIdx,
            isComplete,
          };
        });
        setFeedback(null);
        setSelectedIdx(null);
      }, 1200);
    },
    [
      quiz,
      feedback,
      currentQuestion,
      ensureReady,
      isReady,
      isLoading,
      playNote,
    ],
  );

  if (!quiz) return null;

  // ── Result Screen ────────────────────────────────────

  if (quiz.isComplete) {
    const elapsed = Math.round((Date.now() - quiz.startedAt) / 1000);
    const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
    const grade =
      percentage >= 90
        ? "Sempurna!"
        : percentage >= 70
          ? "Bagus!"
          : percentage >= 50
            ? "Cukup Baik"
            : "Perlu Latihan";
    const gradeColor =
      percentage >= 90
        ? "text-emerald-500"
        : percentage >= 70
          ? "text-blue-500"
          : percentage >= 50
            ? "text-amber-500"
            : "text-red-500";

    return (
      <div className="mx-auto max-w-md space-y-6 text-center py-8">
        <div className="space-y-2">
          <div className="flex justify-center">
            {percentage >= 90 ? (
              <Trophy className="size-12 text-emerald-500" />
            ) : percentage >= 70 ? (
              <Star className="size-12 text-blue-500" />
            ) : percentage >= 50 ? (
              <ThumbsUp className="size-12 text-amber-500" />
            ) : (
              <Dumbbell className="size-12 text-red-500" />
            )}
          </div>
          <h2 className={cn("text-3xl font-bold", gradeColor)}>{grade}</h2>
          <p className="text-muted-foreground">{topic.title}</p>
        </div>

        <div className="rounded-xl border border-border p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold">{quiz.score}</p>
              <p className="text-xs text-muted-foreground">Benar</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{quiz.questions.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{elapsed}s</p>
              <p className="text-xs text-muted-foreground">Waktu</p>
            </div>
          </div>
          <Progress value={percentage} className="h-3" />
          <p className="text-lg font-semibold">{percentage}%</p>
        </div>

        {/* Answer Review */}
        <div className="space-y-2 text-left">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Review Jawaban
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {quiz.questions.map((q, i) => {
              const answered = quiz.answers[i];
              const isCorrect = answered === q.correctIdx;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center rounded-lg border p-2 text-xs",
                    isCorrect
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-red-500/30 bg-red-500/10",
                  )}
                >
                  <span className="font-mono font-bold">
                    {q.note.displayName}
                  </span>
                  <span>
                    {isCorrect ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <X className="size-3 text-red-500" />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={startQuiz}>Ulangi Quiz</Button>
          <Button variant="outline" onClick={onBack}>
            Pilih Topik Lain
          </Button>
        </div>
      </div>
    );
  }

  // ── Quiz Screen ──────────────────────────────────────

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge
            variant="outline"
            className="mb-1 flex items-center gap-1 w-fit"
          >
            <topic.icon className="size-3" />
            {topic.title}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Soal {quiz.currentIdx + 1} / {quiz.questions.length}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">{quiz.score}</p>
          <p className="text-[10px] text-muted-foreground">Skor</p>
        </div>
      </div>

      <Progress
        value={((quiz.currentIdx + 1) / quiz.questions.length) * 100}
        className="h-2"
      />

      {/* Question: Staff rendering */}
      {currentQuestion && (
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
              Not apa ini?
            </p>
            <div className="flex justify-center">
              <StaffRenderer
                note={currentQuestion.note}
                clef={currentClef}
                width={220}
                height={160}
                highlightColor={
                  feedback === "correct"
                    ? "hsl(142, 76%, 36%)"
                    : feedback === "wrong"
                      ? "hsl(0, 84%, 60%)"
                      : undefined
                }
              />
            </div>
          </div>

          {/* Answer options */}
          <div className="grid w-full grid-cols-2 gap-3">
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
                  onClick={() => handleAnswer(idx)}
                  disabled={!!feedback}
                  className={cn(
                    "rounded-xl border-2 px-4 py-4 text-lg font-bold transition-all duration-200",
                    "hover:border-primary hover:bg-primary/5",
                    "disabled:cursor-not-allowed",
                    showAsCorrect &&
                      "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 scale-105",
                    showAsWrong &&
                      "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 scale-95 opacity-70",
                    !feedback &&
                      !isSelected &&
                      "border-border bg-card hover:border-primary",
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback message */}
          {feedback && (
            <div
              className={cn(
                "text-center text-sm font-semibold transition-opacity",
                feedback === "correct" ? "text-emerald-500" : "text-red-500",
              )}
            >
              {feedback === "correct" ? (
                <span className="flex items-center justify-center gap-1">
                  <Check className="size-4" /> Benar!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <X className="size-4" /> Salah — Jawabannya:{" "}
                  {currentQuestion.options[currentQuestion.correctIdx]}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Kembali ke Topik
        </Button>
      </div>
    </div>
  );
});
