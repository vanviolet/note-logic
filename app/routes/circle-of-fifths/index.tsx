// ════════════════════════════════════════════════════════
// Circle of Fifths Route — Interactive Overpower Explorer
// ════════════════════════════════════════════════════════

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import {
  Compass,
  Music2,
  Shuffle,
  Piano,
  BrainCircuit,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  CIRCLE_KEYS,
  type CircleKeyData,
} from "~/theory-music/circle-of-fifths/circle-data";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { CircleWheel, type HighlightMode } from "./components/circle-wheel";
import { CircleKeyDetail } from "./components/circle-key-detail";
import { CircleProgressionBuilder } from "./components/circle-progression-builder";
import { CircleModulationFinder } from "./components/circle-modulation-finder";
import { CircleInstrumentView } from "./components/circle-instrument-view";
import { CircleQuizMode } from "./components/circle-quiz-mode";
import { CircleCheatSheet } from "./components/circle-cheat-sheet";
import { FloatingFilterSidebar } from "~/routes/components/floating-filter-sidebar";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/templates/components/ui/tabs";
import { cn } from "~/templates/lib/utils";

export function meta() {
  return [
    { title: "NoteLogic | Circle of Fifths (Lingkaran Kuint) Explorer" },
    {
      name: "description",
      content:
        "Modul interaktif Circle of Fifths terlengkap: jelajahi key signature, chord progressions, modal interchange, pivot chord modulasi, piano/guitar visualizer, dan ear training.",
    },
  ];
}

