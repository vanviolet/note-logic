import { useState, useEffect } from "react";
import { Brain, Volume2, CheckCircle2, XCircle, RotateCcw, Award } from "lucide-react";
import type { FamilyChordEntry } from "~/theory-music/family";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";

interface FamilyHarmonicQuizProps {
  entries: FamilyChordEntry[];
  root: string;
  scaleType: "major" | "minor";
}

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  playAudioNotes?: string[];
}

export function FamilyHarmonicQuiz({ entries, root, scaleType }: FamilyHarmonicQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Generate dynamic questions based on current key
  useEffect(() => {
    if (entries.length < 5) return;

    const generated: Question[] = [];

    // Question 1: Tonic identification
    const tonicEntry = entries.find((e) => e.family === "Tonic");
    if (tonicEntry) {
      generated.push({
        id: "q1",
        questionText: `Di tangga nada ${root} ${scaleType === "major" ? "Mayor" : "Minor"}, chord manakah yang berfungsi sebagai Tonic utama (Rumah/Rest)?`,
        options: [
          `${tonicEntry.degree} (${tonicEntry.chord.name})`,
          entries[3] ? `${entries[3].degree} (${entries[3].chord.name})` : "IV",
          entries[4] ? `${entries[4].degree} (${entries[4].chord.name})` : "V",
          entries[1] ? `${entries[1].degree} (${entries[1].chord.name})` : "ii",
        ],
        correctIndex: 0,
        explanation: `Chord ${tonicEntry.degree} (${tonicEntry.chord.name}) adalah pusat stabilitas tonal (Tonic) tempat melodi beristirahat.`,
        playAudioNotes: tonicEntry.chord.composed.map((t) => t.note),
      });
    }

    // Question 2: Dominant tension
    const dominantEntry = entries.find((e) => e.family === "Dominant" && (e.degree === "V" || e.degree === "v" || e.degree === "VII"));
    if (dominantEntry) {
      generated.push({
        id: "q2",
        questionText: `Manakah chord di key ${root} ${scaleType} yang memiliki tegangan terkuat (Dominant) dan sangat ingin beresolusi kembali ke Tonic?`,
        options: [
          entries[1] ? `${entries[1].degree} (${entries[1].chord.name})` : "ii",
          entries[2] ? `${entries[2].degree} (${entries[2].chord.name})` : "iii",
          `${dominantEntry.degree} (${dominantEntry.chord.name})`,
          entries[3] ? `${entries[3].degree} (${entries[3].chord.name})` : "IV",
        ],
        correctIndex: 2,
        explanation: `Chord ${dominantEntry.degree} (${dominantEntry.chord.name}) memiliki dorongan cadential terkuat kembali ke Tonic.`,
        playAudioNotes: dominantEntry.chord.composed.map((t) => t.note),
      });
    }

    // Question 3: Subdominant bridge
    const subdominantEntry = entries.find((e) => e.family === "Subdominant");
    if (subdominantEntry) {
      generated.push({
        id: "q3",
        questionText: `Fungsi harmonik apakah yang dimiliki oleh chord ${subdominantEntry.degree} (${subdominantEntry.chord.name})?`,
        options: ["Tonic Family", "Subdominant Family", "Dominant Family", "Modal Interchange"],
        correctIndex: 1,
        explanation: `Chord ${subdominantEntry.degree} berfungsi sebagai Subdominant (Predominant) yang memperluas harmoni dan menjembatani gerak ke Dominant.`,
        playAudioNotes: subdominantEntry.chord.composed.map((t) => t.note),
      });
    }

    // Question 4: Cadence definition
    generated.push({
      id: "q4",
      questionText: "Progresi V → I disebut sebagai jenis cadence apa dalam teori musik klasik?",
      options: [
        "Plagal Cadence (Gospel/Amen)",
        "Authentic Cadence (Perjalanan & Resolusi Sempurna)",
        "Deceptive Cadence (Kejutan)",
        "Half Cadence (Menggantung)",
      ],
      correctIndex: 1,
      explanation: "Progresi Dominant V menuju Tonic I adalah Authentic Cadence — bentuk resolusi paling mantap dalam musik tonal.",
    });

    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  }, [entries, root, scaleType]);

  if (questions.length === 0) return null;

  const currentQ = questions[currentQuestionIndex];

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

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur space-y-5">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-amber-500" />
          <h2 className="text-lg font-semibold tracking-tight">
            Kuis Pendengaran & Fungsi Harmoni
          </h2>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {showResult ? "Selesai" : `Soal ${currentQuestionIndex + 1}/${questions.length}`}
        </Badge>
      </div>

      {showResult ? (
        <div className="py-6 text-center space-y-4">
          <Award className="size-12 text-amber-500 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold">Hasil Kuis Harmoni</h3>
          <p className="text-muted-foreground text-sm">
            Kamu menjawab benar <strong className="text-foreground">{score}</strong> dari {questions.length} pertanyaan!
          </p>
          <Button onClick={restartQuiz} className="gap-2">
            <RotateCcw className="size-4" />
            Coba Kuis Lagi
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Question Box */}
          <div className="space-y-2">
            <p className="text-sm font-medium leading-relaxed">{currentQ.questionText}</p>

            {currentQ.playAudioNotes && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2 text-xs"
                onClick={() => circleAudio.playChord(currentQ.playAudioNotes!, { type: "strum" })}
              >
                <Volume2 className="size-3.5" />
                Dengarkan Chord Ini
              </Button>
            )}
          </div>

          {/* Options */}
          <div className="grid gap-2">
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
                  className={`w-full flex items-center justify-between rounded-lg p-3 text-left text-xs transition-all ${btnClass}`}
                >
                  <span>{option}</span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <XCircle className="size-4 text-destructive shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button */}
          {selectedOption !== null && (
            <div className="space-y-3 pt-2">
              <div className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed border border-border/50">
                <span className="font-bold block mb-1">Penjelasan:</span>
                {currentQ.explanation}
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
