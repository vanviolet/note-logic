// ════════════════════════════════════════════════════════
// Sight Reading – Materi Pembelajaran (Full Learning Page)
// ════════════════════════════════════════════════════════
//
// /sight-reading/materi
//
// A comprehensive, scrollable learning page covering all
// fundamental music notation topics. Sections are linked
// via anchor IDs for easy navigation from the landing page.
// ════════════════════════════════════════════════════════

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router";
import type { Route } from "./+types";
import type { LucideIcon } from "lucide-react";
import {
  Music,
  Music2,
  KeyRound,
  Hash,
  Clock,
  KeySquare,
  CircleDot,
  Volume2,
  Hand,
  Gauge,
  Keyboard,
  Target,
  Info,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import { Separator } from "~/templates/components/ui/separator";
import { cn } from "~/templates/lib/utils";

const DurationGuide = lazy(() =>
  import("./components/duration-guide").then((m) => ({
    default: m.DurationGuide,
  })),
);

// ── Meta ───────────────────────────────────────────────

export function meta(_: Route.MetaArgs) {
  return [
    { title: "NoteLogic | Materi – Membaca Not Balok" },
    {
      name: "description",
      content:
        "Materi lengkap belajar membaca not balok: paranada, kunci, accidental, durasi, key signature, circle of fifths, dinamika, dan artikulasi.",
    },
  ];
}

// ── Table of Contents ──────────────────────────────────

const TOC = [
  { id: "staff", label: "1. Paranada (Staff)" },
  { id: "clef", label: "2. Kunci (Clef)" },
  { id: "notes", label: "3. Posisi Not" },
  { id: "accidentals", label: "4. Accidental" },
  { id: "durations", label: "5. Durasi Not" },
  { id: "time-signature", label: "6. Time Signature" },
  { id: "key-signature", label: "7. Key Signature" },
  { id: "circle-of-fifths", label: "8. Circle of Fifths" },
  { id: "dynamics", label: "9. Dinamika" },
  { id: "articulations", label: "10. Artikulasi" },
  { id: "tempo", label: "11. Tanda Tempo" },
] as const;

// ── Page Component ─────────────────────────────────────

export default function MateriPage() {
  const [activeSection, setActiveSection] = useState("staff");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track active section on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = TOC.map((t) => document.getElementById(t.id)).filter(
      Boolean,
    ) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    sections.forEach((s) => observerRef.current!.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 space-y-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/sight-reading">← Kembali</Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Materi Membaca Not Balok
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Panduan lengkap untuk membaca notasi musik standar. Scroll ke bawah
          untuk mempelajari setiap topik atau klik daftar isi di samping.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sticky TOC sidebar (desktop) */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-20 space-y-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Daftar Isi
            </p>
            {TOC.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => scrollTo(t.id)}
                className={cn(
                  "block w-full rounded-md px-3 py-1.5 text-left text-xs transition-colors",
                  activeSection === t.id
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
            <Separator className="my-3" />
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/sight-reading/explorer">
                <Keyboard className="size-4" />
                Explorer Interaktif
              </Link>
            </Button>
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 space-y-16">
          <SectionStaff />
          <SectionClef />
          <SectionNotes />
          <SectionAccidentals />
          <Suspense
            fallback={
              <div className="h-48 animate-pulse rounded-xl bg-muted" />
            }
          >
            <section id="durations" className="scroll-mt-24">
              <DurationGuide />
            </section>
          </Suspense>
          <SectionTimeSignature />
          <SectionKeySignature />
          <SectionCircleOfFifths />
          <SectionDynamics />
          <SectionArticulations />
          <SectionTempo />

          {/* Final CTA */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Siap Menguji Kemampuanmu?</h2>
            <p className="text-muted-foreground">
              Setelah membaca materi, lanjutkan ke quiz atau explorer untuk
              berlatih secara interaktif.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/sight-reading">
                  <Target className="size-4" />
                  Pilih Quiz
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/sight-reading/explorer">
                  <Keyboard className="size-4" />
                  Explorer Interaktif
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ════════════════════════════════════════════════════════

function SectionHeading({
  id,
  icon: Icon,
  title,
  subtitle,
}: {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-1 mb-6">
      <h2
        id={id}
        className="scroll-mt-24 text-2xl font-bold flex items-center gap-2"
      >
        <Icon className="size-6 text-primary" />
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function InfoBox({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "tip" | "warning";
}) {
  const colors = {
    info: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300",
    tip: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
    warning:
      "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300",
  };
  const iconMap = {
    info: Info,
    tip: Lightbulb,
    warning: AlertTriangle,
  };
  const IconComp = iconMap[variant];
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border p-4 text-sm",
        colors[variant],
      )}
    >
      <IconComp className="size-4 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

// ── 1. STAFF ───────────────────────────────────────────

function SectionStaff() {
  return (
    <section>
      <SectionHeading
        id="staff"
        icon={Music}
        title="Paranada (Staff)"
        subtitle="Fondasi penulisan musik: 5 garis dan 4 spasi."
      />
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-semibold">Apa itu Paranada?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Paranada (staff) adalah kumpulan{" "}
              <strong>5 garis horizontal</strong> yang membentuk{" "}
              <strong>4 spasi</strong> di antaranya. Setiap garis dan spasi
              mewakili nada yang berbeda. Garis dihitung dari bawah ke atas
              (garis ke-1 paling bawah).
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            {/* Visual staff representation */}
            <div className="relative mx-auto w-full max-w-xs py-6">
              {[1, 2, 3, 4, 5].map((line) => (
                <div key={line} className="relative">
                  <div className="h-px bg-foreground/40" />
                  <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono">
                    {6 - line}
                  </span>
                  {line < 5 && <div className="h-5" />}
                </div>
              ))}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                5 garis, 4 spasi (dihitung dari bawah)
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4 space-y-2">
            <h4 className="text-sm font-semibold">Ledger Lines</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Not yang melebihi jangkauan 5 garis ditulis dengan{" "}
              <strong>garis bantu (ledger lines)</strong> — garis pendek di atas
              atau bawah paranada. Contoh: Middle C (C4) pada treble clef
              memerlukan 1 ledger line di bawah.
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 space-y-2">
            <h4 className="text-sm font-semibold">Grand Staff</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dua paranada yang digabungkan (treble + bass) membentuk{" "}
              <strong>Grand Staff</strong>, biasa digunakan untuk piano. Tanda
              kurung kurawal ({"{}"}) menghubungkan kedua staff. Middle C berada
              di antara kedua staff.
            </p>
          </div>
        </div>

        <InfoBox variant="tip">
          <strong>Tips:</strong> Bayangkan paranada sebagai "tangga nada" —
          semakin tinggi posisi not, semakin tinggi nadanya.
        </InfoBox>
      </div>
    </section>
  );
}

// ── 2. CLEF ────────────────────────────────────────────

function SectionClef() {
  const clefs = [
    {
      name: "Treble Clef (G Clef)",
      symbol: "𝄞",
      description:
        "Menandai garis ke-2 sebagai not G4. Digunakan untuk nada tinggi: suara sopran, alto, gitar, piano tangan kanan, biola, flute.",
      range: "C4 (Middle C) – G5+",
      mnemonic: "Lines: EGBDF • Spaces: FACE",
      color: "border-blue-500/30 bg-blue-500/5",
    },
    {
      name: "Bass Clef (F Clef)",
      symbol: "𝄢",
      description:
        "Menandai garis ke-4 sebagai not F3. Digunakan untuk nada rendah: suara bass, baritone, cello, piano tangan kiri, tuba.",
      range: "E2 – C4 (Middle C)",
      mnemonic: "Lines: GBDFA • Spaces: ACEG",
      color: "border-amber-500/30 bg-amber-500/5",
    },
    {
      name: "Alto Clef (C Clef)",
      symbol: "𝄡",
      description:
        "Menandai garis ke-3 sebagai Middle C. Digunakan terutama oleh viola.",
      range: "F3 – G5",
      mnemonic: "Lines: FACEГ • Spaces: EGBD",
      color: "border-purple-500/30 bg-purple-500/5",
    },
    {
      name: "Tenor Clef (C Clef)",
      symbol: "𝄡",
      description:
        "Menandai garis ke-4 sebagai Middle C. Digunakan oleh cello, bassoon, dan trombone di register tinggi.",
      range: "D3 – E5",
      mnemonic: "Lines: DFACE • Spaces: CEGB",
      color: "border-teal-500/30 bg-teal-500/5",
    },
  ];

  return (
    <section>
      <SectionHeading
        id="clef"
        icon={KeyRound}
        title="Kunci (Clef)"
        subtitle="Simbol di awal paranada yang menentukan nama nada setiap garis/spasi."
      />
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Clef (kunci) adalah simbol yang ditempatkan di awal paranada untuk
          menentukan <strong>posisi referensi</strong> nada. Tanpa clef, kita
          tidak tahu not mana yang berada di garis atau spasi tertentu.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {clefs.map((c) => (
            <div
              key={c.name}
              className={cn("rounded-xl border p-5 space-y-3", c.color)}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none">{c.symbol}</span>
                <h3 className="font-semibold">{c.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {c.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  Range: {c.range}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {c.mnemonic}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <InfoBox>
          Treble dan Bass clef adalah yang paling umum. Jika kamu belajar gitar
          atau piano, fokus pada kedua ini terlebih dahulu.
        </InfoBox>
      </div>
    </section>
  );
}

// ── 3. NOTE POSITIONS ──────────────────────────────────

function SectionNotes() {
  const trebleLines = [
    { note: "E4", pos: "Garis 1" },
    { note: "G4", pos: "Garis 2" },
    { note: "B4", pos: "Garis 3" },
    { note: "D5", pos: "Garis 4" },
    { note: "F5", pos: "Garis 5" },
  ];
  const trebleSpaces = [
    { note: "F4", pos: "Spasi 1" },
    { note: "A4", pos: "Spasi 2" },
    { note: "C5", pos: "Spasi 3" },
    { note: "E5", pos: "Spasi 4" },
  ];
  const bassLines = [
    { note: "G2", pos: "Garis 1" },
    { note: "B2", pos: "Garis 2" },
    { note: "D3", pos: "Garis 3" },
    { note: "F3", pos: "Garis 4" },
    { note: "A3", pos: "Garis 5" },
  ];
  const bassSpaces = [
    { note: "A2", pos: "Spasi 1" },
    { note: "C3", pos: "Spasi 2" },
    { note: "E3", pos: "Spasi 3" },
    { note: "G3", pos: "Spasi 4" },
  ];

  return (
    <section>
      <SectionHeading
        id="notes"
        icon={Music2}
        title="Posisi Not pada Paranada"
        subtitle="Setiap garis dan spasi mewakili nada tertentu tergantung clef."
      />
      <div className="space-y-6">
        {/* Treble Clef Notes */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <span className="text-lg">𝄞</span> Treble Clef
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <NoteTable
              title="Garis (EGBDF)"
              subtitle="Every Good Boy Does Fine"
              items={trebleLines}
              color="bg-blue-500"
            />
            <NoteTable
              title="Spasi (FACE)"
              subtitle='Mudah diingat — "FACE"'
              items={trebleSpaces}
              color="bg-emerald-500"
            />
          </div>
        </div>

        {/* Bass Clef Notes */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <span className="text-lg">𝄢</span> Bass Clef
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <NoteTable
              title="Garis (GBDFA)"
              subtitle="Good Boys Do Fine Always"
              items={bassLines}
              color="bg-amber-500"
            />
            <NoteTable
              title="Spasi (ACEG)"
              subtitle="All Cows Eat Grass"
              items={bassSpaces}
              color="bg-purple-500"
            />
          </div>
        </div>

        <InfoBox variant="tip">
          <strong>Latihan:</strong> Cobalah{" "}
          <Link
            to="/sight-reading/explorer"
            className="underline font-semibold"
          >
            Explorer Interaktif
          </Link>{" "}
          untuk melihat dan mendengar setiap not secara langsung!
        </InfoBox>
      </div>
    </section>
  );
}

function NoteTable({
  title,
  subtitle,
  items,
  color,
}: {
  title: string;
  subtitle: string;
  items: { note: string; pos: string }[];
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4 space-y-2">
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="text-[10px] text-muted-foreground">{subtitle}</p>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.note} className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "inline-flex h-6 w-10 items-center justify-center rounded font-mono font-bold text-white",
                color,
              )}
            >
              {item.note}
            </span>
            <span className="text-muted-foreground">{item.pos}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 4. ACCIDENTALS ─────────────────────────────────────

function SectionAccidentals() {
  const accidentals = [
    {
      symbol: "♯",
      name: "Sharp",
      nameId: "Kres",
      description:
        "Menaikkan nada sebanyak 1 semitone (setengah langkah). Contoh: F♯ adalah satu semitone di atas F.",
      example: "C → C♯, F → F♯, G → G♯",
    },
    {
      symbol: "♭",
      name: "Flat",
      nameId: "Mol",
      description:
        "Menurunkan nada sebanyak 1 semitone. Contoh: B♭ adalah satu semitone di bawah B.",
      example: "B → B♭, E → E♭, A → A♭",
    },
    {
      symbol: "♮",
      name: "Natural",
      nameId: "Pugar",
      description:
        "Membatalkan sharp atau flat yang sebelumnya berlaku. Mengembalikan nada ke bentuk asli.",
      example: "F♯ → F♮ (kembali ke F natural)",
    },
    {
      symbol: "𝄪",
      name: "Double Sharp",
      nameId: "Kres Ganda",
      description:
        "Menaikkan nada sebanyak 2 semitone (1 whole step). Jarang digunakan, muncul di kunci dengan banyak sharp.",
      example: "F𝄪 = G (enharmonic)",
    },
    {
      symbol: "𝄫",
      name: "Double Flat",
      nameId: "Mol Ganda",
      description:
        "Menurunkan nada sebanyak 2 semitone. Jarang digunakan, muncul di kunci dengan banyak flat.",
      example: "B𝄫 = A (enharmonic)",
    },
  ];

  return (
    <section>
      <SectionHeading
        id="accidentals"
        icon={Hash}
        title="Accidental (Tanda Kromatis)"
        subtitle="Simbol yang mengubah nada naik atau turun dari posisi aslinya."
      />
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Accidental mengubah pitch sebuah not. Tanda ini berlaku untuk{" "}
          <strong>seluruh birama</strong> tempat ia ditulis (kecuali jika
          dibatalkan oleh natural). Accidental pada key signature berlaku untuk{" "}
          <strong>seluruh lagu</strong>.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {accidentals.map((a) => (
            <div
              key={a.name}
              className="rounded-xl border border-border bg-card p-4 space-y-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold leading-none">
                  {a.symbol}
                </span>
                <div>
                  <p className="font-semibold text-sm">{a.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {a.nameId}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {a.description}
              </p>
              <Badge variant="secondary" className="text-[10px] font-mono">
                {a.example}
              </Badge>
            </div>
          ))}
        </div>

        {/* Enharmonic equivalents */}
        <div className="rounded-xl border border-border p-5 space-y-3">
          <h3 className="font-semibold text-sm">Enharmonic Equivalents</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Dua not dengan nama berbeda tapi bunyi (pitch) yang sama disebut{" "}
            <strong>enharmonic</strong>. Ini penting untuk memahami notasi di
            berbagai key signature.
          </p>
          <div className="flex flex-wrap gap-2">
            {["C♯ = D♭", "D♯ = E♭", "F♯ = G♭", "G♯ = A♭", "A♯ = B♭"].map(
              (pair) => (
                <Badge
                  key={pair}
                  variant="outline"
                  className="font-mono text-xs"
                >
                  {pair}
                </Badge>
              ),
            )}
          </div>
        </div>

        {/* Cross-reference to Interval Explorer */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <h3 className="font-semibold text-sm">🔗 Eksplorasi Interaktif</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pelajari bagaimana accidental dan semitone membentuk interval
            berbeda. Dengarkan setiap interval secara langsung.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/interval"
              className="inline-flex items-center rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/10"
            >
              Interval Explorer →
            </Link>
            <Link
              to="/chord"
              className="inline-flex items-center rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/10"
            >
              Chord Explorer →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 6. TIME SIGNATURE ──────────────────────────────────

function SectionTimeSignature() {
  const signatures = [
    {
      symbol: "4/4",
      alt: "𝄴 (Common Time)",
      nameId: "Empat Per Empat",
      description:
        "4 ketuk per birama, quarter note = 1 ketuk. Paling umum digunakan di pop, rock, jazz.",
      beats: [1, 1, 1, 1],
      accent: [3, 1, 2, 1],
    },
    {
      symbol: "3/4",
      alt: "Waltz Time",
      nameId: "Tiga Per Empat",
      description:
        "3 ketuk per birama. Digunakan di waltz, minuet, dan banyak musik klasik.",
      beats: [1, 1, 1],
      accent: [3, 1, 1],
    },
    {
      symbol: "2/4",
      alt: "March Time",
      nameId: "Dua Per Empat",
      description:
        "2 ketuk per birama. Umum pada march, polka, dan beberapa lagu rakyat.",
      beats: [1, 1],
      accent: [3, 1],
    },
    {
      symbol: "6/8",
      alt: "Compound Duple",
      nameId: "Enam Per Delapan",
      description:
        "6 eighth notes per birama, dikelompokkan 3+3. Terasa seperti 2 ketuk besar. Umum pada jig, ballad.",
      beats: [1, 1, 1, 1, 1, 1],
      accent: [3, 1, 1, 2, 1, 1],
    },
    {
      symbol: "2/2",
      alt: "𝄵 (Cut Time / Alla Breve)",
      nameId: "Dua Per Dua",
      description:
        "2 ketuk per birama, half note = 1 ketuk. Terasa cepat, digunakan di march cepat dan musik orkestra.",
      beats: [1, 1],
      accent: [3, 1],
    },
  ];

  return (
    <section>
      <SectionHeading
        id="time-signature"
        icon={Clock}
        title="Time Signature (Tanda Birama)"
        subtitle="Angka di awal staff yang mengatur berapa ketuk per birama."
      />
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Time signature ditulis sebagai pecahan: <strong>angka atas</strong> =
          jumlah ketuk per birama, <strong>angka bawah</strong> = jenis not yang
          menjadi 1 ketuk (4 = quarter, 8 = eighth, 2 = half).
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {signatures.map((ts) => (
            <div
              key={ts.symbol}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold font-mono leading-none">
                  {ts.symbol}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {ts.alt}
                </Badge>
              </div>
              <p className="text-xs font-medium">{ts.nameId}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {ts.description}
              </p>
              {/* Beat visualization */}
              <div className="flex gap-0.5">
                {ts.accent.map((level, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-4 flex-1 rounded-sm",
                      level === 3
                        ? "bg-primary"
                        : level === 2
                          ? "bg-primary/50"
                          : "bg-primary/20",
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Tebal = aksen kuat, tipis = aksen lemah
              </p>
            </div>
          ))}
        </div>

        <InfoBox variant="tip">
          <strong>Cara membaca:</strong> 4/4 berarti "ada 4 ketuk tiap birama
          dan quarter note bernilai 1 ketuk." 6/8 berarti "ada 6 eighth notes
          tiap birama."
        </InfoBox>
      </div>
    </section>
  );
}

// ── 7. KEY SIGNATURE ───────────────────────────────────

function SectionKeySignature() {
  const sharpKeys = [
    { key: "G Major / E minor", sharps: 1, notes: "F♯" },
    { key: "D Major / B minor", sharps: 2, notes: "F♯ C♯" },
    { key: "A Major / F♯ minor", sharps: 3, notes: "F♯ C♯ G♯" },
    { key: "E Major / C♯ minor", sharps: 4, notes: "F♯ C♯ G♯ D♯" },
    { key: "B Major / G♯ minor", sharps: 5, notes: "F♯ C♯ G♯ D♯ A♯" },
    { key: "F♯ Major / D♯ minor", sharps: 6, notes: "F♯ C♯ G♯ D♯ A♯ E♯" },
    {
      key: "C♯ Major / A♯ minor",
      sharps: 7,
      notes: "F♯ C♯ G♯ D♯ A♯ E♯ B♯",
    },
  ];

  const flatKeys = [
    { key: "F Major / D minor", flats: 1, notes: "B♭" },
    { key: "B♭ Major / G minor", flats: 2, notes: "B♭ E♭" },
    { key: "E♭ Major / C minor", flats: 3, notes: "B♭ E♭ A♭" },
    { key: "A♭ Major / F minor", flats: 4, notes: "B♭ E♭ A♭ D♭" },
    { key: "D♭ Major / B♭ minor", flats: 5, notes: "B♭ E♭ A♭ D♭ G♭" },
    { key: "G♭ Major / E♭ minor", flats: 6, notes: "B♭ E♭ A♭ D♭ G♭ C♭" },
    {
      key: "C♭ Major / A♭ minor",
      flats: 7,
      notes: "B♭ E♭ A♭ D♭ G♭ C♭ F♭",
    },
  ];

  return (
    <section>
      <SectionHeading
        id="key-signature"
        icon={KeySquare}
        title="Key Signature (Tanda Kunci)"
        subtitle="Kumpulan sharp/flat di awal staff yang berlaku sepanjang lagu."
      />
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Key signature ditulis setelah clef dan berlaku untuk{" "}
          <strong>setiap not yang disebutkan</strong> di seluruh lagu. Tidak
          perlu menulis accidental berulang. Kunci C Major / A minor tidak
          memiliki sharp atau flat.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Sharp keys */}
          <div className="rounded-xl border border-border p-4 space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              ♯ Sharp Keys
              <Badge variant="secondary" className="text-[10px]">
                Urutan: FCGDAEB
              </Badge>
            </h3>
            <div className="space-y-1">
              {sharpKeys.map((k) => (
                <div
                  key={k.key}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-medium">{k.key}</span>
                  <span className="font-mono text-muted-foreground">
                    {k.sharps}♯ — {k.notes}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Flat keys */}
          <div className="rounded-xl border border-border p-4 space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              ♭ Flat Keys
              <Badge variant="secondary" className="text-[10px]">
                Urutan: BEADGCF
              </Badge>
            </h3>
            <div className="space-y-1">
              {flatKeys.map((k) => (
                <div
                  key={k.key}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-medium">{k.key}</span>
                  <span className="font-mono text-muted-foreground">
                    {k.flats}♭ — {k.notes}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <InfoBox variant="tip">
          <strong>Trik menghafal urutan sharp:</strong> "Father Charles Goes
          Down And Ends Battle" (FCGDAEB). <strong>Flat kebalikannya:</strong>{" "}
          "Battle Ends And Down Goes Charles' Father" (BEADGCF).
        </InfoBox>

        {/* Cross-reference to Family Explorer */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <h3 className="font-semibold text-sm">🔗 Eksplorasi Interaktif</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Lihat chord apa saja yang muncul di key signature tertentu, lengkap
            dengan fungsi harmonik (Tonik, Subdominan, Dominan).
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/family"
              className="inline-flex items-center rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/10"
            >
              Family Explorer →
            </Link>
            <Link
              to="/interval"
              className="inline-flex items-center rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/10"
            >
              Interval Explorer →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 8. CIRCLE OF FIFTHS ────────────────────────────────

function SectionCircleOfFifths() {
  const keys = [
    { name: "C", sharps: 0, flats: 0, angle: -90, minor: "Am" },
    { name: "G", sharps: 1, flats: 0, angle: -60, minor: "Em" },
    { name: "D", sharps: 2, flats: 0, angle: -30, minor: "Bm" },
    { name: "A", sharps: 3, flats: 0, angle: 0, minor: "F♯m" },
    { name: "E", sharps: 4, flats: 0, angle: 30, minor: "C♯m" },
    { name: "B/C♭", sharps: 5, flats: 7, angle: 60, minor: "G♯m" },
    { name: "F♯/G♭", sharps: 6, flats: 6, angle: 90, minor: "D♯m/E♭m" },
    { name: "D♭/C♯", sharps: 7, flats: 5, angle: 120, minor: "B♭m/A♯m" },
    { name: "A♭", sharps: 0, flats: 4, angle: 150, minor: "Fm" },
    { name: "E♭", sharps: 0, flats: 3, angle: 180, minor: "Cm" },
    { name: "B♭", sharps: 0, flats: 2, angle: 210, minor: "Gm" },
    { name: "F", sharps: 0, flats: 1, angle: 240, minor: "Dm" },
  ];

  const rad = (deg: number) => (deg * Math.PI) / 180;
  const R = 140; // outer radius for major keys
  const r = 100; // inner radius for minor keys

  return (
    <section>
      <SectionHeading
        id="circle-of-fifths"
        icon={CircleDot}
        title="Circle of Fifths"
        subtitle="Diagram yang menunjukkan hubungan semua key signature."
      />
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Circle of Fifths adalah diagram melingkar yang mengurutkan 12 key
          berdasarkan interval <strong>perfect fifth</strong> (searah jarum jam)
          atau <strong>perfect fourth</strong> (berlawanan). Kunci di lingkaran
          luar = <strong>major</strong>, dalam = <strong>minor relatif</strong>.
        </p>

        <div className="flex justify-center">
          <div className="relative rounded-xl border border-border bg-card p-4">
            <svg
              viewBox="-200 -200 400 400"
              className="mx-auto w-full max-w-sm"
            >
              {/* Outer circle */}
              <circle
                cx={0}
                cy={0}
                r={R + 20}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.15}
              />
              <circle
                cx={0}
                cy={0}
                r={r - 10}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.1}
              />

              {keys.map((k) => {
                const mx = R * Math.cos(rad(k.angle));
                const my = R * Math.sin(rad(k.angle));
                const minX = r * Math.cos(rad(k.angle));
                const minY = r * Math.sin(rad(k.angle));
                return (
                  <g key={k.name}>
                    {/* Major key (outer) */}
                    <circle
                      cx={mx}
                      cy={my}
                      r={22}
                      className="fill-primary/10 stroke-primary/40"
                      strokeWidth={1.5}
                    />
                    <text
                      x={mx}
                      y={my}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-foreground text-[11px] font-bold"
                    >
                      {k.name}
                    </text>
                    {/* Minor key (inner) */}
                    <circle
                      cx={minX}
                      cy={minY}
                      r={18}
                      className="fill-muted stroke-border"
                      strokeWidth={1}
                    />
                    <text
                      x={minX}
                      y={minY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-muted-foreground text-[9px] font-medium"
                    >
                      {k.minor}
                    </text>
                  </g>
                );
              })}

              {/* Labels */}
              <text
                x={0}
                y={-170}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                0♯ 0♭
              </text>
              <text
                x={170}
                y={0}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                Sharps →
              </text>
              <text
                x={-170}
                y={0}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                ← Flats
              </text>
            </svg>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border p-4 space-y-1">
            <h4 className="text-sm font-semibold">Searah Jarum Jam</h4>
            <p className="text-xs text-muted-foreground">
              Setiap langkah = naik perfect fifth (7 semitone). Sharp bertambah.
              C → G → D → A → E → B → F♯
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 space-y-1">
            <h4 className="text-sm font-semibold">Berlawanan Jarum Jam</h4>
            <p className="text-xs text-muted-foreground">
              Setiap langkah = naik perfect fourth (5 semitone). Flat bertambah.
              C → F → B♭ → E♭ → A♭ → D♭ → G♭
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 space-y-1">
            <h4 className="text-sm font-semibold">Minor Relatif</h4>
            <p className="text-xs text-muted-foreground">
              Setiap key major punya minor relatif (3 semitone di bawah).
              Keduanya berbagi key signature yang sama.
            </p>
          </div>
        </div>

        {/* Cross-reference to Family & Chord Explorers */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <h3 className="font-semibold text-sm">🔗 Eksplorasi Interaktif</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Circle of Fifths langsung terhubung ke family chord di setiap key.
            Eksplorasi chord, interval, dan skala secara interaktif.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/family?root=C&scale=major"
              className="inline-flex items-center rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/10"
            >
              Family C Major →
            </Link>
            <Link
              to="/family?root=A&scale=minor"
              className="inline-flex items-center rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/10"
            >
              Family A Minor →
            </Link>
            <Link
              to="/chord"
              className="inline-flex items-center rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/10"
            >
              Chord Explorer →
            </Link>
            <Link
              to="/interval"
              className="inline-flex items-center rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/10"
            >
              Interval Explorer →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 9. DYNAMICS ────────────────────────────────────────

function SectionDynamics() {
  const dynamics = [
    { symbol: "𝆏𝆏", name: "pianissimo", nameId: "Sangat lembut", level: 1 },
    { symbol: "𝆏", name: "piano", nameId: "Lembut", level: 2 },
    { symbol: "𝆐𝆏", name: "mezzo-piano", nameId: "Agak lembut", level: 3 },
    { symbol: "𝆐𝆑", name: "mezzo-forte", nameId: "Agak keras", level: 4 },
    { symbol: "𝆑", name: "forte", nameId: "Keras", level: 5 },
    { symbol: "𝆑𝆑", name: "fortissimo", nameId: "Sangat keras", level: 6 },
  ];

  const gradual = [
    {
      symbol: "━━━━━━▷",
      name: "Crescendo",
      nameId: "Makin keras secara bertahap",
      description:
        "Ditandai dengan garis buka (< hairpin) atau tulisan 'cresc.' Volume meningkat perlahan.",
    },
    {
      symbol: "◁━━━━━━",
      name: "Decrescendo / Diminuendo",
      nameId: "Makin lembut secara bertahap",
      description:
        "Ditandai dengan garis tutup (> hairpin) atau tulisan 'dim.' Volume menurun perlahan.",
    },
    {
      symbol: "𝆑𝆏",
      name: "Fortepiano",
      nameId: "Keras lalu langsung lembut",
      description:
        "Mulai keras kemudian langsung pelan. Kontras dinamis yang dramatis.",
    },
    {
      symbol: "𝆐𝆑 — 𝆏",
      name: "Sforzando (sfz)",
      nameId: "Aksen tiba-tiba lalu kembali",
      description:
        "Not dimainkan dengan tekanan kuat secara tiba-tiba, lalu kembali ke volume sebelumnya.",
    },
  ];

  return (
    <section>
      <SectionHeading
        id="dynamics"
        icon={Volume2}
        title="Dinamika (Dynamics)"
        subtitle="Tanda yang mengatur volume/keras-lembutnya permainan musik."
      />
      <div className="space-y-6">
        {/* Volume levels */}
        <div className="rounded-xl border border-border p-5 space-y-4">
          <h3 className="font-semibold text-sm">Tingkat Volume</h3>
          <div className="space-y-2">
            {dynamics.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="w-12 text-center text-lg font-bold">
                  {d.symbol}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium italic">{d.name}</span>
                    <span className="text-xs text-muted-foreground">
                      — {d.nameId}
                    </span>
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-2 flex-1 rounded-sm",
                          i < d.level ? "bg-primary" : "bg-muted",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradual dynamics */}
        <div className="grid gap-3 sm:grid-cols-2">
          {gradual.map((g) => (
            <div
              key={g.name}
              className="rounded-xl border border-border bg-card p-4 space-y-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono">{g.symbol}</span>
                <div>
                  <p className="font-semibold text-sm">{g.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {g.nameId}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {g.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 10. ARTICULATIONS ──────────────────────────────────

function SectionArticulations() {
  const articulations = [
    {
      symbol: "•",
      name: "Staccato",
      nameId: "Pendek / terputus",
      description:
        "Not dimainkan pendek dan terpisah (sekitar setengah durasi aslinya). Ditandai titik di atas/bawah not.",
      visual: "♩• ♩• ♩• ♩•",
    },
    {
      symbol: "–",
      name: "Tenuto",
      nameId: "Tahan penuh",
      description:
        "Not dimainkan penuh durasinya tanpa jeda. Ditandai garis pendek di atas/bawah not.",
      visual: "♩— ♩— ♩— ♩—",
    },
    {
      symbol: ">",
      name: "Accent",
      nameId: "Tekanan / penekanan",
      description:
        "Not dimainkan lebih keras dari not sekitarnya. Ditandai tanda > di atas/bawah not.",
      visual: "♩> ♩ ♩> ♩",
    },
    {
      symbol: "⌢",
      name: "Legato / Slur",
      nameId: "Halus / tersambung",
      description:
        "Serangkaian not dimainkan menyambung tanpa jeda. Ditandai garis lengkung (kurva) di atas/bawah not.",
      visual: "♩⌢♩⌢♩⌢♩",
    },
    {
      symbol: "𝄐",
      name: "Fermata",
      nameId: "Tahan lebih lama",
      description:
        "Not (atau istirahat) ditahan lebih lama dari nilai normalnya. Biasa 1.5–2× durasi asli. Keputusan ada pada konduktor/pemain.",
      visual: "♩ ♩ 𝄐♩ ♩",
    },
    {
      symbol: "⌢",
      name: "Tie",
      nameId: "Ikatan nada",
      description:
        "Menghubungkan dua not dengan pitch SAMA menjadi satu durasi gabungan. Berbeda dengan slur yang menghubungkan not berbeda.",
      visual: "♩⌢♩ = 𝅗𝅥",
    },
    {
      symbol: "∨",
      name: "Down-bow",
      nameId: "Gesekan ke bawah",
      description:
        "Untuk instrumen gesek: arah bow dari pangkal ke ujung. Menghasilkan suara yang lebih kuat.",
      visual: "∨ (violin, cello)",
    },
    {
      symbol: "∧",
      name: "Up-bow",
      nameId: "Gesekan ke atas",
      description:
        "Untuk instrumen gesek: arah bow dari ujung ke pangkal. Menghasilkan suara yang lebih ringan.",
      visual: "∧ (violin, cello)",
    },
    {
      symbol: "▸",
      name: "Marcato",
      nameId: "Sangat tegas",
      description:
        "Kombinasi accent dan staccato — not dimainkan keras DAN pendek. Kontras yang kuat.",
      visual: "♩▸ ♩ ♩▸ ♩",
    },
  ];

  return (
    <section>
      <SectionHeading
        id="articulations"
        icon={Hand}
        title="Artikulasi (Articulation)"
        subtitle="Tanda yang mengatur cara not dimainkan: pendek, panjang, halus, atau tegas."
      />
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Artikulasi memberi instruksi tentang <strong>karakter</strong> setiap
          not — apakah harus pendek (staccato), tersambung (legato), atau
          ditekan (accent). Ini membuat musik lebih ekspresif.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articulations.map((a, i) => (
            <div
              key={`${a.name}-${i}`}
              className="rounded-xl border border-border bg-card p-4 space-y-2"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl font-bold">
                  {a.symbol}
                </span>
                <div>
                  <p className="font-semibold text-sm">{a.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {a.nameId}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {a.description}
              </p>
              <Badge variant="secondary" className="text-[10px] font-mono">
                {a.visual}
              </Badge>
            </div>
          ))}
        </div>

        <InfoBox>
          <strong>Staccato vs Legato</strong> adalah pasangan dasar artikulasi.
          Staccato = terputus-putus, Legato = menyambung. Keduanya mengubah
          karakter musik secara drastis meski not dan ritmiknya sama.
        </InfoBox>
      </div>
    </section>
  );
}

// ── 11. TEMPO ──────────────────────────────────────────

function SectionTempo() {
  const tempos = [
    {
      name: "Grave",
      bpm: "20–40",
      nameId: "Sangat lambat dan berat",
      category: "slow",
    },
    {
      name: "Largo",
      bpm: "40–60",
      nameId: "Lambat dan megah",
      category: "slow",
    },
    {
      name: "Adagio",
      bpm: "60–76",
      nameId: "Lambat, tenang",
      category: "slow",
    },
    {
      name: "Andante",
      bpm: "76–108",
      nameId: "Berjalan, sedang",
      category: "moderate",
    },
    {
      name: "Moderato",
      bpm: "108–120",
      nameId: "Sedang",
      category: "moderate",
    },
    {
      name: "Allegretto",
      bpm: "112–120",
      nameId: "Agak cepat, ringan",
      category: "moderate",
    },
    {
      name: "Allegro",
      bpm: "120–156",
      nameId: "Cepat dan gembira",
      category: "fast",
    },
    {
      name: "Vivace",
      bpm: "156–176",
      nameId: "Hidup, sangat cepat",
      category: "fast",
    },
    {
      name: "Presto",
      bpm: "168–200",
      nameId: "Sangat cepat",
      category: "fast",
    },
    {
      name: "Prestissimo",
      bpm: "200+",
      nameId: "Secepat mungkin",
      category: "fast",
    },
  ];

  const tempoChanges = [
    {
      name: "Accelerando (accel.)",
      description: "Makin cepat secara bertahap.",
    },
    {
      name: "Ritardando (rit.)",
      description: "Makin lambat secara bertahap.",
    },
    {
      name: "Rallentando (rall.)",
      description: "Melambat (sinonim ritardando).",
    },
    { name: "A tempo", description: "Kembali ke tempo awal." },
    { name: "Rubato", description: "Tempo fleksibel, ekspresif." },
    {
      name: "Fermata (𝄐)",
      description: "Tahan not lebih lama, tempo berhenti sesaat.",
    },
  ];

  const categoryColors: Record<string, string> = {
    slow: "bg-blue-500",
    moderate: "bg-amber-500",
    fast: "bg-red-500",
  };

  return (
    <section>
      <SectionHeading
        id="tempo"
        icon={Gauge}
        title="Tanda Tempo"
        subtitle="Istilah Italia yang menentukan kecepatan permainan musik."
      />
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tempo ditulis di awal lagu (di atas staff) menggunakan istilah Italia
          atau angka BPM (beats per minute). Tempo juga bisa berubah di tengah
          lagu dengan tanda khusus.
        </p>

        {/* Tempo table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2 text-left font-semibold">Tempo</th>
                  <th className="px-4 py-2 text-left font-semibold">BPM</th>
                  <th className="px-4 py-2 text-left font-semibold">Arti</th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Kecepatan
                  </th>
                </tr>
              </thead>
              <tbody>
                {tempos.map((t) => (
                  <tr
                    key={t.name}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="px-4 py-2 font-medium italic">{t.name}</td>
                    <td className="px-4 py-2 font-mono text-xs">{t.bpm}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {t.nameId}
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            categoryColors[t.category],
                          )}
                          style={{
                            width: `${Math.min(100, (parseInt(t.bpm) / 200) * 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tempo changes */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Perubahan Tempo</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tempoChanges.map((tc) => (
              <div
                key={tc.name}
                className="rounded-lg border border-border p-3 space-y-1"
              >
                <p className="text-sm font-semibold italic">{tc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {tc.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <InfoBox variant="tip">
          <strong>Panduan praktis:</strong> Allegro (♩=120–156) adalah tempo
          paling umum di musik populer. Andante (♩=76–108) cocok untuk ballad.
          Gunakan metronome untuk latihan.
        </InfoBox>
      </div>
    </section>
  );
}
