// ════════════════════════════════════════════════════════
// DurationGuide – Visual note duration learning
// ════════════════════════════════════════════════════════
//
// Interactive guide for understanding note durations.
// Uses VexFlow to render each duration type with visual
// comparisons and beat-value grids.
// ════════════════════════════════════════════════════════

import { memo, useState, useCallback } from "react";
import { Timer, Target } from "lucide-react";
import { DurationComparisonRenderer } from "./staff-renderer";
import { Badge } from "~/templates/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/templates/components/ui/tabs";
import { DURATION_TOPICS } from "../lib/note-data";
import type { DurationTopic } from "../types";
import { cn } from "~/templates/lib/utils";

// ── Duration Info Map ──────────────────────────────────

const DURATION_DETAILS: Record<
  string,
  {
    nameId: string;
    nameEn: string;
    symbol: string;
    description: string;
    restSymbol: string;
  }
> = {
  whole: {
    nameId: "Not Penuh",
    nameEn: "Whole Note",
    symbol: "𝅝",
    restSymbol: "𝄻",
    description:
      "Nilai terpanjang umum. Berbentuk bulat tanpa tangkai. Bernilai 4 ketuk pada birama 4/4.",
  },
  half: {
    nameId: "Not Setengah",
    nameEn: "Half Note",
    symbol: "𝅗𝅥",
    restSymbol: "𝄼",
    description:
      "Setengah dari whole note. Berbentuk bulat terbuka dengan tangkai. Bernilai 2 ketuk.",
  },
  quarter: {
    nameId: "Not Seperempat",
    nameEn: "Quarter Note",
    symbol: "♩",
    restSymbol: "𝄽",
    description:
      "Not paling umum digunakan. Berbentuk bulat terisi dengan tangkai. Bernilai 1 ketuk.",
  },
  eighth: {
    nameId: "Not Seperdelapan",
    nameEn: "Eighth Note",
    symbol: "♪",
    restSymbol: "𝄾",
    description:
      "Setengah dari quarter note. Memiliki satu bendera pada tangkai. Bernilai ½ ketuk.",
  },
  sixteenth: {
    nameId: "Not Seperenambelas",
    nameEn: "Sixteenth Note",
    symbol: "♬",
    restSymbol: "𝄿",
    description:
      "Setengah dari eighth note. Memiliki dua bendera pada tangkai. Bernilai ¼ ketuk.",
  },
  "dotted-half": {
    nameId: "Not Setengah Bertitik",
    nameEn: "Dotted Half Note",
    symbol: "𝅗𝅥.",
    restSymbol: "𝄼.",
    description:
      "Half note dengan titik menambah setengah nilainya. Bernilai 3 ketuk (2 + 1).",
  },
  "dotted-quarter": {
    nameId: "Not Seperempat Bertitik",
    nameEn: "Dotted Quarter Note",
    symbol: "♩.",
    restSymbol: "𝄽.",
    description:
      "Quarter note dengan titik. Bernilai 1,5 ketuk (1 + 0.5). Umum pada birama 6/8.",
  },
};

// ── Main Component ─────────────────────────────────────

export const DurationGuide = memo(function DurationGuide() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">
          Panduan Nilai Not (Durasi)
        </h2>
        <p className="text-sm text-muted-foreground">
          Pelajari berapa lama setiap jenis not dimainkan. Pahami hubungan antar
          durasi.
        </p>
      </div>

      <Tabs defaultValue="basic-durations" className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="basic-durations">
            <Timer className="size-4" />
            Dasar
          </TabsTrigger>
          <TabsTrigger value="advanced-durations">
            <Target className="size-4" />
            Lanjutan
          </TabsTrigger>
        </TabsList>

        {DURATION_TOPICS.map((topic) => (
          <TabsContent key={topic.id} value={topic.id}>
            <DurationTopicSection topic={topic} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Beat Relationship Visual */}
      <BeatRelationshipChart />
    </section>
  );
});

// ── Duration Topic Section ─────────────────────────────

function DurationTopicSection({ topic }: { topic: DurationTopic }) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selectedDetail = selectedKey ? DURATION_DETAILS[selectedKey] : null;

  const handleSelect = useCallback((key: string) => {
    setSelectedKey((prev) => (prev === key ? null : key));
  }, []);

  return (
    <div className="mt-4 space-y-6">
      {/* VexFlow comparison view */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card p-4">
        <DurationComparisonRenderer
          durations={topic.durations}
          width={Math.max(400, topic.durations.length * 140)}
          height={180}
        />
      </div>

      {/* Duration cards grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {topic.durations.map((dur) => {
          const detail = DURATION_DETAILS[dur.key];
          if (!detail) return null;
          const isSelected = selectedKey === dur.key;

          return (
            <button
              key={dur.key}
              type="button"
              onClick={() => handleSelect(dur.key)}
              className={cn(
                "group rounded-xl border p-4 text-left transition-all",
                "hover:border-primary hover:bg-primary/5",
                isSelected
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                  : "border-border bg-card",
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl leading-none">{detail.symbol}</span>
                  <div>
                    <p className="font-semibold">{detail.nameId}</p>
                    <p className="text-xs text-muted-foreground">
                      {detail.nameEn}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 font-mono tabular-nums"
                >
                  {dur.beats} ketuk
                </Badge>
              </div>

              {/* Beat visualization bar */}
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 flex-1 rounded-sm transition-colors",
                      i < dur.beats
                        ? "bg-primary/70 group-hover:bg-primary"
                        : "bg-muted",
                      // Handle fractional beats
                      i === Math.floor(dur.beats) &&
                        dur.beats % 1 > 0 &&
                        "bg-primary/30",
                    )}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {selectedDetail && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{selectedDetail.symbol}</span>
            <div>
              <h3 className="text-lg font-bold">{selectedDetail.nameId}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedDetail.nameEn}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            {selectedDetail.description}
          </p>
          <div className="flex gap-3">
            <Badge variant="secondary">
              Istirahat (Rest):{" "}
              <span className="ml-1">{selectedDetail.restSymbol}</span>
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Beat Relationship Chart ────────────────────────────

function BeatRelationshipChart() {
  const rows = [
    { label: "Whole", beats: 4, color: "bg-violet-500" },
    { label: "Half", beats: 2, color: "bg-blue-500", count: 2 },
    { label: "Quarter", beats: 1, color: "bg-emerald-500", count: 4 },
    { label: "Eighth", beats: 0.5, color: "bg-amber-500", count: 8 },
    { label: "Sixteenth", beats: 0.25, color: "bg-red-500", count: 16 },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Hubungan Antar Durasi (4/4)
      </h3>
      <p className="text-xs text-muted-foreground">
        Satu whole note = 2 half = 4 quarter = 8 eighth = 16 sixteenth notes.
      </p>

      <div className="space-y-1.5 rounded-xl border border-border bg-card p-4">
        {rows.map((row) => {
          const count = row.count ?? 1;
          return (
            <div key={row.label} className="flex items-center gap-2">
              <span className="w-20 text-right text-xs font-medium text-muted-foreground">
                {row.label}
              </span>
              <div className="flex flex-1 gap-0.5">
                {Array.from({ length: count }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-6 rounded-sm flex items-center justify-center text-[9px] font-bold text-white",
                      row.color,
                    )}
                    style={{ flex: `0 0 ${100 / count}%` }}
                  >
                    {count <= 8 ? `${row.beats}` : ""}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
