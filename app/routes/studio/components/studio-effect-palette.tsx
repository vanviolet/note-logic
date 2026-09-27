import * as React from "react";
import { Waves } from "lucide-react";
import { Badge } from "~/templates/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/templates/components/ui/tooltip";
import { cn } from "~/templates/lib/utils";
import { ARTICULATION, FLAGS, RESTS, glyph } from "~/theory-music/bravura";

// ================================================================
// Effect Palette Types
// ================================================================

export type EffectLevel = "beat" | "note";

export type EffectPaletteItem = {
  key: string;
  label: string;
  description: string;
  level: EffectLevel;
  patch: Record<string, unknown>;
  symbol?: string;
  useBravuraFont?: boolean;
  category: string;
};

const BRAVURA_TEXT_STYLE: React.CSSProperties = {
  fontFamily: '"Bravura", "Bravura Text", serif',
};

// ================================================================
// Beat-level items
// ================================================================

const BEAT_ITEMS: EffectPaletteItem[] = [
  // Duration
  {
    key: "dur:1",
    label: "Whole",
    description: "Whole note (1)",
    level: "beat",
    patch: { duration: 1 },
    symbol: glyph(RESTS.whole),
    useBravuraFont: true,
    category: "Duration",
  },
  {
    key: "dur:2",
    label: "Half",
    description: "Half note (2)",
    level: "beat",
    patch: { duration: 2 },
    symbol: glyph(RESTS.half),
    useBravuraFont: true,
    category: "Duration",
  },
  {
    key: "dur:4",
    label: "Quarter",
    description: "Quarter note (4)",
    level: "beat",
    patch: { duration: 4 },
    symbol: glyph(RESTS.quarter),
    useBravuraFont: true,
    category: "Duration",
  },
  {
    key: "dur:8",
    label: "Eighth",
    description: "Eighth note (8)",
    level: "beat",
    patch: { duration: 8 },
    symbol: `${glyph(RESTS.quarter)}${glyph(FLAGS.eighthUp)}`,
    useBravuraFont: true,
    category: "Duration",
  },
  {
    key: "dur:16",
    label: "16th",
    description: "Sixteenth note (16)",
    level: "beat",
    patch: { duration: 16 },
    symbol: `${glyph(RESTS.quarter)}${glyph(FLAGS.sixteenthUp)}`,
    useBravuraFont: true,
    category: "Duration",
  },

  // Dynamic
  {
    key: "dyn:ppp",
    label: "ppp",
    description: "Pianississimo",
    level: "beat",
    patch: { dynamic: "ppp" },
    symbol: "ppp",
    category: "Dynamic",
  },
  {
    key: "dyn:pp",
    label: "pp",
    description: "Pianissimo",
    level: "beat",
    patch: { dynamic: "pp" },
    symbol: "pp",
    category: "Dynamic",
  },
  {
    key: "dyn:p",
    label: "p",
    description: "Piano",
    level: "beat",
    patch: { dynamic: "p" },
    symbol: "p",
    category: "Dynamic",
  },
  {
    key: "dyn:mp",
    label: "mp",
    description: "Mezzo-piano",
    level: "beat",
    patch: { dynamic: "mp" },
    symbol: "mp",
    category: "Dynamic",
  },
  {
    key: "dyn:mf",
    label: "mf",
    description: "Mezzo-forte",
    level: "beat",
    patch: { dynamic: "mf" },
    symbol: "mf",
    category: "Dynamic",
  },
  {
    key: "dyn:f",
    label: "f",
    description: "Forte",
    level: "beat",
    patch: { dynamic: "f" },
    symbol: "f",
    category: "Dynamic",
  },
  {
    key: "dyn:ff",
    label: "ff",
    description: "Fortissimo",
    level: "beat",
    patch: { dynamic: "ff" },
    symbol: "ff",
    category: "Dynamic",
  },
  {
    key: "dyn:fff",
    label: "fff",
    description: "Fortississimo",
    level: "beat",
    patch: { dynamic: "fff" },
    symbol: "fff",
    category: "Dynamic",
  },

  // Beat Effect
  {
    key: "be:v",
    label: "Vibrato",
    description: "Beat vibrato",
    level: "beat",
    patch: { beatEffect: "v" },
    symbol: "~",
    category: "Beat Effect",
  },
  {
    key: "be:vw",
    label: "Wide Vib.",
    description: "Wide vibrato",
    level: "beat",
    patch: { beatEffect: "vw" },
    symbol: "~~",
    category: "Beat Effect",
  },
  {
    key: "be:f",
    label: "Fade In",
    description: "Fade in",
    level: "beat",
    patch: { beatEffect: "f" },
    symbol: "<",
    category: "Beat Effect",
  },
  {
    key: "be:fo",
    label: "Fade Out",
    description: "Fade out",
    level: "beat",
    patch: { beatEffect: "fo" },
    symbol: ">",
    category: "Beat Effect",
  },
  {
    key: "be:vs",
    label: "Vol. Swell",
    description: "Volume swell",
    level: "beat",
    patch: { beatEffect: "vs" },
    symbol: "<>",
    category: "Beat Effect",
  },
  {
    key: "be:d",
    label: "Dot",
    description: "Dotted note",
    level: "beat",
    patch: { beatEffect: "d" },
    symbol: ".",
    category: "Beat Effect",
  },
  {
    key: "be:dd",
    label: "Double Dot",
    description: "Double dotted note",
    level: "beat",
    patch: { beatEffect: "dd" },
    symbol: "..",
    category: "Beat Effect",
  },
  {
    key: "be:su",
    label: "Stroke Up",
    description: "Upstroke",
    level: "beat",
    patch: { beatEffect: "su" },
    symbol: "V",
    category: "Beat Effect",
  },
  {
    key: "be:sd",
    label: "Stroke Down",
    description: "Downstroke",
    level: "beat",
    patch: { beatEffect: "sd" },
    symbol: "n",
    category: "Beat Effect",
  },
  {
    key: "be:cre",
    label: "Crescendo",
    description: "Crescendo",
    level: "beat",
    patch: { beatEffect: "cre" },
    symbol: "cre",
    category: "Beat Effect",
  },
  {
    key: "be:dec",
    label: "Decrescendo",
    description: "Decrescendo",
    level: "beat",
    patch: { beatEffect: "dec" },
    symbol: "dec",
    category: "Beat Effect",
  },
  {
    key: "be:s",
    label: "Slap",
    description: "Slap technique",
    level: "beat",
    patch: { beatEffect: "s" },
    symbol: "S",
    category: "Beat Effect",
  },
  {
    key: "be:p",
    label: "Pop",
    description: "Pop technique",
    level: "beat",
    patch: { beatEffect: "p" },
    symbol: "P",
    category: "Beat Effect",
  },
  {
    key: "be:tt",
    label: "Tap",
    description: "Tap technique",
    level: "beat",
    patch: { beatEffect: "tt" },
    symbol: "T",
    category: "Beat Effect",
  },
  {
    key: "be:slashed",
    label: "Slashed",
    description: "Slashed grace beat",
    level: "beat",
    patch: { beatEffect: "slashed" },
    symbol: "/",
    category: "Beat Effect",
  },

  // Tuplet
  {
    key: "tp:3",
    label: "Triplet",
    description: "Triplet (3)",
    level: "beat",
    patch: { tuplet: "3" },
    symbol: "3",
    category: "Tuplet",
  },
  {
    key: "tp:5",
    label: "Quintuplet",
    description: "Quintuplet (5)",
    level: "beat",
    patch: { tuplet: "5" },
    symbol: "5",
    category: "Tuplet",
  },
  {
    key: "tp:6",
    label: "Sextuplet",
    description: "Sextuplet (6)",
    level: "beat",
    patch: { tuplet: "6" },
    symbol: "6",
    category: "Tuplet",
  },
  {
    key: "tp:7",
    label: "Septuplet",
    description: "Septuplet (7)",
    level: "beat",
    patch: { tuplet: "7" },
    symbol: "7",
    category: "Tuplet",
  },

  // Tremolo
  {
    key: "trm:1",
    label: "Tremolo 1",
    description: "1 slash tremolo",
    level: "beat",
    patch: { tremoloMark: "1" },
    symbol: "/",
    category: "Tremolo",
  },
  {
    key: "trm:2",
    label: "Tremolo 2",
    description: "2 slash tremolo",
    level: "beat",
    patch: { tremoloMark: "2" },
    symbol: "//",
    category: "Tremolo",
  },
  {
    key: "trm:3",
    label: "Tremolo 3",
    description: "3 slash tremolo",
    level: "beat",
    patch: { tremoloMark: "3" },
    symbol: "///",
    category: "Tremolo",
  },

  // Grace
  {
    key: "gr:bb",
    label: "Grace (Beat)",
    description: "Grace note before beat",
    level: "beat",
    patch: { graceType: "bb" },
    symbol: "bb",
    category: "Grace",
  },
  {
    key: "gr:ob",
    label: "Grace (On)",
    description: "Grace note on beat",
    level: "beat",
    patch: { graceType: "ob" },
    symbol: "ob",
    category: "Grace",
  },

  // Fermata
  {
    key: "fm:short",
    label: "Short",
    description: "Short fermata",
    level: "beat",
    patch: { fermata: "short" },
    symbol: "Fm",
    category: "Fermata",
  },
  {
    key: "fm:medium",
    label: "Medium",
    description: "Medium fermata",
    level: "beat",
    patch: { fermata: "medium" },
    symbol: "FM",
    category: "Fermata",
  },
  {
    key: "fm:long",
    label: "Long",
    description: "Long fermata",
    level: "beat",
    patch: { fermata: "long" },
    symbol: "FL",
    category: "Fermata",
  },

  // Stroke
  {
    key: "str:bu",
    label: "Brush Up",
    description: "Brush stroke up",
    level: "beat",
    patch: { strokeType: "bu" },
    symbol: "bu",
    category: "Stroke",
  },
  {
    key: "str:bd",
    label: "Brush Down",
    description: "Brush stroke down",
    level: "beat",
    patch: { strokeType: "bd" },
    symbol: "bd",
    category: "Stroke",
  },

  // Arpeggio
  {
    key: "arp:au",
    label: "Arp. Up",
    description: "Arpeggio up",
    level: "beat",
    patch: { arpeggioType: "au" },
    symbol: "au",
    category: "Arpeggio",
  },
  {
    key: "arp:ad",
    label: "Arp. Down",
    description: "Arpeggio down",
    level: "beat",
    patch: { arpeggioType: "ad" },
    symbol: "ad",
    category: "Arpeggio",
  },

  // Wah
  {
    key: "wah:open",
    label: "Wah Open",
    description: "Wah pedal open",
    level: "beat",
    patch: { wahMode: "open" },
    symbol: "O",
    category: "Wah",
  },
  {
    key: "wah:close",
    label: "Wah Close",
    description: "Wah pedal close",
    level: "beat",
    patch: { wahMode: "close" },
    symbol: "+",
    category: "Wah",
  },

  // Octave
  {
    key: "oct:8va",
    label: "8va",
    description: "Octave up",
    level: "beat",
    patch: { octaveShift: "8va" },
    symbol: "8va",
    category: "Octave",
  },
  {
    key: "oct:8vb",
    label: "8vb",
    description: "Octave down",
    level: "beat",
    patch: { octaveShift: "8vb" },
    symbol: "8vb",
    category: "Octave",
  },
  {
    key: "oct:15ma",
    label: "15ma",
    description: "Two octaves up",
    level: "beat",
    patch: { octaveShift: "15ma" },
    symbol: "15ma",
    category: "Octave",
  },
  {
    key: "oct:15mb",
    label: "15mb",
    description: "Two octaves down",
    level: "beat",
    patch: { octaveShift: "15mb" },
    symbol: "15mb",
    category: "Octave",
  },

  // Vibrato (beat-level)
  {
    key: "vib:slight",
    label: "Slight Vib.",
    description: "Slight vibrato",
    level: "beat",
    patch: { vibrato: "slight" },
    symbol: "~",
    category: "Vibrato",
  },
  {
    key: "vib:wide",
    label: "Wide Vib.",
    description: "Wide vibrato",
    level: "beat",
    patch: { vibrato: "wide" },
    symbol: "~~",
    category: "Vibrato",
  },
];

