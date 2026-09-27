import * as React from "react";
import {
  AlbumIcon,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CopyrightIcon,
  Guitar,
  MicVocal,
  Music2,
  Music4,
  UserRound,
} from "lucide-react";
import { Badge } from "~/templates/components/ui/badge";
import { Input } from "~/templates/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import type { KeySignature, ScoreSettings } from "../types";

// ── Constants ──────────────────────────────────────────

const KEY_SIGNATURES: { value: KeySignature; label: string; sharps: number }[] =
  [
    { value: "Cb", label: "Cb (7b)", sharps: -7 },
    { value: "Gb", label: "Gb (6b)", sharps: -6 },
    { value: "Db", label: "Db (5b)", sharps: -5 },
    { value: "Ab", label: "Ab (4b)", sharps: -4 },
    { value: "Eb", label: "Eb (3b)", sharps: -3 },
    { value: "Bb", label: "Bb (2b)", sharps: -2 },
    { value: "F", label: "F (1b)", sharps: -1 },
    { value: "C", label: "C (0)", sharps: 0 },
    { value: "G", label: "G (1#)", sharps: 1 },
    { value: "D", label: "D (2#)", sharps: 2 },
    { value: "A", label: "A (3#)", sharps: 3 },
    { value: "E", label: "E (4#)", sharps: 4 },
    { value: "B", label: "B (5#)", sharps: 5 },
    { value: "F#", label: "F# (6#)", sharps: 6 },
    { value: "C#", label: "C# (7#)", sharps: 7 },
  ];

// Guitar Pro / AlphaTex common instrument names grouped by family
const INSTRUMENT_GROUPS: { group: string; instruments: string[] }[] = [
  {
    group: "Guitar (Steel)",
    instruments: [
      "Acoustic Guitar Steel",
      "Acoustic Guitar Nylon",
      "Overdriven Guitar",
      "Distortion Guitar",
      "Electric Guitar Clean",
      "Guitar Harmonics",
      "Electric Guitar Jazz",
      "Ocarina",
    ],
  },
  {
    group: "Bass",
    instruments: [
      "Electric Bass Finger",
      "Electric Bass Pick",
      "Fretless Bass",
      "Acoustic Bass",
      "Slap Bass 1",
      "Slap Bass 2",
      "Synth Bass 1",
      "Synth Bass 2",
    ],
  },
  {
    group: "Lead / Solo",
    instruments: [
      "Lead 5 Charang",
      "Lead 1 Square",
      "Lead 2 Sawtooth",
      "Electric Guitar Muted",
    ],
  },
  {
    group: "Piano / Keys",
    instruments: [
      "Acoustic Grand Piano",
      "Bright Grand Piano",
      "Electric Grand Piano",
      "Honky tonk Piano",
      "Electric Piano 1",
      "Electric Piano 2",
      "Harpsichord",
      "Clavinet",
      "Celesta",
      "Drawbar Organ",
      "Church Organ",
    ],
  },
  {
    group: "Strings",
    instruments: [
      "Violin",
      "Viola",
      "Cello",
      "Contrabass",
      "Tremolo Strings",
      "String Ensemble 1",
      "String Ensemble 2",
    ],
  },
  {
    group: "Woodwind / Brass",
    instruments: [
      "Flute",
      "Oboe",
      "Clarinet",
      "Alto Sax",
      "Tenor Sax",
      "Trumpet",
      "Trombone",
      "French Horn",
    ],
  },
  {
    group: "Percussion",
    instruments: ["Xylophone", "Vibraphone", "Marimba"],
  },
];

// ── Helpers ────────────────────────────────────────────

function countChanges(s: ScoreSettings): number {
  return [
    s.trackName !== "Guitar",
    s.instrument !== "Acoustic Guitar Steel",
    s.capo > 0,
    s.keySignature !== "C",
    Boolean(s.subtitle),
    Boolean(s.artist),
    Boolean(s.album),
    Boolean(s.music),
    Boolean(s.words),
    Boolean(s.copyright),
  ].filter(Boolean).length;
}

// ── Sub-component: row field ───────────────────────────

function RowField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground">
        {Icon && <Icon className="h-3 w-3 shrink-0" />}
        <span className="truncate">{label}</span>
      </p>
      {children}
    </div>
  );
}

