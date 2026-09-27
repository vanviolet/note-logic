import { memo } from "react";
import { Link } from "react-router";
import {
  parseChordProLine,
  isChordOnlyLine,
  transposeChord,
  type ChordProToken,
} from "../lib/songbook-utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/templates/components/ui/hover-card";
import { ChordDiagramMini } from "./chord-diagram";
import { resolveChordId } from "~/theory-music/chord";

// ── Chord label with hover diagram + click → /chord/:id ──

function ChordHover({ chord }: { chord: string }) {
  // Strip bass note for diagram lookup (e.g. "C/G" → "C")
  const diagramChord = chord.includes("/") ? chord.split("/")[0] : chord;
  const chordId = resolveChordId(diagramChord);

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link
          to={`/chord/${chordId}`}
          prefetch="intent"
          className="cursor-pointer font-mono text-xs font-bold text-primary underline-offset-2 hover:underline sm:text-sm"
        >
          {chord}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="center"
        className="w-auto p-2"
        sideOffset={6}
      >
        <ChordDiagramMini chord={diagramChord} />
      </HoverCardContent>
    </HoverCard>
  );
}

// ── Single token: chord above, text below ──────────────

function ChordToken({
  token,
  chordOnly,
}: {
  token: ChordProToken;
  chordOnly?: boolean;
}) {
  if (!token.chord) {
    // Plain text token (no chord)
    return <span className="whitespace-pre-wrap">{token.text}</span>;
  }

  if (chordOnly) {
    // Chord-only lines: render chord inline with explicit spacing
    return (
      <span className="mr-4">
        <ChordHover chord={token.chord} />
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-start">
      <span className="select-none leading-tight">
        <ChordHover chord={token.chord} />
      </span>
      <span className="whitespace-pre-wrap">{token.text || "\u00A0"}</span>
    </span>
  );
}

// ── Full line renderer ─────────────────────────────────

interface ChordProLineProps {
  line: string;
  /** Semitone offset for transposing chords */
  transpose?: number;
}

export const ChordProLine = memo(function ChordProLine({
  line,
  transpose = 0,
}: ChordProLineProps) {
  // Empty line → spacer
  if (!line.trim()) {
    return <div className="h-2" />;
  }

  // Annotation line (no chords, wrapped in parens, or short instructions)
  if (!line.includes("[")) {
    return (
      <div className="text-sm italic text-muted-foreground/80">{line}</div>
    );
  }

  const chordOnly = isChordOnlyLine(line);
  // Extract non-chord tail text (e.g. "x2") from chord-only lines
  const tailText = chordOnly ? line.replace(/\[[^\]]+\]/g, "").trim() : "";

  const raw = parseChordProLine(line);
  // Apply transpose if needed
  const tokens =
    transpose !== 0
      ? raw.map((t) => ({
          ...t,
          chord: t.chord ? transposeChord(t.chord, transpose) : undefined,
        }))
      : raw;

  if (chordOnly) {
    return (
      <div className="flex flex-wrap items-center gap-0 text-sm leading-relaxed">
        {tokens
          .filter((t) => t.chord)
          .map((token, i) => (
            <ChordToken key={i} token={token} chordOnly />
          ))}
        {tailText && (
          <span className="text-xs italic text-muted-foreground/70">
            {tailText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-end gap-0 text-sm leading-relaxed">
      {tokens.map((token, i) => (
        <ChordToken key={i} token={token} />
      ))}
    </div>
  );
});
