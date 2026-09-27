// ════════════════════════════════════════════════════════
// Knowledge – Section Renderer
// Renders article sections with content + interactive widgets
// ════════════════════════════════════════════════════════

import type { KnowledgeSection } from "~/theory-music/knowledge/types";
import { Lightbulb } from "lucide-react";
import { RatioCalculator } from "./ratio-calculator";
import { QuizWidget } from "./quiz-widget";
import { TimelineWidget } from "./timeline-widget";
import { ComparisonTableWidget } from "./comparison-table-widget";
import { FrequencyTableWidget } from "./frequency-table-widget";
import { HarmonicSeriesWidget } from "./harmonic-series-widget";
import { CircleOfFifthsWidget } from "./circle-of-fifths-widget";
import { AlphaTexPlayerWidget } from "./alphatex-player-widget";
import { MarkdownContent } from "./markdown-content";

interface SectionRendererProps {
  section: KnowledgeSection;
  index: number;
}

/** Dispatch widget by type */
function renderWidget(widget: KnowledgeSection["widget"]) {
  if (!widget) return null;

  switch (widget.type) {
    case "ratio-calculator":
      return <RatioCalculator ratios={widget.ratios} />;
    case "quiz":
      return <QuizWidget questions={widget.questions} />;
    case "timeline":
      return <TimelineWidget events={widget.events} />;
    case "comparison-table":
      return (
        <ComparisonTableWidget headers={widget.headers} rows={widget.rows} />
      );
    case "frequency-table":
      return <FrequencyTableWidget rows={widget.rows} />;
    case "harmonic-series":
      return (
        <HarmonicSeriesWidget
          fundamentalFrequency={widget.fundamentalHz}
          harmonicCount={widget.partials}
        />
      );
    case "circle-of-fifths":
      return <CircleOfFifthsWidget />;
    case "alphatex-player":
      return (
        <AlphaTexPlayerWidget
          title={widget.title}
          tex={widget.tex}
          description={widget.description}
        />
      );
    default:
      return null;
  }
}

/** Render a single article section with prose content + widget */
export function SectionRenderer({ section, index }: SectionRendererProps) {
  return (
    <section id={section.id} className="scroll-mt-20 space-y-4">
      {/* Section heading */}
      <h2 className="flex items-baseline gap-3 text-xl font-bold sm:text-2xl">
        <span className="text-primary/40 text-sm font-mono">
          {String(index + 1).padStart(2, "0")}
        </span>
        {section.title}
      </h2>

      {/* Prose content – rendered as markdown */}
      <MarkdownContent content={section.content} />

      {/* Interactive widget */}
      {section.widget && (
        <div className="my-4">{renderWidget(section.widget)}</div>
      )}

      {/* Key takeaway callout */}
      {section.keyTakeaway && (
        <div className="rounded-lg border-l-4 border-primary bg-primary/5 px-4 py-3">
          <p className="text-sm font-medium">
            <Lightbulb className="mr-1.5 inline h-4 w-4 text-primary" />
            <span className="font-semibold">Key Takeaway: </span>
            {section.keyTakeaway}
          </p>
        </div>
      )}
    </section>
  );
}