export default function CircleOfFifthsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const rawKey = searchParams.get("key") ?? "C";
  const rawMode = (searchParams.get("mode") ?? "diatonic") as HighlightMode;
  const rawTab = searchParams.get("tab") ?? "explorer";
  const rawEnharmonic = (searchParams.get("enharmonic") ?? "auto") as "auto" | "sharps" | "flats";

  // Find active key index
  const selectedKeyIndex = useMemo(() => {
    const found = CIRCLE_KEYS.findIndex(
      (k) => k.majorKey.toLowerCase() === rawKey.toLowerCase() || k.majorAlt?.toLowerCase() === rawKey.toLowerCase(),
    );
    return found !== -1 ? found : 0;
  }, [rawKey]);

  const activeKey = CIRCLE_KEYS[selectedKeyIndex];

  // Active progression state for wheel synchronized animation
  const [activeProgStep, setActiveProgStep] = useState<number | null>(null);
  const [progressionKeyIndices, setProgressionKeyIndices] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Setters updating URL
  const setKeyByIndex = (idx: number) => {
    const target = CIRCLE_KEYS[idx];
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("key", target.majorKey);
      return next;
    });
  };

  const setHighlightMode = (m: HighlightMode) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("mode", m);
      return next;
    });
  };

  const setActiveTab = (t: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", t);
      return next;
    });
  };

  const setEnharmonicMode = (eMode: "auto" | "sharps" | "flats") => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("enharmonic", eMode);
      return next;
    });
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    circleAudio.setMute(next);
  };

  return (
    <div className="w-full min-h-screen space-y-6 px-4 py-8 md:px-8 md:py-10 max-w-7xl mx-auto">
      {/* ── Floating Sidebar with Controls ── */}
      <FloatingFilterSidebar title="Circle Controls" toggleLabel="Pengaturan">
        <div className="space-y-5 text-xs">
          {/* Quick Key Jump */}
          <div className="space-y-2">
            <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              Pilih Key Mayor:
            </span>
            <div className="grid grid-cols-3 gap-1.5 font-mono">
              {CIRCLE_KEYS.map((k) => (
                <button
                  key={k.majorKey}
                  type="button"
                  onClick={() => setKeyByIndex(k.index)}
                  className={cn(
                    "p-1.5 rounded-lg border text-center font-bold transition-colors",
                    k.index === selectedKeyIndex
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border",
                  )}
                >
                  {k.majorKey}
                </button>
              ))}
            </div>
          </div>

          {/* Highlight Mode */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              Mode Visualisasi:
            </span>
            <div className="space-y-1">
              {[
                { id: "diatonic", label: "Diatonic Family (6 Chords)" },
                { id: "all", label: "Standard All Keys" },
                { id: "tritone", label: "Tritone Substitution (180°)" },
                { id: "pentatonic", label: "Pentatonic Cluster" },
                { id: "secondary", label: "Secondary Dominants" },
                { id: "diminished-square", label: "Diminished 7th Square" },
                { id: "augmented-triangle", label: "Augmented Triangle" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setHighlightMode(m.id as HighlightMode)}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-md transition-colors",
                    rawMode === m.id
                      ? "bg-primary/10 text-primary font-semibold border border-primary/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Enharmonic Spelling */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              Notasi Enharmonic:
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(["auto", "sharps", "flats"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setEnharmonicMode(opt)}
                  className={cn(
                    "p-1.5 rounded-md border text-center font-medium capitalize transition-colors",
                    rawEnharmonic === opt
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-muted",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Mute */}
          <div className="pt-2 border-t border-border/50 flex items-center justify-between">
            <span className="font-semibold text-foreground">Audio Synth:</span>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleMute}
              className="h-7 px-2 text-xs gap-1.5"
            >
              {isMuted ? <VolumeX className="size-3.5 text-destructive" /> : <Volume2 className="size-3.5 text-primary" />}
              {isMuted ? "Muted" : "Sound ON"}
            </Button>
          </div>
        </div>
      </FloatingFilterSidebar>

      {/* ── Page Hero Header ── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
                <Compass className="size-7 text-primary" />
                Circle of Fifths
              </h1>
              <Badge variant="secondary" className="font-semibold">
                Lingkaran Kuint Interaktif
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-3xl">
              Kompas utama teori musik untuk memahami hubungan antar 12 nada, kunci nada (key signatures), progresi chord, relative keys, modal interchange, dan modulasi.
            </p>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className="h-8 gap-1.5 text-xs"
            >
              {isMuted ? (
                <VolumeX className="size-3.5 text-destructive" />
              ) : (
                <Volume2 className="size-3.5 text-primary" />
              )}
              <span>{isMuted ? "Suara Mati" : "Audio Aktif"}</span>
            </Button>
          </div>
        </div>

        {/* Quick Key Jump Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-muted-foreground text-[11px] font-medium shrink-0 mr-1">
            Key Cepat:
          </span>
          {CIRCLE_KEYS.map((k) => (
            <button
              key={k.majorKey}
              type="button"
              onClick={() => setKeyByIndex(k.index)}
              className={cn(
                "px-2.5 py-1 rounded-md border font-mono font-bold shrink-0 transition-all text-xs",
                k.index === selectedKeyIndex
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card/70 hover:bg-muted text-muted-foreground hover:text-foreground border-border/70",
              )}
            >
              {k.majorKey}
              <span className="text-[10px] font-normal opacity-70 ml-1">
                {k.accidentalsCount === 0 ? "0" : `${k.accidentalsCount}${k.accidentalType === "sharp" ? "♯" : "♭"}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Interactive Tabs ── */}
      <Tabs value={rawTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto p-1 gap-1">
          <TabsTrigger value="explorer" className="text-xs py-2 gap-1.5">
            <Compass className="size-3.5 text-primary" />
            <span>Interactive Wheel</span>
          </TabsTrigger>
          <TabsTrigger value="progression" className="text-xs py-2 gap-1.5">
            <Music2 className="size-3.5 text-primary" />
            <span>Progression Builder</span>
          </TabsTrigger>
          <TabsTrigger value="modulation" className="text-xs py-2 gap-1.5">
            <Shuffle className="size-3.5 text-primary" />
            <span>Modulasi & Pivot</span>
          </TabsTrigger>
          <TabsTrigger value="instruments" className="text-xs py-2 gap-1.5">
            <Piano className="size-3.5 text-primary" />
            <span>Piano & Guitar</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="text-xs py-2 gap-1.5">
            <BrainCircuit className="size-3.5 text-primary" />
            <span>Latihan & Quiz</span>
          </TabsTrigger>
          <TabsTrigger value="cheatsheet" className="text-xs py-2 gap-1.5">
            <BookOpen className="size-3.5 text-primary" />
            <span>Cheat Sheet</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Interactive Wheel & Key Detail ── */}
        <TabsContent value="explorer" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: The Overpower SVG Wheel */}
            <div className="lg:col-span-5 flex flex-col items-center p-4 rounded-2xl border border-border/80 bg-card/40 backdrop-blur">
              <CircleWheel
                selectedKeyIndex={selectedKeyIndex}
                onSelectKey={setKeyByIndex}
                highlightMode={rawMode}
                onHighlightModeChange={setHighlightMode}
                activeProgressionStep={activeProgStep}
                progressionKeyIndices={progressionKeyIndices}
                enharmonicMode={rawEnharmonic}
              />
            </div>

            {/* Right: Key Detail Inspector */}
            <div className="lg:col-span-7">
              <CircleKeyDetail
                keyData={activeKey}
                onAddChordToProgression={(chord) => {
                  setActiveTab("progression");
                }}
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 2: Progression Builder & Sequencer ── */}
        <TabsContent value="progression" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 flex flex-col items-center p-3 rounded-2xl border border-border/80 bg-card/40 backdrop-blur">
              <CircleWheel
                selectedKeyIndex={selectedKeyIndex}
                onSelectKey={setKeyByIndex}
                highlightMode="progression"
                activeProgressionStep={activeProgStep}
                progressionKeyIndices={progressionKeyIndices}
                enharmonicMode={rawEnharmonic}
              />
            </div>

            <div className="lg:col-span-8">
              <CircleProgressionBuilder
                currentKey={activeKey}
                onKeyChange={setKeyByIndex}
                onActiveStepChange={setActiveProgStep}
                onProgressionKeysChange={setProgressionKeyIndices}
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 3: Modulation & Pivot Chord Finder ── */}
        <TabsContent value="modulation" className="space-y-6 mt-0">
          <CircleModulationFinder
            currentKeyIndex={selectedKeyIndex}
            onSelectKey={setKeyByIndex}
          />
        </TabsContent>

        {/* ── Tab 4: Instrument Visualizer ── */}
        <TabsContent value="instruments" className="space-y-6 mt-0">
          <CircleInstrumentView keyData={activeKey} />
        </TabsContent>

        {/* ── Tab 5: Quiz & Practice ── */}
        <TabsContent value="quiz" className="space-y-6 mt-0">
          <CircleQuizMode />
        </TabsContent>

        {/* ── Tab 6: Cheat Sheet & Guide ── */}
        <TabsContent value="cheatsheet" className="space-y-6 mt-0">
          <CircleCheatSheet />
        </TabsContent>
      </Tabs>
    </div>
  );
}
