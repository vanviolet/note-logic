// ════════════════════════════════════════════════════════
// Sight Reading Module – Landing Page
// ════════════════════════════════════════════════════════

import { Link } from "react-router";
import type { Route } from "./+types";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Keyboard,
  Music,
  Music2,
  Hash,
  Timer,
  Clock,
  KeySquare,
  CircleDot,
  Volume2,
  Hand,
  Gauge,
  KeyRound,
  Target,
} from "lucide-react";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import { Separator } from "~/templates/components/ui/separator";
import { LESSON_TOPICS } from "./lib/note-data";
import type { Difficulty } from "./types";
import { cn } from "~/templates/lib/utils";

// ── Meta ───────────────────────────────────────────────

export function meta(_: Route.MetaArgs) {
  return [
    { title: "NoteLogic | Belajar Membaca Not Balok" },
    {
      name: "description",
      content:
        "Belajar membaca not balok secara interaktif. Pelajari treble & bass clef, accidental, durasi, circle of fifths, dinamika, artikulasi, dan uji kemampuanmu dengan quiz.",
    },
  ];
}

// ── Page Component ─────────────────────────────────────

export default function SightReadingLanding() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
      <HeroSection />
      <Separator />
      <MateriSection />
      <Separator />
      <QuizSection />
    </div>
  );
}

// ── Hero Section ───────────────────────────────────────

function HeroSection() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <Badge variant="outline" className="text-xs">
          Modul Interaktif
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Belajar Membaca Not Balok
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
          Pelajari cara membaca notasi musik standar secara interaktif. Mulai
          dari mengenal paranada, kunci (clef), accidental, durasi, key
          signature, circle of fifths, dinamika, hingga artikulasi. Uji
          kemampuanmu dengan quiz interaktif.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/sight-reading/materi">
            <BookOpen className="size-4" />
            Mulai Belajar Materi
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/sight-reading/explorer">
            <Keyboard className="size-4" />
            Explorer Interaktif
          </Link>
        </Button>
      </div>

      {/* Quick info cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard
          icon={Music}
          title="Paranada & Kunci"
          description="Staff, treble/bass clef, posisi not, ledger lines, dan mnemonic untuk menghafal."
        />
        <InfoCard
          icon={Hash}
          title="Teori Nada"
          description="Accidental, key signature, enharmonic, circle of fifths, dan time signature."
        />
        <InfoCard
          icon={Hand}
          title="Ekspresi & Artikulasi"
          description="Dinamika (pp–ff), staccato, legato, fermata, tanda tempo, dan crescendo."
        />
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// ── Materi Section ─────────────────────────────────────

const MATERI_ITEMS: {
  icon: LucideIcon;
  title: string;
  desc: string;
  anchor: string;
}[] = [
  {
    icon: Music,
    title: "Paranada (Staff)",
    desc: "5 garis, 4 spasi, ledger lines, dan grand staff.",
    anchor: "#staff",
  },
  {
    icon: KeyRound,
    title: "Kunci (Clef)",
    desc: "Treble, Bass, Alto, Tenor clef dan fungsinya.",
    anchor: "#clef",
  },
  {
    icon: Music2,
    title: "Posisi Not",
    desc: "Posisi setiap not pada treble & bass clef + mnemonic.",
    anchor: "#notes",
  },
  {
    icon: Hash,
    title: "Accidental",
    desc: "Sharp, Flat, Natural, Double Sharp/Flat, enharmonic.",
    anchor: "#accidentals",
  },
  {
    icon: Timer,
    title: "Durasi Not",
    desc: "Whole, half, quarter, eighth, sixteenth, dotted.",
    anchor: "#durations",
  },
  {
    icon: Clock,
    title: "Time Signature",
    desc: "4/4, 3/4, 6/8, cut time, dan compound meter.",
    anchor: "#time-signature",
  },
  {
    icon: KeySquare,
    title: "Key Signature",
    desc: "Tanda kunci sharp/flat dan urutan FCGDAEB / BEADGCF.",
    anchor: "#key-signature",
  },
  {
    icon: CircleDot,
    title: "Circle of Fifths",
    desc: "Diagram hubungan semua key major & minor relatif.",
    anchor: "#circle-of-fifths",
  },
  {
    icon: Volume2,
    title: "Dinamika",
    desc: "pp, p, mp, mf, f, ff, crescendo, decrescendo.",
    anchor: "#dynamics",
  },
  {
    icon: Hand,
    title: "Artikulasi",
    desc: "Staccato, legato, accent, tenuto, fermata, marcato.",
    anchor: "#articulations",
  },
  {
    icon: Gauge,
    title: "Tanda Tempo",
    desc: "Grave – Prestissimo, accelerando, ritardando.",
    anchor: "#tempo",
  },
];

function MateriSection() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">Materi Pembelajaran</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Pelajari semua aspek membaca not balok dalam satu halaman lengkap. Klik
        topik untuk langsung ke bagian yang diinginkan.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MATERI_ITEMS.map((item) => (
          <Link
            key={item.anchor}
            to={`/sight-reading/materi${item.anchor}`}
            className={cn(
              "group rounded-xl border border-border bg-card p-4 text-left transition-all",
              "hover:border-primary hover:shadow-md hover:-translate-y-0.5",
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <item.icon className="size-5 text-primary shrink-0" />
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {item.title}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/sight-reading/materi">
            <BookOpen className="size-4" />
            Buka Semua Materi
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/sight-reading/explorer">
            <Keyboard className="size-4" />
            Explorer Interaktif
          </Link>
        </Button>
      </div>
    </section>
  );
}

// ── Quiz Section ───────────────────────────────────────

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
  intermediate: "border-amber-500/30 bg-amber-500/10 text-amber-600",
  advanced: "border-red-500/30 bg-red-500/10 text-red-600",
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
};

function QuizSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Target className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">Quiz Identifikasi Not</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Pilih topik dan uji kemampuan membaca not balokmu. Setiap quiz berisi 10
        soal.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LESSON_TOPICS.map((topic) => (
          <Link
            key={topic.id}
            to={`/sight-reading/quiz/${topic.id}`}
            className={cn(
              "group rounded-xl border border-border bg-card p-5 text-left transition-all",
              "hover:border-primary hover:shadow-md hover:-translate-y-0.5",
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <topic.icon className="size-6 text-primary" />
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold",
                  DIFFICULTY_COLORS[topic.difficulty],
                )}
              >
                {DIFFICULTY_LABELS[topic.difficulty]}
              </Badge>
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
              {topic.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {topic.description}
            </p>
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {topic.noteRange.slice(0, 6).map((k) => (
                <Badge
                  key={k}
                  variant="secondary"
                  className="text-[10px] font-mono px-1.5 py-0"
                >
                  {k.replace("/", "")}
                </Badge>
              ))}
              {topic.noteRange.length > 6 && (
                <span className="text-[10px] text-muted-foreground">
                  +{topic.noteRange.length - 6} lagi
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
