"use client";

import type React from "react";
import { cn } from "~/templates/lib/utils";

export interface RetroGridProps {
  /** Additional CSS classes */
  className?: string;
  /** Content to render on top of the grid */
  children?: React.ReactNode;
  /** Rotation angle of the grid in degrees */
  angle?: number;
  /** Grid cell size in pixels */
  cellSize?: number;
  /** Grid opacity value between 0 and 1 */
  opacity?: number;
  /** Primary grid line color (start of gradient) */
  lineColor?: string;
  /** End color for gradient along the lines — omit for solid color */
  lineColorEnd?: string;
  /** Add a soft glow/smoke halo around the lines */
  smoke?: boolean;
  /** Override smoke glow color (defaults to lineColor) */
  smokeColor?: string;
}

export function RetroGrid({
  className,
  children,
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lineColor = "#4b5563",
  lineColorEnd,
  smoke = false,
  smokeColor,
}: RetroGridProps) {
  // The gradient that paints the lines
  const lineGradient = lineColorEnd
    ? `linear-gradient(110deg, ${lineColor} 0%, ${lineColorEnd} 50%, ${lineColor} 100%)`
    : lineColor;

  const smokeGradient = lineColorEnd
    ? `linear-gradient(110deg, ${smokeColor ?? lineColor} 0%, ${lineColorEnd} 50%, ${smokeColor ?? lineColor} 100%)`
    : (smokeColor ?? lineColor);

  // CSS mask that restricts visibility to just the 1 px grid lines
  const gridMask = [
    `linear-gradient(to right, white 1px, transparent 0)`,
    `linear-gradient(to bottom, white 1px, transparent 0)`,
  ].join(", ");
  const gridMaskSize = `${cellSize}px ${cellSize}px, ${cellSize}px ${cellSize}px`;
  const gridMaskRepeat = "repeat, repeat";

  // Shared style for the scrolling wrapper (both layers live inside it)
  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    height: "300vh",
    width: "600vw",
    marginLeft: "-200%",
    transformOrigin: "100% 0 0",
    animation: "retro-grid-scroll 15s linear infinite",
  };

  // Factory for each line layer
  const lineLayerStyle = (
    background: string,
    blurPx?: number,
    layerOpacity?: number,
  ): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    background,
    // Standard mask
    maskImage: gridMask,
    maskSize: gridMaskSize,
    maskRepeat: gridMaskRepeat,
    // Webkit mask
    WebkitMaskImage: gridMask,
    WebkitMaskSize: gridMaskSize,
    WebkitMaskRepeat: gridMaskRepeat,
    ...(blurPx !== undefined ? { filter: `blur(${blurPx}px)` } : {}),
    ...(layerOpacity !== undefined ? { opacity: layerOpacity } : {}),
  });

  return (
    <div
      className={cn("fixed inset-0 overflow-hidden bg-neutral-950", className)}
    >
      <style>{`
        @keyframes retro-grid-scroll {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* Perspective grid container */}
      <div
        className="pointer-events-none absolute inset-0 perspective-[200px]"
        style={{ opacity }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: `rotateX(${angle}deg)` }}
        >
          {/* Single scrolling wrapper — both layers animate together */}
          <div style={wrapperStyle}>
            {/* Smoke / glow layer: blurred copy of gradient lines */}
            {smoke && <div style={lineLayerStyle(smokeGradient, 7, 0.55)} />}

            {/* Crisp gradient lines on top */}
            <div style={lineLayerStyle(lineGradient)} />
          </div>
        </div>

        {/* Horizon fade */}
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 to-transparent to-90%" />
      </div>

      {/* Content layer */}
      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  );
}

export default function RetroGridDemo() {
  return <RetroGrid />;
}
