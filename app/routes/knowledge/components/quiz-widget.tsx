// ════════════════════════════════════════════════════════
// Knowledge – Interactive Quiz Widget
// ════════════════════════════════════════════════════════

import { useCallback, useState } from "react";
import { cn } from "~/templates/lib/utils";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  FlaskConical,
  Trophy,
  ThumbsUp,
  BookOpen,
} from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizWidgetProps {
  questions: QuizQuestion[];
}

export function QuizWidget({ questions }: QuizWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answered) return;
      setSelected(optionIndex);
      setAnswered(true);
      if (optionIndex === current.correctIndex) {
        setScore((s) => s + 1);
      }
    },
    [answered, current],
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [currentIndex, questions.length]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  }, []);

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const ResultIcon =
      percentage >= 80 ? Trophy : percentage >= 50 ? ThumbsUp : BookOpen;
    const message =
      percentage >= 80
        ? "Luar biasa! Kamu menguasai materi ini."
        : percentage >= 50
          ? "Bagus! Beberapa konsep bisa diperdalam lagi."
          : "Ayo baca ulang artikelnya dan coba lagi!";

    return (
      <div className="space-y-5 rounded-xl border border-border/50 bg-card/50 p-6 text-center">
        <ResultIcon className="mx-auto h-12 w-12 text-primary" />
        <h4 className="text-xl font-bold">
          Skor: {score}/{questions.length} ({percentage}%)
        </h4>
        <p className="text-muted-foreground">{message}</p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <RotateCcw className="h-4 w-4" />
          Ulangi Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-5">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider">
          <FlaskConical className="h-4 w-4 text-primary" />
          Quiz Interaktif
        </h4>
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <p className="text-base font-medium leading-relaxed">
        {current.question}
      </p>

      {/* Options */}
      <div className="grid gap-2">
        {current.options.map((option, i) => {
          const isCorrect = i === current.correctIndex;
          const isSelected = i === selected;

          return (
            <button
              key={`q${currentIndex}-opt${i}`}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all",
                !answered &&
                  "border-border/50 hover:border-primary/40 hover:bg-muted/40",
                answered &&
                  isCorrect &&
                  "border-emerald-500/50 bg-emerald-500/10",
                answered &&
                  isSelected &&
                  !isCorrect &&
                  "border-red-500/50 bg-red-500/10",
                answered && !isSelected && !isCorrect && "opacity-50",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  answered && isCorrect
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : answered && isSelected && !isCorrect
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-border",
                )}
              >
                {answered && isCorrect ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : answered && isSelected && !isCorrect ? (
                  <XCircle className="h-3.5 w-3.5" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div
          className={cn(
            "rounded-lg border p-4 text-sm",
            selected === current.correctIndex
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-amber-500/30 bg-amber-500/5",
          )}
        >
          <p className="font-medium mb-1 flex items-center gap-1.5">
            {selected === current.correctIndex ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Benar!
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-amber-500" /> Kurang tepat
              </>
            )}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {current.explanation}
          </p>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            {currentIndex + 1 < questions.length
              ? "Pertanyaan Berikutnya →"
              : "Lihat Hasil"}
          </button>
        </div>
      )}
    </div>
  );
}
