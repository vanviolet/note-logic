// ════════════════════════════════════════════════════════
// Music Knowledge – Barrel Export
// ════════════════════════════════════════════════════════

import type { KnowledgeArticle, KnowledgeCategory } from "./types";
export type {
  KnowledgeArticle,
  KnowledgeSection,
  KnowledgeCrossRef,
  KnowledgeCategory,
  KnowledgeLevel,
  InteractiveWidget,
} from "./types";
export { KNOWLEDGE_CATEGORY_META, KNOWLEDGE_LEVEL_META } from "./types";

import { ARTICLE_MATH_OF_MUSIC } from "./articles/math-of-music";
import { ARTICLE_HISTORY_OF_MUSIC } from "./articles/history-of-music";
import { ARTICLE_ACOUSTICS_OF_SOUND } from "./articles/acoustics-of-sound";
import { ARTICLE_PSYCHOLOGY_OF_MUSIC } from "./articles/psychology-of-music";
import { ARTICLE_WORLD_MUSIC_SYSTEMS } from "./articles/world-music-systems";
import { ARTICLE_CHORD_AND_HARMONY } from "./articles/chord-and-harmony";
import { ARTICLE_RHYTHM_AND_METER } from "./articles/rhythm-and-meter";

/** All knowledge articles in display order */
export const ALL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  ARTICLE_MATH_OF_MUSIC,
  ARTICLE_CHORD_AND_HARMONY,
  ARTICLE_RHYTHM_AND_METER,
  ARTICLE_HISTORY_OF_MUSIC,
  ARTICLE_ACOUSTICS_OF_SOUND,
  ARTICLE_PSYCHOLOGY_OF_MUSIC,
  ARTICLE_WORLD_MUSIC_SYSTEMS,
];

/** O(1) lookup by article ID */
export const KNOWLEDGE_MAP: ReadonlyMap<string, KnowledgeArticle> = new Map(
  ALL_KNOWLEDGE_ARTICLES.map((a) => [a.id, a]),
);

/** Get article by ID */
export function getKnowledgeArticleById(
  id: string,
): KnowledgeArticle | undefined {
  return KNOWLEDGE_MAP.get(id);
}

/** Get articles by category */
export function getKnowledgeByCategory(
  category: KnowledgeCategory,
): KnowledgeArticle[] {
  return ALL_KNOWLEDGE_ARTICLES.filter((a) => a.category === category);
}

/** Simple text search across title, description, and tags */
export function searchKnowledge(query: string): KnowledgeArticle[] {
  const q = query.toLowerCase();
  return ALL_KNOWLEDGE_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.subtitle.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

/** Resolve related articles for a given article */
export function getRelatedArticles(
  article: KnowledgeArticle,
): KnowledgeArticle[] {
  return article.relatedArticles
    .map((id) => KNOWLEDGE_MAP.get(id))
    .filter((a): a is KnowledgeArticle => a != null);
}
