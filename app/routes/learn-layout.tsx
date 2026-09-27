import { memo, useEffect } from "react";
import { Outlet } from "react-router";
import { cn } from "~/templates/lib/utils";
import { useLearnSidebarStore } from "~/shared/stores/learn-sidebar.store";
import { LearnFretboardPanel } from "./components/learn-fretboard-panel";

/**
 * Memoized outlet wrapper that reads sidebar + fretboard panel state from
 * Zustand and adjusts padding accordingly.
 *
 * Sidebar toggles update right padding; panel open/resize updates bottom
 * padding. In both cases MemoizedOutlet does NOT re-render — keeping heavy
 * card lists stable regardless of panel state.
 */
const MemoizedOutlet = memo(Outlet);

const LearnContentWrapper = memo(function LearnContentWrapper() {
  const isOpen = useLearnSidebarStore((s) => s.isOpen);

  return (
    <div
      className={cn(
        "transition-[padding-right] duration-200 ease-out",
        isOpen && "lg:pr-[300px]",
      )}
      style={{ paddingBottom: "var(--learn-panel-h, 48px)" }}
    >
      <MemoizedOutlet />
    </div>
  );
});

/**
 * Layout route for learn modules: /chord, /family, /interval.
 *
 * Responsibilities:
 * - Syncs sidebar open state to viewport width (lg+ = open by default).
 * - Renders a memoized content wrapper that adjusts right + bottom padding.
 * - Renders the shared `LearnFretboardPanel` fixed at the bottom; cards push
 *   data into it via `useLearnFretboardStore` action calls on click.
 *
 * The `FloatingFilterSidebar` toggle and panel are rendered per-route (each
 * route has its own filter controls) but share state via `useLearnSidebarStore`,
 * so toggling the sidebar never causes card re-renders.
 */
export default function LearnLayout() {
  const setOpen = useLearnSidebarStore((s) => s.setOpen);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncSidebarByViewport = () => setOpen(mediaQuery.matches);

    syncSidebarByViewport();
    mediaQuery.addEventListener("change", syncSidebarByViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncSidebarByViewport);
    };
  }, [setOpen]);

  return (
    <>
      <LearnContentWrapper />
      <LearnFretboardPanel />
    </>
  );
}
