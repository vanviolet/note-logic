// ════════════════════════════════════════════════════════
// Circle of Fifths — Interactive Quiz & Practice Mode
// ════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import {
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  HelpCircle,
  ArrowRight,
  BrainCircuit,
} from "lucide-react";
import {
  CIRCLE_KEYS,
  type CircleKeyData,
} from "~/theory-music/circle-of-fifths/circle-data";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { cn } from "~/templates/lib/utils";

type QuizCategory =
  | "key-signature"
  | "relative-pair"
  | "circle-navigation"
  | "ear-training";

interface QuizQuestion {
  category: QuizCategory;
  prompt: string;
  subtext?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  audioAction?: () => void;
}

export function CircleQuizMode({ className }: { className?: string }) {
  const [category, setCategory] = useState<QuizCategory>("key-signature");
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  // Generate a randomized question based on category
  const generateQuestion = (cat: QuizCategory): QuizQuestion => {
    const randomKey = CIRCLE_KEYS[Math.floor(Math.random() * CIRCLE_KEYS.length)];

    if (cat === "key-signature") {
      // Prompt: Tangga nada dengan X accidental
      const isSharp = randomKey.accidentalType === "sharp";
      const isFlat = randomKey.accidentalType === "flat";
      const isNatural = randomKey.accidentalsCount === 0;

      let prompt = "";
      if (isNatural) {
        prompt = "Key mayor manakah yang TIDAK memiliki accidental (0 kres/mol)?";
      } else {
        prompt = `Key mayor manakah yang memiliki ${randomKey.accidentalsCount} ${isSharp ? "kres (♯)" : "mol (♭)"}?`;
      }

      // 4 options
      const otherKeys = CIRCLE_KEYS.filter((k) => k.majorKey !== randomKey.majorKey);
      const shuffledOthers = [...otherKeys].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [randomKey.majorKey, ...shuffledOthers.map((k) => k.majorKey)].sort(
        () => Math.random() - 0.5,
      );

      return {
        category: cat,
        prompt,
        subtext: randomKey.accidentalsCount > 0 ? `Daftar accidental: ${randomKey.accidentalsList.join(", ")}` : "Semua nada natural (putih)",
        options,
        correctAnswer: randomKey.majorKey,
        explanation: `Key ${randomKey.majorKey} Mayor memiliki ${randomKey.accidentalsCount} ${randomKey.accidentalType} (${randomKey.accidentalsList.join(", ") || "none"}). Mnemonic: "${randomKey.orderMnemonic}".`,
        audioAction: () => circleAudio.playScale(randomKey.scaleNotes, 0.2),
      };
    }

    if (cat === "relative-pair") {
      // Relative minor or major
      const askForMinor = Math.random() > 0.5;
      if (askForMinor) {
        const prompt = `Apa relative minor dari key ${randomKey.majorKey} Mayor?`;
        const otherMinors = CIRCLE_KEYS.filter((k) => k.relativeMinor !== randomKey.relativeMinor);
        const shuffledOthers = [...otherMinors].sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [
          randomKey.relativeMinor,
          ...shuffledOthers.map((k) => k.relativeMinor),
        ].sort(() => Math.random() - 0.5);

        return {
          category: cat,
          prompt,
          subtext: "Relative minor terletak pada derajat vi (atau turun 3 semitone / minor 3rd dari Major).",
          options,
          correctAnswer: randomKey.relativeMinor,
          explanation: `Relative minor dari ${randomKey.majorKey} Mayor adalah ${randomKey.relativeMinor} Minor karena keduanya berbagi key signature yang identik (${randomKey.accidentalsCount} ${randomKey.accidentalType}).`,
          audioAction: () => {
            const majorI = randomKey.diatonicChords[0].notes;
            const minorVi = randomKey.diatonicChords[5].notes;
            circleAudio.playCadenceChords([majorI, minorVi], 90);
          },
        };
      } else {
        const prompt = `Apa relative major dari key ${randomKey.relativeMinor} Minor?`;
        const otherMajors = CIRCLE_KEYS.filter((k) => k.majorKey !== randomKey.majorKey);
        const shuffledOthers = [...otherMajors].sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [
          randomKey.majorKey,
          ...shuffledOthers.map((k) => k.majorKey),
        ].sort(() => Math.random() - 0.5);

        return {
          category: cat,
          prompt,
          subtext: "Relative major terletak naik 3 semitone (minor 3rd) dari root minor.",
          options,
          correctAnswer: randomKey.majorKey,
          explanation: `${randomKey.relativeMinor} Minor memiliki relative major ${randomKey.majorKey} Mayor.`,
          audioAction: () => circleAudio.playChord(randomKey.diatonicChords[0].notes, { type: "strum" }),
        };
      }
    }

    if (cat === "circle-navigation") {
      // Perfect 5th up (clockwise) or Perfect 4th up (counter-clockwise)
      const askFifth = Math.random() > 0.5;
      if (askFifth) {
        const targetKey = CIRCLE_KEYS[(randomKey.index + 1) % 12];
        const prompt = `Dari key ${randomKey.majorKey}, naik Perfect 5th (1 langkah searah jarum jam) menghasilkan key apa?`;
        const otherMajors = CIRCLE_KEYS.filter((k) => k.majorKey !== targetKey.majorKey);
        const shuffledOthers = [...otherMajors].sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [targetKey.majorKey, ...shuffledOthers.map((k) => k.majorKey)].sort(
          () => Math.random() - 0.5,
        );

        return {
          category: cat,
          prompt,
          subtext: "1 langkah searah jarum jam = Naik 7 semitone (Perfect 5th / Kuint Murni) & bertambah 1 Sharp.",
          options,
          correctAnswer: targetKey.majorKey,
          explanation: `Naik Perfect 5th dari ${randomKey.majorKey} adalah ${targetKey.majorKey} (derajat V dari ${randomKey.majorKey}).`,
          audioAction: () => {
            circleAudio.playNote(randomKey.majorKey, 3);
            setTimeout(() => circleAudio.playNote(targetKey.majorKey, 4), 500);
          },
        };
      } else {
        const targetKey = CIRCLE_KEYS[(randomKey.index + 11) % 12];
        const prompt = `Dari key ${randomKey.majorKey}, naik Perfect 4th (1 langkah berlawanan jarum jam) menghasilkan key apa?`;
        const otherMajors = CIRCLE_KEYS.filter((k) => k.majorKey !== targetKey.majorKey);
        const shuffledOthers = [...otherMajors].sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [targetKey.majorKey, ...shuffledOthers.map((k) => k.majorKey)].sort(
          () => Math.random() - 0.5,
        );

        return {
          category: cat,
          prompt,
          subtext: "1 langkah berlawanan jarum jam = Naik 5 semitone (Perfect 4th / Kwart Murni) & bertambah 1 Flat.",
          options,
          correctAnswer: targetKey.majorKey,
          explanation: `Naik Perfect 4th dari ${randomKey.majorKey} adalah ${targetKey.majorKey} (derajat IV dari ${randomKey.majorKey}).`,
          audioAction: () => {
            circleAudio.playNote(randomKey.majorKey, 3);
            setTimeout(() => circleAudio.playNote(targetKey.majorKey, 4), 500);
          },
        };
      }
    }

    // Ear Training Mode
    const targetKey = CIRCLE_KEYS[(randomKey.index + 1) % 12];
    const prompt = `Dengarkan audio: Hubungan interval antara nada pertama dan nada kedua adalah?`;
    const options = [
      "Perfect 5th (Kuint Murni)",
      "Perfect 4th (Kwart Murni)",
      "Major 3rd (Ters Mayor)",
      "Octave (Oktaf)",
    ].sort(() => Math.random() - 0.5);

    return {
      category: cat,
      prompt,
      subtext: "Klik tombol audio di bawah untuk memutar kembali nada.",
      options,
      correctAnswer: "Perfect 5th (Kuint Murni)",
      explanation: `Dua nada tersebut berjarak 7 semitone (Perfect 5th), yaitu interval dasar pembentuk Circle of Fifths.`,
      audioAction: () => {
        circleAudio.playNote(randomKey.majorKey, 3);
        setTimeout(() => circleAudio.playNote(targetKey.majorKey, 4), 600);
      },
    };
  };

  // Next Question
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    const q = generateQuestion(category);
    setCurrentQuestion(q);
    // Auto play audio if ear training
    if (category === "ear-training") {
      setTimeout(() => q.audioAction?.(), 300);
    }
  };

  // Handle answer select
  const handleSelectAnswer = (ans: string) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedAnswer(ans);
    setIsAnswered(true);
    setTotalQuestions((t) => t + 1);

    if (ans === currentQuestion.correctAnswer) {
      setScore((s) => s + 10 * Math.max(1, streak));
      setStreak((st) => st + 1);
      circleAudio.playSuccessChime();
    } else {
      setStreak(0);
      circleAudio.playErrorTone();
    }
  };

  // Switch category
  const handleSwitchCategory = (cat: QuizCategory) => {
    setCategory(cat);
    setSelectedAnswer(null);
    setIsAnswered(false);
    const q = generateQuestion(cat);
    setCurrentQuestion(q);
  };

  // Initialize
  useEffect(() => {
    handleNextQuestion();
  }, [category]);

  return (
    <div className={cn("space-y-5 p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur", className)}>
      {/* Header & Score Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BrainCircuit className="size-4 text-primary" />
            <h3 className="font-bold text-base text-foreground">
              Circle of Fifths Interactive Quiz
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Latih intuisi teori musik, key signature, relative keys, dan pendengaran interval kuint.
          </p>
        </div>

        {/* Score & Streak Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/30 text-xs font-bold text-primary">
            <Trophy className="size-3.5" />
            <span>Skor: {score}</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-500 animate-pulse">
              <Flame className="size-3.5 fill-current" />
              <span>{streak}x Streak!</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-background/50 border border-border/60">
        {[
          { id: "key-signature", label: "Key Signature (♯ / ♭)" },
          { id: "relative-pair", label: "Relative Minor / Major" },
          { id: "circle-navigation", label: "Circle Navigation (P5 / P4)" },
          { id: "ear-training", label: "Ear Training (Interval)" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSwitchCategory(tab.id as QuizCategory)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              category === tab.id
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="p-5 rounded-xl border border-border/80 bg-background/60 space-y-4">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-semibold text-primary tracking-wider">
              Pertanyaan · {totalQuestions + 1}
            </span>
            <h4 className="text-lg font-bold text-foreground leading-snug">
              {currentQuestion.prompt}
            </h4>
            {currentQuestion.subtext && (
              <p className="text-xs text-muted-foreground italic">
                {currentQuestion.subtext}
              </p>
            )}
          </div>

          {/* Audio Play Button if available */}
          {currentQuestion.audioAction && (
            <Button
              size="sm"
              variant="outline"
              onClick={currentQuestion.audioAction}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <Volume2 className="size-3.5 text-primary" />
              Putar Audio Soal
            </Button>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQuestion.correctAnswer;

              let btnStyle = "bg-card/80 border-border hover:border-primary/50 text-foreground";
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-destructive/20 border-destructive text-destructive-foreground line-through";
                } else {
                  btnStyle = "bg-card/40 border-border/40 text-muted-foreground opacity-60";
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectAnswer(opt)}
                  disabled={isAnswered}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition-all text-left group",
                    btnStyle,
                  )}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="size-4 text-destructive shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner (After answered) */}
          {isAnswered && (
            <div className="mt-4 p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <HelpCircle className="size-3.5" />
                  Penjelasan Teori
                </span>
                <Button
                  size="sm"
                  onClick={handleNextQuestion}
                  className="h-8 px-3 gap-1.5 text-xs font-semibold"
                >
                  <span>Lanjut Soal Berikutnya</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
