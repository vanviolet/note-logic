import * as React from "react";
import { GripHorizontal } from "lucide-react";
import { cn } from "~/templates/lib/utils";

type StudioPreviewPanelProps = {
  showPreview: boolean;
  previewHeight: number;
  previewDisplayHeight: number;
  left: number;
  width: number;
  bottom: number;
  isDarkMode: boolean;
  alphaHostRef: React.RefObject<HTMLDivElement | null>;
  onStartResize: (event: React.PointerEvent<HTMLButtonElement>) => void;
};

export function StudioPreviewPanel({
  showPreview,
  previewHeight,
  previewDisplayHeight,
  left,
  width,
  bottom,
  isDarkMode,
  alphaHostRef,
  onStartResize,
}: StudioPreviewPanelProps) {
  if (!showPreview) return null;

  return (
    <div
      className={cn(
        "fixed z-30 border-x border-t shadow-lg backdrop-blur-md",
        isDarkMode
          ? "border-border/70 bg-card/90"
          : "border-border bg-white",
      )}
      style={{
        left: `${left}px`,
        width: `${width}px`,
        bottom: `${bottom}px`,
        height: `${previewDisplayHeight}px`,
      }}
    >
      <button
        type="button"
        className="absolute inset-x-0 top-0 z-10 flex h-4 cursor-row-resize items-start justify-center bg-transparent"
        onPointerDown={onStartResize}
        aria-label="Resize preview panel"
        title="Resize preview panel"
      >
        <span className="mt-0.5 inline-flex h-2.5 w-10 items-center justify-center rounded-full border border-border/70 bg-card/95 text-muted-foreground shadow-sm">
          <GripHorizontal className="size-3" />
        </span>
      </button>

      <div
        className={cn(
          "h-full w-full overflow-y-auto overflow-x-hidden pt-4 transition-opacity",
          previewHeight <= 12 && "pointer-events-none opacity-0",
        )}
      >
        <div
          ref={alphaHostRef}
          className={cn(
            "min-h-full w-full overflow-y-auto overflow-x-hidden px-1",
            isDarkMode ? "at-surface-dark" : "at-surface-light",
          )}
        />
      </div>
    </div>
  );
}