// ================================================================
// Note-level items
// ================================================================

const NOTE_ITEMS: EffectPaletteItem[] = [
  // Technique
  {
    key: "ne:h",
    label: "Hammer/Pull",
    description: "Hammer-on / Pull-off",
    level: "note",
    patch: { noteEffect: "h" },
    symbol: "H",
    category: "Technique",
  },
  {
    key: "ne:tr",
    label: "Trill",
    description: "Trill",
    level: "note",
    patch: { noteEffect: "tr" },
    symbol: "tr",
    category: "Technique",
  },

  // Accent
  {
    key: "acc:ac",
    label: "Accent",
    description: "Accent mark",
    level: "note",
    patch: { accent: "ac" },
    symbol: glyph(ARTICULATION.accent),
    useBravuraFont: true,
    category: "Accent",
  },
  {
    key: "acc:hac",
    label: "Heavy Acc.",
    description: "Heavy accent",
    level: "note",
    patch: { accent: "hac" },
    symbol: "^",
    category: "Accent",
  },
  {
    key: "acc:ten",
    label: "Tenuto",
    description: "Tenuto mark",
    level: "note",
    patch: { accent: "ten" },
    symbol: glyph(ARTICULATION.tenuto),
    useBravuraFont: true,
    category: "Accent",
  },

  // Ornament
  {
    key: "orn:turn",
    label: "Turn",
    description: "Turn ornament",
    level: "note",
    patch: { ornament: "turn" },
    symbol: "S",
    category: "Ornament",
  },
  {
    key: "orn:iturn",
    label: "Inv. Turn",
    description: "Inverted turn",
    level: "note",
    patch: { ornament: "iturn" },
    symbol: "iS",
    category: "Ornament",
  },
  {
    key: "orn:umordent",
    label: "Upper Mord.",
    description: "Upper mordent",
    level: "note",
    patch: { ornament: "umordent" },
    symbol: "mw",
    category: "Ornament",
  },
  {
    key: "orn:lmordent",
    label: "Lower Mord.",
    description: "Lower mordent",
    level: "note",
    patch: { ornament: "lmordent" },
    symbol: "m",
    category: "Ornament",
  },

  // Harmonic
  {
    key: "har:nh",
    label: "Natural Harm.",
    description: "Natural harmonic",
    level: "note",
    patch: { harmonicType: "nh" },
    symbol: "NH",
    category: "Harmonic",
  },
  {
    key: "har:ah",
    label: "Artificial Harm.",
    description: "Artificial harmonic",
    level: "note",
    patch: { harmonicType: "ah" },
    symbol: "AH",
    category: "Harmonic",
  },
  {
    key: "har:ph",
    label: "Pinch Harm.",
    description: "Pinch harmonic",
    level: "note",
    patch: { harmonicType: "ph" },
    symbol: "PH",
    category: "Harmonic",
  },
  {
    key: "har:th",
    label: "Tap Harm.",
    description: "Tap harmonic",
    level: "note",
    patch: { harmonicType: "th" },
    symbol: "TH",
    category: "Harmonic",
  },
  {
    key: "har:sh",
    label: "Semi Harm.",
    description: "Semi harmonic",
    level: "note",
    patch: { harmonicType: "sh" },
    symbol: "SH",
    category: "Harmonic",
  },
  {
    key: "har:fh",
    label: "Feedback Harm.",
    description: "Feedback harmonic",
    level: "note",
    patch: { harmonicType: "fh" },
    symbol: "FH",
    category: "Harmonic",
  },

  // Slide
  {
    key: "sli:sib",
    label: "Slide In Below",
    description: "Slide in from below",
    level: "note",
    patch: { slideIn: "below" },
    symbol: "/",
    category: "Slide",
  },
  {
    key: "sli:sia",
    label: "Slide In Above",
    description: "Slide in from above",
    level: "note",
    patch: { slideIn: "above" },
    symbol: "\\",
    category: "Slide",
  },
  {
    key: "slo:ss",
    label: "Shift Slide",
    description: "Shift slide out",
    level: "note",
    patch: { slideOut: "shift" },
    symbol: "ss",
    category: "Slide",
  },
  {
    key: "slo:sl",
    label: "Legato Slide",
    description: "Legato slide out",
    level: "note",
    patch: { slideOut: "legato" },
    symbol: "sl",
    category: "Slide",
  },
  {
    key: "slo:sou",
    label: "Slide Out Up",
    description: "Slide out upward",
    level: "note",
    patch: { slideOut: "up" },
    symbol: "sou",
    category: "Slide",
  },
  {
    key: "slo:sod",
    label: "Slide Out Down",
    description: "Slide out downward",
    level: "note",
    patch: { slideOut: "down" },
    symbol: "sod",
    category: "Slide",
  },

  // Pick Slide
  {
    key: "ps:up",
    label: "Pick Slide Up",
    description: "Pick slide up",
    level: "note",
    patch: { pickSlide: "up" },
    symbol: "psu",
    category: "Pick Slide",
  },
  {
    key: "ps:down",
    label: "Pick Slide Down",
    description: "Pick slide down",
    level: "note",
    patch: { pickSlide: "down" },
    symbol: "psd",
    category: "Pick Slide",
  },

  // Articulation
  {
    key: "fl:staccato",
    label: "Staccato",
    description: "Staccato articulation",
    level: "note",
    patch: { isStaccato: true },
    symbol: glyph(ARTICULATION.staccato),
    useBravuraFont: true,
    category: "Articulation",
  },
  {
    key: "fl:palmMute",
    label: "Palm Mute",
    description: "Palm mute (P.M.)",
    level: "note",
    patch: { isPalmMute: true },
    symbol: "PM",
    category: "Articulation",
  },
  {
    key: "fl:letRing",
    label: "Let Ring",
    description: "Let ring",
    level: "note",
    patch: { isLetRing: true },
    symbol: "LR",
    category: "Articulation",
  },
  {
    key: "fl:dead",
    label: "Dead Note",
    description: "Dead / muted note",
    level: "note",
    patch: { isDead: true },
    symbol: "X",
    category: "Articulation",
  },
  {
    key: "fl:bend",
    label: "Bend",
    description: "String bend",
    level: "note",
    patch: { isBend: true },
    symbol: "b",
    category: "Articulation",
  },
  {
    key: "fl:tied",
    label: "Tied",
    description: "Tie to previous note",
    level: "note",
    patch: { isTied: true },
    symbol: "T",
    category: "Articulation",
  },
  {
    key: "fl:ghost",
    label: "Ghost Note",
    description: "Ghost note (parenthesised)",
    level: "note",
    patch: { isGhost: true },
    symbol: "()",
    category: "Articulation",
  },
  {
    key: "fl:lht",
    label: "Left-Hand Tap",
    description: "Left-hand tap",
    level: "note",
    patch: { isLeftHandTap: true },
    symbol: "LHT",
    category: "Articulation",
  },
];

