// ════════════════════════════════════════════════════════
// Knowledge – Icon Mapper
// Maps string identifiers to Lucide icons for data-driven rendering
// ════════════════════════════════════════════════════════

import {
  Calculator,
  Scroll,
  AudioWaveform,
  Brain,
  Globe,
  Layers,
  Timer,
  type LucideIcon,
  Music,
  FlaskConical,
  Calendar,
  Table,
  BarChart3,
  CircleDot,
  Lightbulb,
  Gamepad2,
  Volume2,
  Play,
  Trophy,
  ThumbsUp,
  BookOpen,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "~/templates/lib/utils";

/** Map of string identifier → Lucide icon component */
const ICON_MAP: Record<string, LucideIcon> = {
  // Article hero icons
  calculator: Calculator,
  scroll: Scroll,
  "audio-waveform": AudioWaveform,
  brain: Brain,
  globe: Globe,

  // Widget header icons
  music: Music,
  "flask-conical": FlaskConical,
  calendar: Calendar,
  table: Table,
  "bar-chart": BarChart3,
  "circle-dot": CircleDot,

  // New article icons
  layers: Layers,
  metronome: Timer,

  // Utility icons
  lightbulb: Lightbulb,
  gamepad: Gamepad2,
  "volume-2": Volume2,
  play: Play,
  trophy: Trophy,
  "thumbs-up": ThumbsUp,
  "book-open": BookOpen,
  "check-circle": CheckCircle2,
  "x-circle": XCircle,
};

interface KnowledgeIconProps {
  name: string;
  className?: string;
}

/** Render a Lucide icon by string identifier */
export function KnowledgeIcon({ name, className }: KnowledgeIconProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={cn("shrink-0", className)} />;
}

export { ICON_MAP };
