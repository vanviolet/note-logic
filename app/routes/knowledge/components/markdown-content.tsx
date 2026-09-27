// ════════════════════════════════════════════════════════
// Knowledge – Markdown Content Renderer
// Renders markdown strings as styled HTML
// ════════════════════════════════════════════════════════

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "~/templates/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content with proper typography and GFM support.
 * Handles bold, italic, lists, tables, code blocks, links, etc.
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        // Headings
        "prose-headings:font-semibold",
        // Paragraphs
        "prose-p:text-muted-foreground prose-p:leading-relaxed",
        // Strong / bold
        "prose-strong:text-foreground prose-strong:font-semibold",
        // Lists
        "prose-li:text-muted-foreground prose-li:leading-relaxed",
        "prose-ul:my-2 prose-ol:my-2",
        // Tables
        "prose-table:text-sm",
        "prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-muted-foreground prose-th:border-b prose-th:border-border/50",
        "prose-td:px-3 prose-td:py-1.5 prose-td:border-b prose-td:border-border/20",
        // Code
        "prose-code:rounded prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono prose-code:text-foreground prose-code:before:content-[''] prose-code:after:content-['']",
        // Links
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        // Blockquote
        "prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground",
        className,
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}
