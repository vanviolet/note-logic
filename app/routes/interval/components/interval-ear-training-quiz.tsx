import { useState, useEffect } from "react";
import { Brain, Volume2, CheckCircle2, XCircle, RotateCcw, Award } from "lucide-react";
import type { GeneratedInterval } from "~/theory-music/interval";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";

interface IntervalEarTrainingQuizProps {
  intervals: GeneratedInterval[];
  root: string;
}

interface Question {
  id: string;
  targetInterval: GeneratedInterval;
  options: GeneratedInterval[];
  correctIndex: number;
}

export function IntervalEarTrainingQuiz({
  intervals,
  root,
}: IntervalEarTrainingQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate 5 random questions
  const generateNewQuiz = () => {
    if (intervals.length < 4) return;

    const shuffled = [...intervals].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);

    const generated: Question[] = selected.map((target, qIdx) => {
      const wrongOptions = intervals
        .filter((i) => i.short !== target.short)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const allOptions = [...wrongOptions, target].sort(() => Math.random() - 0.5);
      const correctIndex = allOptions.findIndex((o) => o.short === target.short);

      return {
        id: `q-${qIdx}-${target.short}`,
        targetInterval: target,
        options: allOptions,
        correctIndex,
      };
    });

    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  useEffect(() => {
    generateNewQuiz();
  }, [intervals, root]);

  if (questions.length === 0) return null;

  const currentQ = questions[currentQuestionIndex];

  const playCurrentAudio = () => {
    if (!currentQ) return;
    setIsPlaying(true);
    circleAudio.playNoteSequence([currentQ.targetInterval.root, currentQ.targetInterval.note], 0.4);
    setTimeout(() => setIsPlaying(false), 900);
  };

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);

    if (index === currentQ.correctIndex) {
      setScore((s) => s + 1);
      circleAudio.playSuccessChime();
    } else {
      circleAudio.playErrorTone();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur space-y-5">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-amber-500" />
          <h2 className="text-lg font-semibold tracking-tight">
            Kuis Pendengaran Interval ({root})
          </h2>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {showResult ? "Selesai" : `Soal ${currentQuestionIndex + 1}/${questions.length}`}
        </Badge>
      </div>

      {showResult ? (
        <div className="py-6 text-center space-y-4">
          <Award className="size-12 text-amber-500 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold">Hasil Ear Training Interval</h3>
          <p className="text-muted-foreground text-sm">
            Kamu berhasil menebak dengan benar <strong className="text-foreground">{score}</strong> dari {questions.length} interval!
          </p>
          <Button onClick={generateNewQuiz} className="gap-2">
            <RotateCcw className="size-4" />
            Coba Kuis Lagi
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Question Audio Trigger */}
          <div className="rounded-xl border border-border/80 bg-background/80 p-5 text-center space-y-3">
            <p className="text-sm font-medium">
              Dengarkan nada berikut dan tebak interval dari root <strong className="text-primary font-mono">{root}</strong>:
            </p>

            <Button
              size="lg"
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 shadow-xs"
              onClick={playCurrentAudio}
            >
              <Volume2 className={`size-5 ${isPlaying ? "animate-pulse" : ""}`} />
              Putar Suara Interval
            </Button>
          </div>

          {/* Options */}
          <div className="grid gap-2 sm:grid-cols-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnClass = "bg-background border border-border/80 hover:bg-muted";
              if (selectedOption !== null) {
                if (isCorrect) btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold";
                else if (isSelected) btnClass = "bg-destructive/20 border-destructive text-destructive font-bold";
              }

              return (
                <button
                  key={`opt-${idx}`}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full flex items-center justify-between rounded-xl p-3.5 text-left text-xs transition-all ${btnClass}`}
                >
                  <div>
                    <span className="font-bold text-sm block">{option.name} ({option.short})</span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {option.semitone} Semitone · {option.root} → {option.note}
                    </span>
                  </div>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <XCircle className="size-5 text-destructive shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {selectedOption !== null && (
            <div className="space-y-3 pt-2">
              <div className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed border border-border/50">
                <span className="font-bold block mb-1">
                  {selectedOption === currentQ.correctIndex ? "Jawaban Benar! 🎉" : "Jawaban Kurang Tepat"}
                </span>
                {currentQ.targetInterval.description}
                {currentQ.targetInterval.songExamples?.[0] && (
                  <p className="mt-1 font-semibold text-primary">
                    Mnemonic: {currentQ.targetInterval.songExamples[0].title} ({currentQ.targetInterval.songExamples[0].artist})
                  </p>
                )}
              </div>

              <Button onClick={handleNext} className="w-full sm:w-auto text-xs">
                {currentQuestionIndex + 1 < questions.length ? "Pertanyaan Selanjutnya →" : "Lihat Hasil"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
