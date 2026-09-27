import * as React from "react";
import { GripVertical, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import { Input } from "~/templates/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/templates/components/ui/popover";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/templates/components/ui/toggle-group";
import { ARTICULATION, glyph } from "~/theory-music/bravura";
import { NOTE_COLOR_CLASSES } from "~/templates/components/custom/fretboard";
import { cn } from "~/templates/lib/utils";
import { buildCellId, fretToNoteName, toMidi } from "../lib/studio-utils";
import type {
  AccentMark,
  ArpeggioType,
  BeatEffect,
  CellPosition,
  DynamicMark,
  FermataType,
  GraceNoteType,
  HarmonicType,
  NoteDuration,
  NoteEffect,
  NoteVibrato,
  OctaveShift,
  OrnamentMark,
  PickSlideMark,
  SlideInMark,
  SlideOutMark,
  StrokeType,
  StudioNote,
  TremoloMark,
  TupletValue,
  WahMode,
} from "../types";

// ── constants ──────────────────────────────────────────

const DURATION_OPTIONS: NoteDuration[] = [1, 2, 4, 8, 16];
const DURATION_GLYPH: Record<NoteDuration, string> = {
  1: "𝅝",
  2: "𝅗𝅥",
  4: "𝅘𝅥",
  8: "𝅘𝅥𝅮",
  16: "𝅘𝅥𝅯",
};
const DURATION_LABEL: Record<NoteDuration, string> = {
  1: "Whole",
  2: "Half",
  4: "Quarter",
  8: "Eighth",
  16: "16th",
};
const DYNAMICS: DynamicMark[] = [
  "ppp",
  "pp",
  "p",
  "mp",
  "mf",
  "f",
  "ff",
  "fff",
];
const BEAT_EFFECTS: { value: BeatEffect; label: string }[] = [
  { value: "none", label: "—" },
  { value: "v", label: "Vibrato" },
  { value: "vw", label: "Wide Vib." },
  { value: "f", label: "Fade In" },
  { value: "fo", label: "Fade Out" },
  { value: "vs", label: "Vol. Swell" },
  { value: "d", label: "Dot" },
  { value: "dd", label: "Double Dot" },
  { value: "su", label: "Stroke Up" },
  { value: "sd", label: "Stroke Down" },
  { value: "cre", label: "Crescendo" },
  { value: "dec", label: "Decrescendo" },
  { value: "s", label: "Slap" },
  { value: "p", label: "Pop" },
  { value: "tt", label: "Tap" },
  { value: "slashed", label: "Slashed" },
];
const NOTE_EFFECTS: { value: NoteEffect; label: string; token: string }[] = [
  { value: "none", label: "None", token: "—" },
  { value: "h", label: "Hammer/Pull", token: "h" },
  { value: "tr", label: "Trill", token: "tr" },
];
const HARMONICS: { value: HarmonicType; label: string; token: string }[] = [
  { value: "none", label: "None", token: "—" },
  { value: "nh", label: "Natural", token: "nh" },
  { value: "ah", label: "Artificial", token: "ah" },
  { value: "ph", label: "Pinch", token: "ph" },
  { value: "th", label: "Tap", token: "th" },
  { value: "sh", label: "Semi", token: "sh" },
  { value: "fh", label: "Feedback", token: "fh" },
];
const ACCENTS: { value: AccentMark; label: string; token: string }[] = [
  { value: "none", label: "None", token: "—" },
  { value: "ac", label: "Accent", token: "ac" },
  { value: "hac", label: "Heavy Acc.", token: "hac" },
  { value: "ten", label: "Tenuto", token: "ten" },
];
const ORNAMENTS: { value: OrnamentMark; label: string; token: string }[] = [
  { value: "none", label: "None", token: "—" },
  { value: "turn", label: "Turn", token: "turn" },
  { value: "iturn", label: "Inv. Turn", token: "iturn" },
  { value: "umordent", label: "Upper Mord.", token: "umordent" },
  { value: "lmordent", label: "Lower Mord.", token: "lmordent" },
];
const VIBRATO_OPTIONS: { value: NoteVibrato; label: string; token: string }[] =
  [
    { value: "none", label: "None", token: "—" },
    { value: "slight", label: "Slight", token: "v" },
    { value: "wide", label: "Wide", token: "vw" },
  ];
const SLIDE_IN_OPTIONS: { value: SlideInMark; label: string; token: string }[] =
  [
    { value: "none", label: "None", token: "—" },
    { value: "below", label: "From Below", token: "sib" },
    { value: "above", label: "From Above", token: "sia" },
  ];
const SLIDE_OUT_OPTIONS: {
  value: SlideOutMark;
  label: string;
  token: string;
}[] = [
  { value: "none", label: "None", token: "—" },
  { value: "shift", label: "Shift Slide", token: "ss" },
  { value: "legato", label: "Legato Slide", token: "sl" },
  { value: "up", label: "Slide Out Up", token: "sou" },
  { value: "down", label: "Slide Out Down", token: "sod" },
];
const PICK_SLIDE_OPTIONS: {
  value: PickSlideMark;
  label: string;
  token: string;
}[] = [
  { value: "none", label: "None", token: "—" },
  { value: "up", label: "Pick Slide Up", token: "psu" },
  { value: "down", label: "Pick Slide Down", token: "psd" },
];
const STROKE_OPTIONS: { value: StrokeType; label: string; token: string }[] = [
  { value: "none", label: "None", token: "—" },
  { value: "bu", label: "Brush Up", token: "bu" },
  { value: "bd", label: "Brush Down", token: "bd" },
];
const ARPEGGIO_OPTIONS: {
  value: ArpeggioType;
  label: string;
  token: string;
}[] = [
  { value: "none", label: "None", token: "—" },
  { value: "au", label: "Arpeggio Up", token: "au" },
  { value: "ad", label: "Arpeggio Down", token: "ad" },
];
const WAH_OPTIONS: { value: WahMode; label: string; token: string }[] = [
  { value: "none", label: "None", token: "—" },
  { value: "open", label: "Wah Open", token: "waho" },
  { value: "close", label: "Wah Close", token: "wahc" },
];
const TUPLET_OPTIONS: { value: TupletValue; label: string }[] = [
  { value: "none", label: "—" },
  { value: "3", label: "Triplet (3)" },
  { value: "5", label: "Quintuplet (5)" },
  { value: "6", label: "Sextuplet (6)" },
  { value: "7", label: "Septuplet (7)" },
];
const TREMOLO_OPTIONS: { value: TremoloMark; label: string }[] = [
  { value: "none", label: "—" },
  { value: "1", label: "1 slash" },
  { value: "2", label: "2 slashes" },
  { value: "3", label: "3 slashes" },
];
const GRACE_OPTIONS: { value: GraceNoteType; label: string }[] = [
  { value: "none", label: "—" },
  { value: "bb", label: "Beat (bb)" },
  { value: "ob", label: "Before Beat (ob)" },
];
const FERMATA_OPTIONS: { value: FermataType; label: string }[] = [
  { value: "none", label: "—" },
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];
const OCTAVE_OPTIONS: { value: OctaveShift; label: string }[] = [
  { value: "none", label: "—" },
  { value: "8va", label: "8va (up)" },
  { value: "8vb", label: "8vb (down)" },
  { value: "15ma", label: "15ma (up 2)" },
  { value: "15mb", label: "15mb (down 2)" },
];
const TRILL_SPEED_OPTIONS: { value: 16 | 32 | 64; label: string }[] = [
  { value: 16, label: "16th" },
  { value: 32, label: "32nd" },
  { value: 64, label: "64th" },
];

const BRAVURA_TEXT_STYLE: React.CSSProperties = {
  fontFamily: '"Bravura", "Bravura Text", serif',
};

const TECHNIQUE_BRAVURA_TOKEN = {
  palmMute: "pm",
  letRing: "lr",
  staccato: glyph(ARTICULATION.staccato),
  deadNote: "x",
  bend: "b",
} as const;

// ── Beat effect flags for timeline indicator ──────────

export type BeatEffectFlags = {
  hasNotes: boolean;
  hasTechnique: boolean;
  hasNoteEffect: boolean;
  hasBeatEffect: boolean;
};

/** Compute effect flags for all beats from a notes array. */
export function computeBeatEffectFlags(
  notes: StudioNote[],
): Map<string, BeatEffectFlags> {
  const map = new Map<string, BeatEffectFlags>();

  for (const n of notes) {
    const key = `${n.measure}:${n.beat}`;
    let flags = map.get(key);
    if (!flags) {
      flags = {
        hasNotes: false,
        hasTechnique: false,
        hasNoteEffect: false,
        hasBeatEffect: false,
      };
      map.set(key, flags);
    }

    flags.hasNotes = true;

    if (
      n.isPalmMute ||
      n.isLetRing ||
      n.isStaccato ||
      n.isDead ||
      n.isBend ||
      n.isGhost ||
      n.isTied ||
      n.isLeftHandTap
    ) {
      flags.hasTechnique = true;
    }

    if (
      (n.noteEffect && n.noteEffect !== "none") ||
      (n.harmonicType && n.harmonicType !== "none") ||
      (n.accent && n.accent !== "none") ||
      (n.ornament && n.ornament !== "none") ||
      (n.slideIn && n.slideIn !== "none") ||
      (n.slideOut && n.slideOut !== "none") ||
      (n.pickSlide && n.pickSlide !== "none")
    ) {
      flags.hasNoteEffect = true;
    }

    if (
      (n.beatEffect && n.beatEffect !== "none") ||
      (n.vibrato && n.vibrato !== "none") ||
      (n.tuplet && n.tuplet !== "none") ||
      (n.tremoloMark && n.tremoloMark !== "none") ||
      (n.graceType && n.graceType !== "none") ||
      (n.fermata && n.fermata !== "none") ||
      (n.octaveShift && n.octaveShift !== "none") ||
      (n.wahMode && n.wahMode !== "none") ||
      (n.strokeType && n.strokeType !== "none") ||
      (n.arpeggioType && n.arpeggioType !== "none") ||
      Boolean(n.chordName) ||
      Boolean(n.beatText)
    ) {
      flags.hasBeatEffect = true;
    }
  }

  return map;
}

// ── shared update type ────────────────────────────────

type NoteUpdates = Partial<
  Pick<
    StudioNote,
    | "fret"
    | "duration"
    | "dynamic"
    | "beatEffect"
    | "noteEffect"
    | "vibrato"
    | "slideIn"
    | "slideOut"
    | "isPalmMute"
    | "isLetRing"
    | "isStaccato"
    | "isDead"
    | "isBend"
    | "isTied"
    | "isGhost"
    | "isLeftHandTap"
    | "accent"
    | "harmonicType"
    | "trillFret"
    | "trillSpeed"
    | "ornament"
    | "pickSlide"
    | "strokeType"
    | "arpeggioType"
    | "wahMode"
    | "tuplet"
    | "tremoloMark"
    | "graceType"
    | "fermata"
    | "octaveShift"
    | "chordName"
    | "beatText"
  >
>;

// ── Section helper ────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1 rounded-md border border-border/70 p-2">
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

// ── Beat effects presence check ───────────────────────

function hasBeatEffects(note: StudioNote | null): boolean {
  if (!note) return false;
  return (
    Boolean(note.beatEffect && note.beatEffect !== "none") ||
    Boolean(note.vibrato && note.vibrato !== "none") ||
    Boolean(note.tuplet && note.tuplet !== "none") ||
    Boolean(note.tremoloMark && note.tremoloMark !== "none") ||
    Boolean(note.graceType && note.graceType !== "none") ||
    Boolean(note.fermata && note.fermata !== "none") ||
    Boolean(note.octaveShift && note.octaveShift !== "none") ||
    Boolean(note.wahMode && note.wahMode !== "none") ||
    Boolean(note.strokeType && note.strokeType !== "none") ||
    Boolean(note.arpeggioType && note.arpeggioType !== "none") ||
    Boolean(note.chordName) ||
    Boolean(note.beatText)
  );
}

// ── Beat column popover (per ruler cell) ─────────────

const BeatColumnPopover = React.memo(function BeatColumnPopover({
  measure,
  beat,
  firstNote,
  onUpdateNote,
}: {
  measure: number;
  beat: number;
  firstNote: StudioNote | null;
  onUpdateNote: (noteId: string, updates: NoteUpdates) => void;
}) {
  const hasBeatFx = hasBeatEffects(firstNote);
  const [chordInput, setChordInput] = React.useState(
    firstNote?.chordName ?? "",
  );
  const [beatTextInput, setBeatTextInput] = React.useState(
    firstNote?.beatText ?? "",
  );

  React.useEffect(() => {
    setChordInput(firstNote?.chordName ?? "");
    setBeatTextInput(firstNote?.beatText ?? "");
  }, [firstNote?.chordName, firstNote?.beatText]);

  function upd(updates: NoteUpdates) {
    if (!firstNote) {
      toast.info("Add a note to this beat first to apply beat effects");
      return;
    }
    onUpdateNote(firstNote.id, updates);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-5 shrink-0 items-center justify-center rounded-r-md border-l border-border/50 text-muted-foreground/40 transition-colors hover:bg-primary/10 hover:text-primary",
            hasBeatFx && "bg-primary/10 text-primary/80",
          )}
          title={`Beat ${beat + 1} effects (Bar ${measure + 1})`}
          aria-label={`Beat ${beat + 1} effects`}
        >
          <SlidersHorizontal className="h-2.5 w-2.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(92vw,580px)] p-3"
        align="start"
        sideOffset={8}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">
              Bar {measure + 1} · Beat {beat + 1} — Beat Effects
            </p>
            {hasBeatFx && (
              <Badge variant="secondary" className="text-[10px]">
                Active
              </Badge>
            )}
          </div>

          {!firstNote ? (
            <p className="rounded-md border border-dashed border-border/70 p-4 text-center text-[11px] text-muted-foreground">
              Add a note to this beat to apply beat-level effects.
            </p>
          ) : (
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <Section label="Duration">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex flex-wrap gap-1"
                    value={String(firstNote.duration)}
                    onValueChange={(v) =>
                      v && upd({ duration: Number(v) as NoteDuration })
                    }
                  >
                    {DURATION_OPTIONS.map((dur) => (
                      <ToggleGroupItem
                        key={`dur-${dur}`}
                        value={String(dur)}
                        className="h-7 min-w-0 px-2 text-[11px]"
                        title={`${DURATION_LABEL[dur]} (${dur})`}
                      >
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          <span style={BRAVURA_TEXT_STYLE}>
                            {DURATION_GLYPH[dur]}
                          </span>
                          <span>{DURATION_LABEL[dur]}</span>
                        </span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Section>

                <Section label="Dynamic">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex flex-wrap gap-1"
                    value={firstNote.dynamic}
                    onValueChange={(v) =>
                      v && upd({ dynamic: v as DynamicMark })
                    }
                  >
                    {DYNAMICS.map((d) => (
                      <ToggleGroupItem
                        key={`dyn-${d}`}
                        value={d}
                        className="h-7 px-2 text-[11px] uppercase"
                        title={`Dynamic ${d}`}
                      >
                        <span style={BRAVURA_TEXT_STYLE}>{d}</span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Section>
              </div>

              <Section label="Vibrato (Beat)">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  spacing={1}
                  className="flex flex-wrap gap-1"
                  value={firstNote.vibrato}
                  onValueChange={(v) => v && upd({ vibrato: v as NoteVibrato })}
                >
                  {VIBRATO_OPTIONS.map((opt) => (
                    <ToggleGroupItem
                      key={`vib-${opt.value}`}
                      value={opt.value}
                      className="h-7 px-2 text-[11px]"
                      title={opt.label}
                    >
                      <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Section>

              <Section label="Beat FX">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  spacing={1}
                  className="flex flex-wrap gap-1"
                  value={firstNote.beatEffect ?? "none"}
                  onValueChange={(v) =>
                    v && upd({ beatEffect: v as BeatEffect })
                  }
                >
                  {BEAT_EFFECTS.map((opt) => (
                    <ToggleGroupItem
                      key={`bfx-${opt.value}`}
                      value={opt.value}
                      className="h-7 px-2 text-[11px]"
                      title={opt.label}
                    >
                      {opt.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Section>

              <div className="grid gap-2 sm:grid-cols-3">
                <Section label="Tuplet">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex flex-wrap gap-1"
                    value={firstNote.tuplet ?? "none"}
                    onValueChange={(v) =>
                      v && upd({ tuplet: v as TupletValue })
                    }
                  >
                    {TUPLET_OPTIONS.map((opt) => (
                      <ToggleGroupItem
                        key={`tup-${opt.value}`}
                        value={opt.value}
                        className="h-7 px-2 text-[11px]"
                      >
                        {opt.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Section>

                <Section label="Tremolo">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex flex-wrap gap-1"
                    value={firstNote.tremoloMark ?? "none"}
                    onValueChange={(v) =>
                      v && upd({ tremoloMark: v as TremoloMark })
                    }
                  >
                    {TREMOLO_OPTIONS.map((opt) => (
                      <ToggleGroupItem
                        key={`trm-${opt.value}`}
                        value={opt.value}
                        className="h-7 px-2 text-[11px]"
                      >
                        {opt.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Section>

                <Section label="Grace Note">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex flex-wrap gap-1"
                    value={firstNote.graceType ?? "none"}
                    onValueChange={(v) =>
                      v && upd({ graceType: v as GraceNoteType })
                    }
                  >
                    {GRACE_OPTIONS.map((opt) => (
                      <ToggleGroupItem
                        key={`gr-${opt.value}`}
                        value={opt.value}
                        className="h-7 px-2 text-[11px]"
                      >
                        {opt.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Section>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <Section label="Stroke">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex flex-wrap gap-1"
                    value={firstNote.strokeType ?? "none"}
                    onValueChange={(v) =>
                      v && upd({ strokeType: v as StrokeType })
                    }
                  >
                    {STROKE_OPTIONS.map((opt) => (
                      <ToggleGroupItem
                        key={`str-${opt.value}`}
                        value={opt.value}
                        className="h-7 px-2 text-[11px]"
                        title={opt.label}
                      >
                        <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Section>

                <Section label="Arpeggio">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex flex-wrap gap-1"
                    value={firstNote.arpeggioType ?? "none"}
                    onValueChange={(v) =>
                      v && upd({ arpeggioType: v as ArpeggioType })
                    }
                  >
                    {ARPEGGIO_OPTIONS.map((opt) => (
                      <ToggleGroupItem
                        key={`arp-${opt.value}`}
                        value={opt.value}
                        className="h-7 px-2 text-[11px]"
                        title={opt.label}
                      >
                        <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Section>

                <Section label="Wah Pedal">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex flex-wrap gap-1"
                    value={firstNote.wahMode ?? "none"}
                    onValueChange={(v) => v && upd({ wahMode: v as WahMode })}
                  >
                    {WAH_OPTIONS.map((opt) => (
                      <ToggleGroupItem
                        key={`wah-${opt.value}`}
                        value={opt.value}
                        className="h-7 px-2 text-[11px]"
                        title={opt.label}
                      >
                        <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Section>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Section label="Fermata">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex flex-wrap gap-1"
                    value={firstNote.fermata ?? "none"}
                    onValueChange={(v) =>
                      v && upd({ fermata: v as FermataType })
                    }
                  >
                    {FERMATA_OPTIONS.map((opt) => (
                      <ToggleGroupItem
                        key={`fer-${opt.value}`}
                        value={opt.value}
                        className="h-7 px-2 text-[11px]"
                      >
                        {opt.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Section>

                <Section label="Octave Shift">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex flex-wrap gap-1"
                    value={firstNote.octaveShift ?? "none"}
                    onValueChange={(v) =>
                      v && upd({ octaveShift: v as OctaveShift })
                    }
                  >
                    {OCTAVE_OPTIONS.map((opt) => (
                      <ToggleGroupItem
                        key={`oct-${opt.value}`}
                        value={opt.value}
                        className="h-7 px-2 text-[11px]"
                      >
                        {opt.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Section>
              </div>

              <Section label="Chord Name">
                <div className="flex items-center gap-2">
                  <Input
                    className="h-8 max-w-48 text-xs"
                    placeholder="e.g. Am7, G#maj9"
                    value={chordInput}
                    onChange={(e) => setChordInput(e.target.value)}
                    onBlur={() => upd({ chordName: chordInput })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") upd({ chordName: chordInput });
                    }}
                  />
                  {chordInput && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[11px]"
                      onClick={() => {
                        setChordInput("");
                        upd({ chordName: "" });
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {firstNote.chordName && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Active:{" "}
                    <span className="font-mono">{`ch "${firstNote.chordName}"`}</span>
                  </p>
                )}
              </Section>

              <Section label="Beat Text">
                <div className="flex items-center gap-2">
                  <Input
                    className="h-8 max-w-64 text-xs"
                    placeholder="Free text annotation"
                    value={beatTextInput}
                    onChange={(e) => setBeatTextInput(e.target.value)}
                    onBlur={() => upd({ beatText: beatTextInput })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") upd({ beatText: beatTextInput });
                    }}
                  />
                  {beatTextInput && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[11px]"
                      onClick={() => {
                        setBeatTextInput("");
                        upd({ beatText: "" });
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {firstNote.beatText && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Active:{" "}
                    <span className="font-mono">{`txt "${firstNote.beatText}"`}</span>
                  </p>
                )}
              </Section>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});

// ── Note popover (only mounted when opened) ───────────

const NoteCellPopover = React.memo(function NoteCellPopover({
  note,
  position,
  onUpdateNote,
  onRemoveNote,
}: {
  note: StudioNote;
  position: CellPosition;
  onUpdateNote: (noteId: string, updates: NoteUpdates) => void;
  onRemoveNote: (noteId: string) => void;
}) {
  const [trillFretInput, setTrillFretInput] = React.useState(
    note.trillFret > 0 ? String(note.trillFret) : "",
  );

  function upd(updates: NoteUpdates) {
    onUpdateNote(note.id, updates);
  }

  const isDead = note.isDead;

  return (
    <div className="w-[min(92vw,680px)] space-y-2">
      {/* header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold">
            Bar {position.measure + 1} · Beat {position.beat + 1}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Fret: {note.isDead ? "X (dead)" : note.fret} — Type digits to change
          </p>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-7 w-7 px-0"
          onClick={() => onRemoveNote(note.id)}
          aria-label="Delete note"
          title="Delete note"
        >
          ✕
        </Button>
      </div>

      {/* ── Unified Note + FX view (no tabs) ─────── */}
      <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
        <p className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2 py-1.5 text-[10px] text-muted-foreground">
          <SlidersHorizontal className="h-3 w-3 shrink-0" />
          Duration, Dynamic &amp; Vibrato are beat-level — edit via the ruler
        </p>

        {/* ── Techniques (always visible) ──────────── */}
        <Section label="Techniques">
          <div className="flex flex-wrap gap-1">
            {(
              [
                { key: "isPalmMute", token: "palmMute", label: "Palm Mute" },
                { key: "isLetRing", token: "letRing", label: "Let Ring" },
                { key: "isStaccato", token: "staccato", label: "Staccato" },
                { key: "isDead", token: "deadNote", label: "Dead Note" },
              ] as const
            ).map(({ key, token, label }) => (
              <Button
                key={key}
                type="button"
                variant={note[key] ? "default" : "outline"}
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => upd({ [key]: !note[key] })}
              >
                <span className="inline-flex items-center gap-1">
                  <span style={BRAVURA_TEXT_STYLE}>
                    {TECHNIQUE_BRAVURA_TOKEN[token]}
                  </span>
                  <span>{label}</span>
                </span>
              </Button>
            ))}
            {!isDead && (
              <Button
                type="button"
                variant={note.isBend ? "default" : "outline"}
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => upd({ isBend: !note.isBend })}
              >
                <span className="inline-flex items-center gap-1">
                  <span style={BRAVURA_TEXT_STYLE}>
                    {TECHNIQUE_BRAVURA_TOKEN.bend}
                  </span>
                  <span>Bend</span>
                </span>
              </Button>
            )}
          </div>
        </Section>

        {isDead && (
          <p className="rounded-md border border-border/50 bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
            🚫 Pitch effects are hidden for dead notes.
          </p>
        )}

        {!isDead && (
          <>
            {/* ── Harmonic & Note FX ──────────────── */}
            <div className="grid gap-2 sm:grid-cols-2">
              <Section label="Harmonic">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  spacing={1}
                  className="flex flex-wrap gap-1"
                  value={note.harmonicType ?? "none"}
                  onValueChange={(v) =>
                    v && upd({ harmonicType: v as HarmonicType })
                  }
                >
                  {HARMONICS.map((opt) => (
                    <ToggleGroupItem
                      key={`harm-${opt.value}`}
                      value={opt.value}
                      className="h-7 px-2 text-[11px]"
                      title={opt.label}
                    >
                      <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Section>

              <Section label="Note FX">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  spacing={1}
                  className="flex flex-wrap gap-1"
                  value={note.noteEffect}
                  onValueChange={(v) =>
                    v && upd({ noteEffect: v as NoteEffect })
                  }
                >
                  {NOTE_EFFECTS.map((opt) => (
                    <ToggleGroupItem
                      key={`nfx-${opt.value}`}
                      value={opt.value}
                      className="h-7 px-2 text-[11px]"
                      title={opt.label}
                    >
                      <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                {note.noteEffect === "tr" && (
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <Input
                      type="number"
                      min={0}
                      max={24}
                      placeholder="Trill fret"
                      className="h-7 w-24 text-xs"
                      value={trillFretInput}
                      onChange={(e) => setTrillFretInput(e.target.value)}
                      onBlur={() => {
                        const n = Number(trillFretInput);
                        if (!isNaN(n) && n >= 0) upd({ trillFret: n });
                      }}
                    />
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      size="sm"
                      spacing={1}
                      className="flex gap-1"
                      value={String(note.trillSpeed ?? 16)}
                      onValueChange={(v) =>
                        v && upd({ trillSpeed: Number(v) as 16 | 32 | 64 })
                      }
                    >
                      {TRILL_SPEED_OPTIONS.map((opt) => (
                        <ToggleGroupItem
                          key={`ts-${opt.value}`}
                          value={String(opt.value)}
                          className="h-7 px-2 text-[11px]"
                          title={opt.label}
                        >
                          {opt.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                )}
              </Section>
            </div>

            {/* ── Accent ──────────────────────────── */}
            <Section label="Accent">
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={1}
                className="flex flex-wrap gap-1"
                value={note.accent ?? "none"}
                onValueChange={(v) => v && upd({ accent: v as AccentMark })}
              >
                {ACCENTS.map((opt) => (
                  <ToggleGroupItem
                    key={`acc-${opt.value}`}
                    value={opt.value}
                    className="h-7 px-2 text-[11px]"
                    title={opt.label}
                  >
                    <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Section>

            {/* ── Ornament ────────────────────────── */}
            <Section label="Ornament">
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={1}
                className="flex flex-wrap gap-1"
                value={note.ornament ?? "none"}
                onValueChange={(v) => v && upd({ ornament: v as OrnamentMark })}
              >
                {ORNAMENTS.map((opt) => (
                  <ToggleGroupItem
                    key={`orn-${opt.value}`}
                    value={opt.value}
                    className="h-7 px-2 text-[11px]"
                    title={opt.label}
                  >
                    <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Section>

            {/* ── Slides ──────────────────────────── */}
            <div className="grid gap-2 sm:grid-cols-3">
              <Section label="Slide In">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  spacing={1}
                  className="flex flex-wrap gap-1"
                  value={note.slideIn}
                  onValueChange={(v) => v && upd({ slideIn: v as SlideInMark })}
                >
                  {SLIDE_IN_OPTIONS.map((opt) => (
                    <ToggleGroupItem
                      key={`si-${opt.value}`}
                      value={opt.value}
                      className="h-7 px-2 text-[11px]"
                      title={opt.label}
                    >
                      <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Section>

              <Section label="Slide Out">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  spacing={1}
                  className="flex flex-wrap gap-1"
                  value={note.slideOut}
                  onValueChange={(v) =>
                    v && upd({ slideOut: v as SlideOutMark })
                  }
                >
                  {SLIDE_OUT_OPTIONS.map((opt) => (
                    <ToggleGroupItem
                      key={`so-${opt.value}`}
                      value={opt.value}
                      className="h-7 px-2 text-[11px]"
                      title={opt.label}
                    >
                      <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Section>

              <Section label="Pick Slide">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  spacing={1}
                  className="flex flex-wrap gap-1"
                  value={note.pickSlide ?? "none"}
                  onValueChange={(v) =>
                    v && upd({ pickSlide: v as PickSlideMark })
                  }
                >
                  {PICK_SLIDE_OPTIONS.map((opt) => (
                    <ToggleGroupItem
                      key={`ps-${opt.value}`}
                      value={opt.value}
                      className="h-7 px-2 text-[11px]"
                      title={opt.label}
                    >
                      <span style={BRAVURA_TEXT_STYLE}>{opt.token}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Section>
            </div>
          </>
        )}

        {/* ── Note Flags (always visible) ──────────── */}
        <Section label="Note Flags">
          <div className="flex flex-wrap gap-1">
            {(
              [
                { key: "isGhost", label: "Ghost (g)" },
                { key: "isTied", label: "Tied (t)" },
                { key: "isLeftHandTap", label: "LH Tap (lht)" },
              ] as const
            ).map(({ key, label }) => (
              <Button
                key={key}
                type="button"
                variant={note[key] ? "default" : "outline"}
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => upd({ [key]: !note[key] })}
              >
                {label}
              </Button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
});

// ── Single grid cell (memoized) ───────────────────────

const GridCell = React.memo(
  function GridCell({
    cellId,
    measure,
    beat,
    stringIndex,
    openStringNote,
    note,
    isSelected,
    isMeasureStart,
    onSelect,
    onUpdateNote,
    onRemoveNote,
  }: {
    cellId: string;
    measure: number;
    beat: number;
    stringIndex: number;
    openStringNote: string;
    note: StudioNote | undefined;
    isSelected: boolean;
    isMeasureStart: boolean;
    onSelect: (position: CellPosition) => void;
    onUpdateNote: (noteId: string, updates: NoteUpdates) => void;
    onRemoveNote: (noteId: string) => void;
  }) {
    const position: CellPosition = { measure, beat, string: stringIndex };
    const absBeat = measure * 1000 + beat; // unique per measure+beat combo

    const noteLabel = note
      ? note.isDead
        ? "X"
        : `${note.fret}(${fretToNoteName(openStringNote, note.fret)})`
      : null;

    // Compute pitch-class color for notes
    const pitchClass =
      note && !note.isDead ? (toMidi(openStringNote) + note.fret) % 12 : -1;
    const noteColor =
      pitchClass >= 0 ? NOTE_COLOR_CLASSES[pitchClass] : undefined;

    return (
      <div
        data-cell-id={cellId}
        data-abs-beat={absBeat}
        {...(note ? { "data-note-id": note.id } : {})}
        className={cn(
          "studio-grid-cell flex h-11 items-center justify-center rounded-md border border-border/80 bg-background/60 p-1 transition-colors duration-150",
          isSelected && "ring-2 ring-primary/50",
          isMeasureStart && "border-l-2 border-l-primary/70",
        )}
        onClick={() => onSelect(position)}
      >
        {note ? (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                data-note-btn={note.id}
                className={cn(
                  "studio-note-btn inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-1.5 text-[11px] font-semibold transition-colors duration-150",
                  noteColor
                    ? `${noteColor.border} ${noteColor.bg} ${noteColor.text}`
                    : isSelected
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-card text-foreground/90 hover:border-primary/60",
                  isSelected && "ring-1 ring-primary/60",
                )}
                aria-label={`Note fret ${note.fret} (${fretToNoteName(openStringNote, note.fret)})`}
              >
                {noteLabel}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[min(92vw,780px)] p-3"
              align="start"
              sideOffset={8}
            >
              <NoteCellPopover
                note={note}
                position={position}
                onUpdateNote={onUpdateNote}
                onRemoveNote={onRemoveNote}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <button
            type="button"
            className="h-8 w-full rounded-md border border-dashed border-border/70 text-[11px] text-muted-foreground hover:border-primary/60 hover:text-primary"
            onClick={() => onSelect(position)}
          >
            +
          </button>
        )}
      </div>
    );
  },
  (prev, next) =>
    prev.cellId === next.cellId &&
    prev.note === next.note &&
    prev.isSelected === next.isSelected &&
    prev.isMeasureStart === next.isMeasureStart &&
    prev.openStringNote === next.openStringNote,
);

// ── One string row within a chunk (memoized) ─────────

const GridStringRow = React.memo(
  function GridStringRow({
    openNote,
    stringIndex,
    startMeasure,
    beatsInRow,
    beatsPerMeasure,
    beatsTotal,
    cellWidth,
    noteByCell,
    selectedCell,
    onSelect,
    onUpdateNote,
    onRemoveNote,
  }: {
    openNote: string;
    stringIndex: number;
    startMeasure: number;
    beatsInRow: number;
    beatsPerMeasure: number;
    beatsTotal: number;
    cellWidth: number;
    noteByCell: Map<string, StudioNote>;
    selectedCell: CellPosition | null;
    onSelect: (position: CellPosition) => void;
    onUpdateNote: (noteId: string, updates: NoteUpdates) => void;
    onRemoveNote: (noteId: string) => void;
  }) {
    const cells: React.ReactNode[] = [];

    for (let offsetBeat = 0; offsetBeat < beatsInRow; offsetBeat++) {
      const absoluteBeat = startMeasure * beatsPerMeasure + offsetBeat;
      if (absoluteBeat >= beatsTotal) break;

      const measure = Math.floor(absoluteBeat / beatsPerMeasure);
      const beat = absoluteBeat % beatsPerMeasure;
      const cellId = buildCellId({ measure, beat, string: stringIndex });
      const note = noteByCell.get(cellId);
      const isSelected = selectedCell
        ? selectedCell.measure === measure &&
          selectedCell.beat === beat &&
          selectedCell.string === stringIndex
        : false;
      const isMeasureStart = absoluteBeat > 0 && beat === 0;

      cells.push(
        <GridCell
          key={cellId}
          cellId={cellId}
          measure={measure}
          beat={beat}
          stringIndex={stringIndex}
          openStringNote={openNote}
          note={note}
          isSelected={isSelected}
          isMeasureStart={isMeasureStart}
          onSelect={onSelect}
          onUpdateNote={onUpdateNote}
          onRemoveNote={onRemoveNote}
        />,
      );
    }

    return (
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `72px repeat(${beatsInRow}, minmax(0, ${cellWidth}px))`,
        }}
      >
        <div className="flex items-center rounded-md border border-border bg-card px-2 text-xs font-medium">
          {openNote}
        </div>
        {cells}
      </div>
    );
  },
  (prev, next) =>
    prev.openNote === next.openNote &&
    prev.stringIndex === next.stringIndex &&
    prev.startMeasure === next.startMeasure &&
    prev.beatsInRow === next.beatsInRow &&
    prev.beatsPerMeasure === next.beatsPerMeasure &&
    prev.beatsTotal === next.beatsTotal &&
    prev.cellWidth === next.cellWidth &&
    prev.noteByCell === next.noteByCell &&
    prev.selectedCell === next.selectedCell,
);

// ── Virtualized chunk (IntersectionObserver) ──────────

/** Estimated height per chunk: ruler(28) + 6 strings(44 each) + gaps + padding ≈ 340px */
const CHUNK_ESTIMATED_HEIGHT = 340;

const VirtualizedChunk = React.memo(function VirtualizedChunk({
  startMeasure,
  endMeasure,
  beatsPerMeasure,
  beatsTotal,
  cellWidth,
  stringTuning,
  noteByCell,
  noteByBeat,
  beatEffectFlags,
  selectedCell,
  onSelectCell,
  onUpdateNote,
  onRemoveNote,
  onClickRulerBeat,
  forceVisible,
  dragBarFrom,
  dragBarOver,
  onBarDragStart,
  onBarDragMove,
  onBarDragEnd,
}: {
  startMeasure: number;
  endMeasure: number;
  beatsPerMeasure: number;
  beatsTotal: number;
  cellWidth: number;
  stringTuning: readonly string[];
  noteByCell: Map<string, StudioNote>;
  noteByBeat: Map<string, StudioNote>;
  beatEffectFlags: Map<string, BeatEffectFlags>;
  selectedCell: CellPosition | null;
  onSelectCell: (position: CellPosition) => void;
  onUpdateNote: (noteId: string, updates: NoteUpdates) => void;
  onRemoveNote: (noteId: string) => void;
  onClickRulerBeat: (measure: number, beat: number) => void;
  forceVisible: boolean;
  // Bar drag reorder
  dragBarFrom: number | null;
  dragBarOver: number | null;
  onBarDragStart: (e: React.PointerEvent<HTMLElement>, measure: number) => void;
  onBarDragMove: (e: React.PointerEvent<HTMLElement>) => void;
  onBarDragEnd: (e: React.PointerEvent<HTMLElement>) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const wasVisibleRef = React.useRef(false);
  const heightRef = React.useRef(CHUNK_ESTIMATED_HEIGHT);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) {
          wasVisibleRef.current = true;
        }
        // Capture actual height when visible so placeholder stays accurate
        if (visible && node.firstElementChild) {
          heightRef.current =
            node.firstElementChild.getBoundingClientRect().height;
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const shouldRender = isVisible || forceVisible;
  const measuresInRow = endMeasure - startMeasure;
  const beatsInRow = measuresInRow * beatsPerMeasure;

  return (
    <div
      ref={ref}
      style={shouldRender ? undefined : { minHeight: `${heightRef.current}px` }}
    >
      {shouldRender ? (
        <div className="space-y-2 rounded-lg border border-border/70 bg-background/30 p-2">
          {/* ruler row */}
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `72px repeat(${beatsInRow}, minmax(0, ${cellWidth}px))`,
            }}
          >
            <div className="flex items-center rounded-md border border-border bg-card px-2 text-[11px] font-semibold text-muted-foreground">
              Bar
            </div>
            {Array.from({ length: beatsInRow }, (_, offsetBeat) => {
              const absoluteBeat = startMeasure * beatsPerMeasure + offsetBeat;
              const beat = absoluteBeat % beatsPerMeasure;
              const measure = Math.floor(absoluteBeat / beatsPerMeasure);
              const rulerAbsBeat = measure * 1000 + beat;
              const firstNoteAtBeat =
                noteByBeat.get(`${measure}:${beat}`) ?? null;
              const flags = beatEffectFlags.get(`${measure}:${beat}`);
              const isDragSource = dragBarFrom === measure;
              const isDragTarget =
                dragBarOver === measure &&
                dragBarFrom !== null &&
                dragBarFrom !== measure;
              return (
                <div
                  key={`ruler-${absoluteBeat}`}
                  data-abs-beat={rulerAbsBeat}
                  {...(beat === 0 ? { "data-bar-drag": measure } : {})}
                  className={cn(
                    "studio-grid-cell flex h-7 overflow-hidden rounded-md border border-border/70 bg-background/60 text-[10px] text-muted-foreground",
                    beat === 0 &&
                      absoluteBeat > 0 &&
                      "border-l-2 border-l-primary/70",
                    isDragSource && "opacity-50",
                    isDragTarget && "border-2 border-primary bg-primary/10",
                  )}
                >
                  {beat === 0 ? (
                    <div
                      className="flex flex-1 cursor-grab items-center justify-center gap-0.5 active:cursor-grabbing"
                      onPointerDown={(e) => onBarDragStart(e, measure)}
                      onPointerMove={onBarDragMove}
                      onPointerUp={onBarDragEnd}
                      title={`Drag to reorder Bar ${measure + 1}`}
                    >
                      <GripVertical className="h-3 w-3 shrink-0 text-muted-foreground/50" />
                      <span className="font-semibold">{measure + 1}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="flex flex-1 cursor-pointer items-center justify-center transition-colors duration-150 hover:bg-primary/10 hover:text-primary"
                      onClick={() => onClickRulerBeat(measure, beat)}
                      aria-label={`Bar ${measure + 1}, Beat ${beat + 1}`}
                    >
                      {beat + 1}
                    </button>
                  )}
                  {/* effect indicator dots */}
                  {flags &&
                    (flags.hasTechnique ||
                      flags.hasNoteEffect ||
                      flags.hasBeatEffect) && (
                      <div
                        className="flex items-center gap-px pr-1"
                        title={[
                          flags.hasTechnique ? "Technique" : "",
                          flags.hasNoteEffect ? "Note FX" : "",
                          flags.hasBeatEffect ? "Beat FX" : "",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      >
                        {flags.hasTechnique && (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                        )}
                        {flags.hasNoteEffect && (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400" />
                        )}
                        {flags.hasBeatEffect && (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        )}
                      </div>
                    )}
                  <BeatColumnPopover
                    measure={measure}
                    beat={beat}
                    firstNote={firstNoteAtBeat}
                    onUpdateNote={onUpdateNote}
                  />
                </div>
              );
            })}
          </div>

          {/* string rows */}
          {stringTuning.map((openNote, stringIndex) => (
            <GridStringRow
              key={`row-${stringIndex}-${startMeasure}`}
              openNote={openNote}
              stringIndex={stringIndex}
              startMeasure={startMeasure}
              beatsInRow={beatsInRow}
              beatsPerMeasure={beatsPerMeasure}
              beatsTotal={beatsTotal}
              cellWidth={cellWidth}
              noteByCell={noteByCell}
              selectedCell={selectedCell}
              onSelect={onSelectCell}
              onUpdateNote={onUpdateNote}
              onRemoveNote={onRemoveNote}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex items-center justify-center rounded-lg border border-dashed border-border/40 bg-muted/10 text-xs text-muted-foreground/50"
          style={{ height: `${heightRef.current}px` }}
        >
          Bar {startMeasure + 1}–{endMeasure}
        </div>
      )}
    </div>
  );
});

// ── Main grid ─────────────────────────────────────────

type StudioGridProps = {
  stringTuning: readonly string[];
  noteByCell: Map<string, StudioNote>;
  noteByBeat: Map<string, StudioNote>;
  beatEffectFlags: Map<string, BeatEffectFlags>;
  selectedCell: CellPosition | null;
  measureCount: number;
  beatsPerMeasure: number;
  cellWidth: number;
  onSelectCell: (position: CellPosition) => void;
  onUpdateNote: (noteId: string, updates: NoteUpdates) => void;
  onRemoveNote: (noteId: string) => void;
  onClickRulerBeat: (measure: number, beat: number) => void;
  // Bar drag reorder
  dragBarFrom: number | null;
  dragBarOver: number | null;
  onBarDragStart: (e: React.PointerEvent<HTMLElement>, measure: number) => void;
  onBarDragMove: (e: React.PointerEvent<HTMLElement>) => void;
  onBarDragEnd: (e: React.PointerEvent<HTMLElement>) => void;
};

export const StudioGrid = React.memo(function StudioGrid({
  stringTuning,
  noteByCell,
  noteByBeat,
  beatEffectFlags,
  selectedCell,
  measureCount,
  beatsPerMeasure,
  cellWidth,
  onSelectCell,
  onUpdateNote,
  onRemoveNote,
  onClickRulerBeat,
  dragBarFrom,
  dragBarOver,
  onBarDragStart,
  onBarDragMove,
  onBarDragEnd,
}: StudioGridProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const [hostWidth, setHostWidth] = React.useState(0);

  // Debounced resize observer — avoid re-render on every pixel
  React.useEffect(() => {
    const node = hostRef.current;
    if (!node) return;

    let rafId: number | null = null;
    const observer = new ResizeObserver((entries) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const entry = entries[0];
        if (!entry) return;
        setHostWidth(Math.floor(entry.contentRect.width));
      });
    });

    observer.observe(node);
    setHostWidth(Math.floor(node.getBoundingClientRect().width));

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const beatsTotal = measureCount * beatsPerMeasure;
  const oneMeasurePx = beatsPerMeasure * cellWidth + (beatsPerMeasure - 1) * 4;
  const availableWidth = Math.max(240, hostWidth - 92);
  const measuresPerRow = Math.max(
    1,
    Math.min(
      measureCount,
      Math.floor(availableWidth / Math.max(1, oneMeasurePx)),
    ),
  );

  const rowChunks = React.useMemo(() => {
    const chunks: Array<{ startMeasure: number; endMeasure: number }> = [];
    for (let start = 0; start < measureCount; start += measuresPerRow) {
      chunks.push({
        startMeasure: start,
        endMeasure: Math.min(measureCount, start + measuresPerRow),
      });
    }
    return chunks;
  }, [measureCount, measuresPerRow]);

  // Determine which chunk contains the selected cell so it's always rendered
  const selectedChunkStart =
    selectedCell != null
      ? Math.floor(selectedCell.measure / Math.max(1, measuresPerRow)) *
        measuresPerRow
      : -1;

  return (
    <div ref={hostRef} className="min-w-0 space-y-3">
      {rowChunks.map(({ startMeasure, endMeasure }) => (
        <VirtualizedChunk
          key={`chunk-${startMeasure}`}
          startMeasure={startMeasure}
          endMeasure={endMeasure}
          beatsPerMeasure={beatsPerMeasure}
          beatsTotal={beatsTotal}
          cellWidth={cellWidth}
          stringTuning={stringTuning}
          noteByCell={noteByCell}
          noteByBeat={noteByBeat}
          beatEffectFlags={beatEffectFlags}
          selectedCell={selectedCell}
          onSelectCell={onSelectCell}
          onUpdateNote={onUpdateNote}
          onRemoveNote={onRemoveNote}
          onClickRulerBeat={onClickRulerBeat}
          forceVisible={startMeasure === selectedChunkStart}
          dragBarFrom={dragBarFrom}
          dragBarOver={dragBarOver}
          onBarDragStart={onBarDragStart}
          onBarDragMove={onBarDragMove}
          onBarDragEnd={onBarDragEnd}
        />
      ))}
    </div>
  );
});
