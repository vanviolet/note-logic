import { memo } from "react";
import type { SongSection } from "~/theory-music/songbook/types";
import { SECTION_COLORS } from "../lib/songbook-utils";
import { ChordProLine } from "./chord-pro-line";

interface SectionBlockProps {
  section: SongSection;
  index: number;
  transpose?: number;
}

export const SectionBlock = memo(function SectionBlock({
  section,
  index,
  transpose = 0,
}: SectionBlockProps) {
  const borderColor =
    SECTION_COLORS[section.type] ?? "border-l-muted-foreground/40";

  return (
    <section
      id={`section-${index}`}
      className={`rounded-lg border border-border bg-card/50 pl-4 border-l-[3px] ${borderColor}`}
    >
      <div className="p-4 pl-0">
        {/* Section label */}
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {section.label}
        </h3>

        {/* ChordPro lines */}
        <div className="space-y-1 font-[system-ui]">
          {section.lines.map((line, i) => (
            <ChordProLine key={i} line={line} transpose={transpose} />
          ))}
        </div>
      </div>
    </section>
  );
});