// ================================================================
// Drag Data Transfer
// ================================================================

export const EFFECT_DRAG_MIME = "application/x-studio-effect";

// ================================================================
// Sub-components
// ================================================================

function PaletteItemCard({ item }: { item: EffectPaletteItem }) {
  const handleDragStart = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData(
        EFFECT_DRAG_MIME,
        JSON.stringify({
          key: item.key,
          level: item.level,
          patch: item.patch,
        }),
      );
      e.dataTransfer.effectAllowed = "copy";

      // Create a custom drag image
      const ghost = document.createElement("div");
      ghost.className = "studio-effect-drag-ghost";
      ghost.textContent = item.label;
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(
        ghost,
        ghost.offsetWidth / 2,
        ghost.offsetHeight / 2,
      );
      requestAnimationFrame(() => {
        document.body.removeChild(ghost);
      });

      // Mark body so the grid knows a palette drag is active
      document.body.classList.add("studio-effect-dragging");
      document.body.setAttribute("data-effect-level", item.level);
    },
    [item],
  );

  const handleDragEnd = React.useCallback(() => {
    document.body.classList.remove("studio-effect-dragging");
    document.body.removeAttribute("data-effect-level");
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={cn(
              "studio-effect-item flex cursor-grab select-none flex-col items-center justify-center gap-0.5 rounded-md border border-border/70 bg-card/80 px-2 py-1.5 text-center transition-all duration-150",
              "hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm",
              "active:scale-95 active:cursor-grabbing  ",
              item.level === "beat"
                ? "border-l-2 border-l-blue-500/50"
                : "border-l-2 border-l-amber-500/50",
            )}
          >
            {item.symbol ? (
              <span
                className="text-sm font-bold leading-none"
                style={item.useBravuraFont ? BRAVURA_TEXT_STYLE : undefined}
              >
                {item.symbol}
              </span>
            ) : null}
            <span className="text-[10px] font-medium leading-tight text-foreground/80">
              {item.label}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px]">
          <p className="font-semibold">{item.label}</p>
          <p className="text-xs text-muted-foreground">{item.description}</p>
          <Badge
            variant={item.level === "beat" ? "default" : "secondary"}
            className="mt-1 text-[10px]"
          >
            {item.level === "beat" ? "Beat level" : "Note level"}
          </Badge>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function PaletteSection({
  title,
  items,
}: {
  title: string;
  items: EffectPaletteItem[];
}) {
  const grouped = React.useMemo(() => {
    const map = new Map<string, EffectPaletteItem[]>();
    for (const item of items) {
      const arr = map.get(item.category);
      if (arr) arr.push(item);
      else map.set(item.category, [item]);
    }
    return map;
  }, [items]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/70">
          {title}
        </h3>
        <div className="h-px flex-1 bg-border/60" />
      </div>
      {Array.from(grouped.entries()).map(([category, categoryItems]) => (
        <div key={category} className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground/80">
            {category}
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-1">
            {categoryItems.map((item) => (
              <PaletteItemCard key={item.key} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ================================================================
// Main palette content (rendered inside interactive window)
// ================================================================

export function StudioEffectPaletteContent() {
  return (
    <div className="flex h-full flex-col gap-3 px-3">
      <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/30 px-3 py-2">
        <Waves className="size-4 text-primary" />
        <p className="text-xs text-muted-foreground">
          Drag effects to the editor grid.{" "}
          <strong className="text-blue-500">Beat-level</strong> affects entire
          beat column. <strong className="text-amber-500">Note-level</strong>{" "}
          targets specific notes.
        </p>
      </div>

      <PaletteSection title="Beat Level" items={BEAT_ITEMS} />

      <div className="h-px bg-border" />

      <PaletteSection title="Note Level" items={NOTE_ITEMS} />
    </div>
  );
}
