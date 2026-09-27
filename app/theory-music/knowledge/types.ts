// ════════════════════════════════════════════════════════
// Music Knowledge – Types
// ════════════════════════════════════════════════════════

/** Top-level category for knowledge articles */
export type KnowledgeCategory =
  | "math-and-science"
  | "history"
  | "acoustics"
  | "psychology"
  | "culture";

/** Difficulty/depth level for the reader */
export type KnowledgeLevel = "beginner" | "intermediate" | "advanced";

/** A single interactive element embedded in an article section */
export type InteractiveWidget =
  | {
      type: "ratio-calculator";
      /** Pairs of [ratio label, frequency multiplier] */
      ratios: Array<{ label: string; ratio: number; cents: number }>;
    }
  | {
      type: "frequency-table";
      rows: Array<{
        note: string;
        octave: number;
        frequency: number;
        midi: number;
      }>;
    }
  | {
      type: "timeline";
      events: Array<{
        year: string;
        title: string;
        description: string;
        era?: string;
      }>;
    }
  | {
      type: "comparison-table";
      headers: string[];
      rows: Array<string[]>;
    }
  | {
      type: "quiz";
      questions: Array<{
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
      }>;
    }
  | {
      type: "circle-of-fifths";
    }
  | {
      type: "harmonic-series";
      fundamentalHz: number;
      partials: number;
    }
  | {
      type: "alphatex-player";
      /** Title shown above the player */
      title: string;
      /** AlphaTex source code */
      tex: string;
      /** Optional description shown below title */
      description?: string;
    };

/** A content section within an article */
export interface KnowledgeSection {
  id: string;
  title: string;
  /** Markdown-like content (rendered as rich text) */
  content: string;
  /** Optional interactive widget embedded in the section */
  widget?: InteractiveWidget;
  /** Optional key takeaway shown in a callout box */
  keyTakeaway?: string;
}

/** Cross-reference link inside or outside the knowledge module */
export interface KnowledgeCrossRef {
  /** Target type for routing */
  type: "knowledge" | "nolopedia" | "interval" | "chord" | "family";
  /** ID used for routing (articleId, termId, etc.) */
  id: string;
  /** Display label */
  label: string;
}

/** A full knowledge article */
export interface KnowledgeArticle {
  id: string;
  title: string;
  subtitle: string;
  category: KnowledgeCategory;
  level: KnowledgeLevel;
  /** Estimated reading time in minutes */
  readingTime: number;
  /** Short description for list cards and meta */
  description: string;
  /** Lucide icon name for article hero */
  heroIcon: string;
  /** Article sections */
  sections: KnowledgeSection[];
  /** Cross-references to other modules */
  crossRefs: KnowledgeCrossRef[];
  /** Related article IDs within knowledge module */
  relatedArticles: string[];
  /** Tags for search */
  tags: string[];
}

/** Category display metadata */
export const KNOWLEDGE_CATEGORY_META: Record<
  KnowledgeCategory,
  { label: string; description: string; color: string }
> = {
  "math-and-science": {
    label: "Matematika & Sains",
    description: "Hubungan musik dengan matematika, fisika, dan sains",
    color: "text-blue-500",
  },
  history: {
    label: "Sejarah Musik",
    description: "Perjalanan musik dari zaman kuno hingga modern",
    color: "text-amber-500",
  },
  acoustics: {
    label: "Akustik & Suara",
    description: "Ilmu suara, frekuensi, gelombang, dan resonansi",
    color: "text-emerald-500",
  },
  psychology: {
    label: "Psikologi Musik",
    description: "Pengaruh musik terhadap otak, emosi, dan perilaku",
    color: "text-purple-500",
  },
  culture: {
    label: "Budaya & Musik Dunia",
    description: "Musik dalam konteks budaya dan tradisi di seluruh dunia",
    color: "text-rose-500",
  },
};

export const KNOWLEDGE_LEVEL_META: Record<
  KnowledgeLevel,
  { label: string; variant: "tonic" | "subdominant" | "dominant" }
> = {
  beginner: { label: "Pemula", variant: "tonic" },
  intermediate: { label: "Menengah", variant: "subdominant" },
  advanced: { label: "Lanjutan", variant: "dominant" },
};
