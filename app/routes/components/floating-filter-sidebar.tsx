import {
  PanelRightClose,
  PanelRightOpen,
  SlidersHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "~/templates/components/ui/button";
import { cn } from "~/templates/lib/utils";
import { useLearnSidebarStore } from "~/shared/stores/learn-sidebar.store";

interface FloatingFilterSidebarProps {
  title: string;
  children: ReactNode;
  className?: string;
  /** Label for the toggle button (default: "Filter") */
  toggleLabel?: string;
}

/**
 * Layout-pushing sidebar panel + toggle button.
 * Reads open/close state from `useLearnSidebarStore` (Zustand).
 * The sidebar is fixed-right; consumers should apply `pr-[300px]`
 * when `isOpen` to push their content left.
 */
export function FloatingFilterSidebar({
  title,
  children,
  className,
  toggleLabel = "Filter",
}: FloatingFilterSidebarProps) {
  const { isOpen, toggle } = useLearnSidebarStore();

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={toggle}
        className={cn(
          "fixed top-[4.6rem] z-40 h-8 gap-2 px-2.5 text-xs transition-all duration-300",
          isOpen ? "right-2 lg:right-[308px]" : "right-2",
        )}
      >
        {isOpen ? (
          <PanelRightClose className="size-4" />
        ) : (
          <PanelRightOpen className="size-4" />
        )}
        <span className="hidden sm:inline">{toggleLabel}</span>
      </Button>

      <aside
        className={cn(
          "fixed top-16 right-0 z-30 h-[calc(100vh-4rem)] w-[min(90vw,300px)] transition-all duration-300",
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-[110%] opacity-0",
          className,
        )}
      >
        <div className="border-border/80 bg-background/92 flex h-full flex-col border-l backdrop-blur">
          <header className="border-border/70 flex h-12 items-center border-b px-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4" />
              {title}
            </h2>
          </header>
          <div className="min-h-0 flex-1 overflow-auto p-3">{children}</div>
        </div>
      </aside>
    </>
  );
}
