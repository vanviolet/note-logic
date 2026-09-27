"use client";

import { useEffect, useRef } from "react";
import { cn } from "~/templates/lib/utils";

export interface TopographyBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  /** Number of contour lines */
  lineCount?: number;
  /** Line color */
  lineColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Animation speed */
  speed?: number;
  /** Line thickness */
  strokeWidth?: number;
}

export function TopographyBackground({
  className,
  children,
  lineCount = 14,
  lineColor = "rgba(120, 120, 120, 0.3)",
  backgroundColor = "#0a0a0f",
  speed = 1,
  strokeWidth = 1,
}: TopographyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRunning = useRef(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rect = container.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;

    // Fixed 1x scale is optimal for continuous soft topography lines
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    let tick = 0;

    const handleResize = () => {
      rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // Optimized height calculation: 3 sines instead of 5
    const getHeight = (x: number, t: number) => {
      const sx = x * 0.003;
      return (
        Math.sin(sx * 2 + t) * 30 +
        Math.sin(sx * 1.3 - t * 0.5) * 40 +
        Math.sin(sx * 0.7 + t * 0.3) * 50
      );
    };

    const animate = () => {
      if (!isRunning.current) return;
      tick += 0.006 * speed;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const spacing = height / Math.max(1, lineCount - 1);
      const padding = 50;

      for (let i = 0; i < lineCount; i++) {
        const baseY = spacing * i;
        ctx.beginPath();

        let started = false;
        // Step of 12px instead of 3px: 75% reduction in math & draw calls with smooth visuals
        for (let x = -padding; x <= width + padding; x += 12) {
          const terrainHeight = getHeight(x + i * 100, tick);
          const y = baseY + terrainHeight;

          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!isRunning.current) {
        isRunning.current = true;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const stopAnimation = () => {
      isRunning.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    startAnimation();

    return () => {
      stopAnimation();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      ro.disconnect();
    };
  }, [lineCount, lineColor, backgroundColor, speed, strokeWidth]);

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-hidden", className)}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Subtle gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 0%, ${backgroundColor} 100%)`,
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 40%, ${backgroundColor} 100%)`,
        }}
      />

      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  );
}

export default function TopographyBackgroundDemo() {
  return <TopographyBackground />;
}