// ── Section header row ─────────────────────────────────

function SectionHeader({
  label,
  open,
  onToggle,
  badge,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-accent/50"
    >
      {open ? (
        <ChevronDown className="h-3 w-3 shrink-0" />
      ) : (
        <ChevronRight className="h-3 w-3 shrink-0" />
      )}
      <span className="flex-1 truncate text-left">{label}</span>
      {badge != null && badge > 0 && (
        <Badge
          variant="outline"
          className="h-4 shrink-0 px-1 py-0 text-[10px] leading-none"
        >
          {badge}
        </Badge>
      )}
    </button>
  );
}

// ── Main component ─────────────────────────────────────

export type StudioScoreSettingsPanelProps = {
  settings: ScoreSettings;
  onChange: (patch: Partial<ScoreSettings>) => void;
};

export const StudioScoreSettingsPanel = React.memo(
  function StudioScoreSettingsPanel({
    settings,
    onChange,
  }: StudioScoreSettingsPanelProps) {
    const [trackOpen, setTrackOpen] = React.useState(true);
    const [scoreOpen, setScoreOpen] = React.useState(true);
    const [customInstrument, setCustomInstrument] = React.useState(false);

    const allInstruments = INSTRUMENT_GROUPS.flatMap((g) => g.instruments);
    const isKnownInstrument = allInstruments.includes(settings.instrument);

    React.useEffect(() => {
      setCustomInstrument(!isKnownInstrument && settings.instrument !== "");
    }, [isKnownInstrument, settings.instrument]);

    const changed = countChanges(settings);

    const trackBadge = [
      settings.trackName !== "Guitar",
      settings.instrument !== "Acoustic Guitar Steel",
      settings.capo > 0,
      settings.keySignature !== "C",
    ].filter(Boolean).length;

    const scoreBadge = [
      Boolean(settings.subtitle),
      Boolean(settings.artist),
      Boolean(settings.album),
      Boolean(settings.music),
      Boolean(settings.words),
      Boolean(settings.copyright),
    ].filter(Boolean).length;

    const selectedKsLabel =
      KEY_SIGNATURES.find((k) => k.value === settings.keySignature)?.label ??
      settings.keySignature;

    return (
      <div className="min-w-0">
        {/* ── Sticky header ──────────────────────────── */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-card/80 px-2.5 py-1.5 backdrop-blur">
          <div className="flex min-w-0 items-center gap-1.5">
            <Music4 className="h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="truncate text-xs font-semibold text-muted-foreground">
              Score &amp; Track
            </p>
          </div>
          {changed > 0 && (
            <Badge variant="outline" className="h-5 shrink-0 text-[10px]">
              {changed}
            </Badge>
          )}
        </div>

        {/* ── Content ────────────────────────────────── */}
        <div className="space-y-0.5 p-2.5">
          {/* Track section */}
          <SectionHeader
            label="Track"
            open={trackOpen}
            onToggle={() => setTrackOpen((v) => !v)}
            badge={trackBadge}
          />

          {trackOpen && (
            <div className="space-y-2.5 pb-2 pl-4 pt-1">
              <RowField label="Track Name" icon={Music2}>
                <Input
                  className="h-7 text-xs"
                  placeholder="Guitar, Bass, Lead…"
                  value={settings.trackName}
                  onChange={(e) => onChange({ trackName: e.target.value })}
                />
              </RowField>

              <RowField label="Capo Fret" icon={BookOpen}>
                <div className="flex flex-wrap gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onChange({ capo: c })}
                      className={`inline-flex h-6 min-w-[26px] items-center justify-center rounded border text-[11px] transition-colors ${
                        settings.capo === c
                          ? "border-primary bg-primary/20 font-semibold text-primary"
                          : "border-border bg-background text-foreground/60 hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {c === 0 ? "—" : c}
                    </button>
                  ))}
                </div>
              </RowField>

              <RowField label="Key Signature" icon={Music4}>
                <div className="flex flex-wrap gap-1">
                  {KEY_SIGNATURES.map((ks) => (
                    <button
                      key={ks.value}
                      type="button"
                      onClick={() => onChange({ keySignature: ks.value })}
                      title={ks.label}
                      className={`inline-flex h-6 min-w-[26px] items-center justify-center rounded border px-1 text-[11px] transition-colors ${
                        settings.keySignature === ks.value
                          ? "border-primary bg-primary/20 font-semibold text-primary"
                          : "border-border bg-background text-foreground/60 hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {ks.value}
                    </button>
                  ))}
                </div>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                  {selectedKsLabel}
                </p>
              </RowField>

              <RowField label="Instrument" icon={Guitar}>
                {!customInstrument ? (
                  <>
                    <Select
                      value={
                        isKnownInstrument ? settings.instrument : "__custom__"
                      }
                      onValueChange={(v) => {
                        if (v === "__custom__") {
                          setCustomInstrument(true);
                        } else {
                          onChange({ instrument: v });
                        }
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Select instrument…" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {INSTRUMENT_GROUPS.map((group) => (
                          <React.Fragment key={group.group}>
                            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              {group.group}
                            </div>
                            {group.instruments.map((inst) => (
                              <SelectItem
                                key={inst}
                                value={inst}
                                className="text-xs"
                              >
                                {inst}
                              </SelectItem>
                            ))}
                          </React.Fragment>
                        ))}
                        <div className="mt-1 border-t border-border pt-1">
                          <SelectItem value="__custom__" className="text-xs">
                            Custom…
                          </SelectItem>
                        </div>
                      </SelectContent>
                    </Select>
                    <button
                      type="button"
                      onClick={() => setCustomInstrument(true)}
                      className="truncate text-[10px] text-muted-foreground hover:text-primary"
                    >
                      Use custom instrument name
                    </button>
                  </>
                ) : (
                  <div className="flex gap-1.5">
                    <Input
                      className="h-7 min-w-0 flex-1 text-xs"
                      placeholder="Exact instrument name…"
                      value={settings.instrument}
                      onChange={(e) => onChange({ instrument: e.target.value })}
                    />
                    <button
                      type="button"
                      className="shrink-0 text-[10px] text-muted-foreground hover:text-primary"
                      onClick={() => {
                        setCustomInstrument(false);
                        onChange({ instrument: "Acoustic Guitar Steel" });
                      }}
                    >
                      Reset
                    </button>
                  </div>
                )}
              </RowField>
            </div>
          )}

          {/* Score Info section */}
          <SectionHeader
            label="Score Info"
            open={scoreOpen}
            onToggle={() => setScoreOpen((v) => !v)}
            badge={scoreBadge}
          />

          {scoreOpen && (
            <div className="space-y-2.5 pb-2 pl-4 pt-1">
              <RowField label="Subtitle">
                <Input
                  className="h-7 text-xs"
                  placeholder="e.g. Ballad in E minor"
                  value={settings.subtitle}
                  onChange={(e) => onChange({ subtitle: e.target.value })}
                />
              </RowField>

              <RowField label="Artist" icon={UserRound}>
                <Input
                  className="h-7 text-xs"
                  placeholder="e.g. Jimi Hendrix"
                  value={settings.artist}
                  onChange={(e) => onChange({ artist: e.target.value })}
                />
              </RowField>

              <RowField label="Album" icon={AlbumIcon}>
                <Input
                  className="h-7 text-xs"
                  placeholder="e.g. Electric Ladyland"
                  value={settings.album}
                  onChange={(e) => onChange({ album: e.target.value })}
                />
              </RowField>

              <RowField label="Music by" icon={MicVocal}>
                <Input
                  className="h-7 text-xs"
                  placeholder="Composer name"
                  value={settings.music}
                  onChange={(e) => onChange({ music: e.target.value })}
                />
              </RowField>

              <RowField label="Lyrics by" icon={MicVocal}>
                <Input
                  className="h-7 text-xs"
                  placeholder="Lyricist name"
                  value={settings.words}
                  onChange={(e) => onChange({ words: e.target.value })}
                />
              </RowField>

              <RowField label="Copyright" icon={CopyrightIcon}>
                <Input
                  className="h-7 text-xs"
                  placeholder="© 2026 Artist"
                  value={settings.copyright}
                  onChange={(e) => onChange({ copyright: e.target.value })}
                />
              </RowField>
            </div>
          )}
        </div>
      </div>
    );
  },
);
